import { NextApiHandler } from 'next'

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
        ['staff', 'admin']
      )

      const {
        auth: { uid },
      } = userData
      const { userId, amount } = req.body
      
      return res.send({
        success: true,
        message: 'ok'
      })
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
