import { NextApiHandler } from 'next'

import firebase from 'firebase-admin'
import { initializeFirebase } from '../../modules/api/services/initializeFirebase'
import { getUserAndFilterAuth } from '../../modules/api/services/getUserAndFilterAuth'

import { Transaction } from '../../core/@types/firebase/Transaction'

const api: NextApiHandler = async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    try {
      initializeFirebase()

      const userData = await getUserAndFilterAuth(
        req.headers.authorization,
        [],
        true
      )

      const {
        auth: { uid },
      } = userData
      const { transactionId } = req.body

      // get transaction
      const transactionRef = firebase
        .firestore()
        .collection('transactions')
        .doc(transactionId)
      const transactionDoc = await transactionRef.get()
      const transactionData = transactionDoc.data() as Transaction

      if (!transactionDoc.exists) {
        return res.status(400).send({
          success: false,
          message: 'transaction not found',
        })
      } else if (transactionData.type !== 'payment') {
        return res.status(400).send({
          success: false,
          message: 'invalid transaction type',
        })
      } else if (transactionData.userId !== uid) {
        return res.status(400).send({
          success: false,
          message: 'not transaction owner',
        })
      } else if (transactionData.status !== 'pending') {
        return res.status(400).send({
          success: false,
          message: 'not allowed at current state',
        })
      } else {
        // cancel transaction
        const transactionJob = transactionRef.update({
          status: 'cancelled',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        // refund money
        const userJob = firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .update({
            ...(transactionData.currency === 'coin' ? {
              balance_coin: firebase.firestore.FieldValue.increment(
                Math.abs(transactionData.token)
              ),
            } : {
              balance_buck: firebase.firestore.FieldValue.increment(
                Math.abs(transactionData.token)
              ),
            }),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })

        await Promise.all([transactionJob, userJob])

        return res.status(200).send({
          success: true,
          message: 'cancelled and refunded',
        })
      }
    } catch (e) {
      return res.status(403).send({
        succcess: false,
        message: 'unauthorized',
      })
    }
  } else {
    return res.status(405).send({
      success: false,
      message: 'invalid method',
    })
  }
}

export default api
