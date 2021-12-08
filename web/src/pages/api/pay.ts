import { NextApiHandler } from 'next'
import { omit } from 'lodash'

import { getCalculatedPrice } from '../../core/services/getCalculatedPrice'

import firebase from 'firebase-admin'
import { initializeFirebase } from '../../modules/api/services/initializeFirebase'
import { getUserAndFilterAuth } from '../../modules/api/services/getUserAndFilterAuth'

import { Arcade } from '../../core/@types/firebase/Arcade'
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
        metadata: { balance },
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

        const targetPrice = getCalculatedPrice(
          token,
          arcadeData.tokenPerCredit,
          arcadeData.discountedPrice ?? arcadeData.tokenPerCredit
        )

        if (balance - targetPrice.price >= 0) {
          const transactionPayload: Transaction = {
            type: 'payment',
            arcadeId: arcadeDoc.id,
            arcadeName: arcadeData.name,
            storeId: arcadeData.storeId,
            storeName: arcadeData.storeName,
            userId: uid,
            token: token,
            value: targetPrice.price,
            status: 'pending',
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
          }

          // deduct money
          const updatePromise = firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .update({
              balance: firebase.firestore.FieldValue.increment(
                -Math.abs(targetPrice.price)
              ),
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

          await Promise.all([updatePromise, transactionPromise])

          return res.status(201).send({
            success: true,
            message: 'transaction added',
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
