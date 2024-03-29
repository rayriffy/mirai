const fs = require('fs')
const path = require('path')

const http = require('http')

const firebase = require('firebase-admin')
const { networkInterfaces } = require('os')

const { Server } = require('socket.io')
const dotenv = require('dotenv')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const expectedEnv = '/boot/mirai.credentials'
const backupEnv = path.join(process.cwd(), '..', '.env')

const targetEnv = fs.existsSync(expectedEnv) ? expectedEnv : backupEnv

console.log(`using configuration from ${targetEnv}`)

dotenv.config({
  path: targetEnv,
})

const { STORE_ID, PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY } = process.env

if (!STORE_ID) {
  console.error('STORE_ID is not set')
  throw 'no store id'
}
const wait = duration => new Promise(res => setTimeout(res, duration))

;(async () => {
  // initialize firebase
  // if (process.env.MIRAI_ENVIRONMENT === 'dev') {}
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: PROJECT_ID,
      clientEmail: CLIENT_EMAIL,
      privateKey: PRIVATE_KEY,
    }),
    databaseURL:
      'https://mirai-da346-default-rtdb.asia-southeast1.firebasedatabase.app/',
  })

  const server = http.createServer()

  const logger = (unit, ...args) => {
    // log to actual console
    require('debug')(`mirai:${unit}`)(...args)

    // try to log into network
    try {
      const targetDate = dayjs.tz(dayjs(), 'Asia/Bangkok').format('YYYYMMDD')
      firebase
        .database()
        .ref(`stores/${STORE_ID}/${targetDate}`)
        .push({
          unit,
          message: args[0].replace(/%([a-zA-Z%])/g, match => {
            if (match === '%%') {
              return '%'
            }
            const val = args[1]
            args.splice(0, 1)
            return val
          }),
          createdAt: dayjs().toISOString(),
        })
    } catch (e) {
      // console.error(e)
    }
  }

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

  io.on('connection', socket => {
    logger('socket', 'esp32 connected to server')

    socket.on('tx-reply', async transactionId => {
      logger('processor', 'got response from transaction %s', transactionId)

      // update transaction status to success
      const transaction = await firebase
        .firestore()
        .collection('transactions')
        .doc(transactionId)
        .get()

      if (transaction.data().status === 'processing') {
        logger(
          'firebase',
          'updating transaction %s to status %s',
          transactionId,
          'success'
        )
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

    socket.on('pong', async arcadeId => {
      await firebase.database().ref(`arcades/${arcadeId}`).set({
        pingAt: dayjs().toISOString(),
      })
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

    logger(
      'processor',
      `sending transaction %s to process at arcade %s with amount of %d token`,
      transaction.id,
      transactionData.arcadeId,
      transactionData.token
    )

    io.emit(eventName, payload)

    // at 1 minute mark, check tx again if tx still processing then update to failed
    setTimeout(async () => {
      const transactionRefetched = await transaction.ref.get()

      if (transactionRefetched.data().status === 'processing') {
        logger(
          'processor',
          'transaction %s timed-out! canceling order',
          transactionRefetched.id
        )

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
            [`balance_${transactionRefetched.data().currency}`]:
              firebase.firestore.FieldValue.increment(
                Math.abs(transactionRefetched.data().token)
              ),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })

        const refundPayload = {
          type: 'refund',
          transactionId: transactionRefetched.id,
          userId: transactionRefetched.data().userId,
          token: Math.abs(transactionRefetched.data().token),
          currency: transactionRefetched.data().currency,
          status: 'success',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
        const refundJob = firebase
          .firestore()
          .collection('transactions')
          .add(refundPayload)

        await Promise.all([transactionJob, userJob, refundJob])

        logger(
          'processor',
          'refunded %d %s to user %s',
          Math.abs(transactionRefetched.data().token),
          transactionRefetched.data().currency,
          transactionRefetched.data().userId
        )
      }
    }, 60 * 1000)
  }

  // every 1 minute try to ping esp32
  setInterval(() => {
    io.emit('ping', {})
  }, 60 * 1000)
})().catch(e => {
  require('debug')(`mirai:server`)(e)
  process.exit(1)
})
