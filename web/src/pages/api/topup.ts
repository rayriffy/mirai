import { NextApiHandler } from 'next'
import omit from 'lodash/omit'

import firebase from 'firebase-admin'
import { initializeFirebase } from '../../modules/api/services/initializeFirebase'
import { getUserAndFilterAuth } from '../../modules/api/services/getUserAndFilterAuth'

import { Transaction } from '../../core/@types/firebase/Transaction'

const api: NextApiHandler = async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    try {
      initializeFirebase()

      const userData = await getUserAndFilterAuth(req.headers.authorization, [
        'staff',
        'admin',
      ])

      const {
        auth: { uid },
      } = userData
      const { userId, amount } = req.body

      // build topup payload
      const topupTransaction: Transaction = {
        type: 'topup',
        createdBy: uid,
        userId,
        token: amount,
        status: 'success',
        currency: 'coin',
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      }

      // add money
      const updatePromise = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .update({
          balance_coin: firebase.firestore.FieldValue.increment(Math.abs(amount)),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

      // inject tansaction
      const transactionPromise = firebase
        .firestore()
        .collection('transactions')
        .add({
          ...omit(topupTransaction, ['createdAt', 'updatedAt']),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

      await Promise.all([updatePromise, transactionPromise]).then(
        ([updateUser, transaction]) => {
          console.log(transaction.id)
        }
      )

      return res.send({
        success: true,
        message: 'balance added',
      })
    } catch (e) {
      console.error(e)
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
