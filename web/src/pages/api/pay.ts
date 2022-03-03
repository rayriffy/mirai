import { NextApiHandler } from 'next'
import omit from 'lodash/omit'

import firebase from 'firebase-admin'
import { initializeFirebase } from '../../modules/api/services/initializeFirebase'
import { getUserAndFilterAuth } from '../../modules/api/services/getUserAndFilterAuth'

import { Arcade } from '../../core/@types/firebase/Arcade'
import { Transaction } from '../../core/@types/firebase/Transaction'

const api: NextApiHandler = async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    try {
      // console.log(process.env)
      initializeFirebase()

      const userData = await getUserAndFilterAuth(
        req.headers.authorization,
        [],
        true
      )

      const {
        auth: { uid },
        metadata: { balance_coin, balance_buck = 0 },
      } = userData
      const { targetArcade, token } = req.body

      // get arcade detail
      const arcadeDoc = await firebase
        .firestore()
        .collection('arcades')
        .doc(targetArcade)
        .get()

      if (arcadeDoc.exists) {
        const arcadeData = arcadeDoc.data() as Arcade

        const balance =
          arcadeData.storeCurrency === 'coin' ? balance_coin : balance_buck

        if (balance - token >= 0) {
          const transactionPayload: Transaction = {
            type: 'payment',
            arcadeId: arcadeDoc.id,
            arcadeName: arcadeData.name,
            storeId: arcadeData.storeId,
            storeName: arcadeData.storeName,
            userId: uid,
            token: token,
            status: 'pending',
            currency: arcadeData.storeCurrency,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
          }

          // deduct money
          const updatePromise = firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .update({
              ...(arcadeData.storeCurrency === 'coin'
                ? {
                    balance_coin: firebase.firestore.FieldValue.increment(
                      -Math.abs(token)
                    ),
                  }
                : {
                    balance_buck: firebase.firestore.FieldValue.increment(
                      -Math.abs(token)
                    ),
                  }),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

          // inject tansaction
          const transactionPromise = firebase
            .firestore()
            .collection('transactions')
            .add({
              ...omit(transactionPayload, ['createdAt', 'updatedAt']),
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

          const [updateedUserDoc, transactionDoc] = await Promise.all([
            updatePromise,
            transactionPromise,
          ])

          return res.status(201).send({
            success: true,
            message: 'transaction added',
            data: transactionDoc.id,
          })
        } else {
          return res.status(400).send({
            success: false,
            message: 'insufficient balance',
          })
        }
      } else {
        return res.status(404).send({
          success: false,
          message: 'arcade not found',
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
