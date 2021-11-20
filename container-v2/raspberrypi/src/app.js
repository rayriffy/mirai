const http = require('http')
const server = http.createServer()
const debug = require('debug')

const firebase = require('firebase-admin')
const { networkInterfaces } = require('os')

const { Server } = require("socket.io")
const dotenv = require('dotenv')

dotenv.config()

const logger = (unit, ...args) => debug(`mirai:${unit}`)(...args)
const wait = duration => new Promise(res => setTimeout(res, duration))

const {
  STORE_ID,
  PROJECT_ID,
  CLIENT_EMAIL,
  PRIVATE_KEY,
} = process.env

  ; (async () => {
    const server = http.createServer()

    const io = new Server(server, {
      path: '/mirai-tx',
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      origins: '*:*',
      allowEIO3: true,
    })

    server.listen(11451, () => {
      logger('server', 'listening on port %s', '11451')
    })

    // list all ipv4
    const allPossibleIps = Object.entries(networkInterfaces())
      .filter(([key, val]) => val.some(({ family }) => family === 'IPv4'))
      .map(([key, val]) =>
        val
          .filter(({ family }) => family === 'IPv4')
          .map(({ address }) => address)
      )
      .flat()
    logger('server', 'all possible ips:')
    allPossibleIps.map(o => logger('server', o))

    // initialize firebase
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: PROJECT_ID,
        clientEmail: CLIENT_EMAIL,
        privateKey: PRIVATE_KEY,
      }),
    })

    io.on('connection', (socket) => {
      logger('socket', 'esp32 connected to server')

      socket.on('tx-reply', async transactionId => {
        logger('socket', 'got response from transaction %s', transactionId)
  
        // update transaction status to success
        const transaction = await firebase
          .firestore()
          .collection('transactions')
          .doc(transactionId)
          .get()
  
        if (transaction.data().status === 'processing') {
          logger('firebase', 'updating transaction %s to status %s', transactionId, 'success')
          await firebase
            .firestore()
            .collection('transactions')
            .doc(transactionId)
            .update({
              status: 'success',
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }
      })
    })

    logger('server', 'booting')
    await wait(50000000)

    logger('firebase', 'listening for transactions in store %s', STORE_ID)
    firebase
      .firestore()
      .collection('transactions')
      .where('type', '!=', 'payment')
      .where('storeId', '==', STORE_ID)
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            // shorten payload
            processTransaction(change.doc)
          }
        })
      })

    // function to process payload
    const processTransaction = async transaction => {
      // update transaction status to processd
      await firebase
        .firestore()
        .collection('transactions')
        .doc(transaction.id)
        .update({
          status: 'processing',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

      // transmit the data
      const transactionData = transaction.data()
      const expectedReply = 3 * 1000 + transactionData.token * 100

      // emit the data to the arcade
      const eventName = transactionData.arcadeId
      const payload = {
        transactionId: transaction.id,
        token: transactionData.token,
      }

      logger('processor', `sending transaction %s to process at arcade %s with amount of %d token`, transaction.id, transactionData.arcadeId, transactionData.token)

      io.emit(eventName, payload)

      // at 1 minute mark, check tx again if tx still processing then update to failed
      setTimeout(async () => {
        const transactionRefetched = await transaction.ref.get()

        if (transactionRefetched.data().status === 'processing') {
          logger('processor', 'transaction %s timed-out! canceling order', transactionRefetched.id)

          // update transaction
          const transactionJob = transactionRefetched.ref.update({
            status: 'failed',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })

          // refund money to user
          const userJob = firebase
            .firestore()
            .collection('users')
            .doc(transactionRefetched.data().userId)
            .update({
              balance: firebase.firestore.FieldValue.increment(Math.abs(transactionRefetched.data().value)),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

          await Promise.all([transactionJob, userJob])

          logger('processor', 'refunded %d THB to user %s', Math.abs(transactionRefetched.data().value), transactionRefetched.data().userId)
        }
      }, 60 * 1000)
    }
  })().catch(e => {
    logger('server', e)
    process.exit(1)
  })
