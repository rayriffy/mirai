import { NextApiHandler } from 'next'

import crypto from 'crypto'

import firebase from 'firebase-admin'
import { initializeFirebase } from '../../modules/api/services/initializeFirebase'
import { getUserAndFilterAuth } from '../../modules/api/services/getUserAndFilterAuth'
import { User } from '../../core/@types/firebase/User'

const api: NextApiHandler = async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    try {
      initializeFirebase()

      const userData = await getUserAndFilterAuth(
        req.headers.authorization,
        [],
        true
      )

      const { preferredBranch, displayName } = req.body

      const payload: User = {
        displayName,
        preferredBranch,
        emailHash: crypto.createHash('md5').update(userData.auth.email).digest("hex"),
        role: 'default',
      }

      firebase.firestore().collection('users').doc(userData.auth.uid).set(payload)

      return res.send({
        success: true,
        message: 'ok',
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
