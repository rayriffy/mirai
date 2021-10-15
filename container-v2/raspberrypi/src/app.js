const { Server } = require('socket.io')
const firebase = require('firebase-admin')
const { networkInterfaces } = require('os')
const dotenv = require('dotenv')

const { STORE_ID } = process.env

dotenv.config()

const wait = duration => new Promise(res => setTimeout(res, duration))

;(async () => {
  // initialize socket.io server
  const io = new Server(11451, {
    path: '/mirai-tx',
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    origins: '*:*',
  })

  console.log('[system]: booting')
  await wait(50000000)

  // initialize firebase
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY,
    }),
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
  console.log('[system]: all possible ip addresses')
  allPossibleIps.map(o => console.log(`[system]: ${o}`))

  // start listen for incoming transaction
  console.log(`[system]: listening for transaction in store ${STORE_ID}`)
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

    console.log(
      `[system]: sending transaction ${transaction.id} to process (${transactionData.arcadeId}::${transactionData.token})`
    )

    io.emit(eventName, payload)

    // at 1 minute mark, check tx again if tx still processing then update to failed
    setTimeout(async () => {
      const transactionRefetched = await transaction.ref.get()

      if (transactionRefetched.data().status === 'processing') {
        console.log(`[system]: transaction ${transactionRefetched.id} timed-out! canceling order`)

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
        console.log(`[system]: refunded ${Math.abs(transactionRefetched.data().value)}THB user ${transactionRefetched.data().userId}`)
      }
    }, 60 * 1000)
  }

  io.on('connection', socket => {
    // listen for incoming transaction reply
    socket.on('tx-reply', async transactionId => {
      console.log(`[system]: putting ${transactionId} to success`)
      // update transaction status to success
      const transaction = await firebase
        .firestore()
        .collection('transactions')
        .doc(transactionId)
        .get()

      if (transaction.data().status === 'processing') {
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
})().catch(e => {
  console.error(e)
  process.exit(1)
})
