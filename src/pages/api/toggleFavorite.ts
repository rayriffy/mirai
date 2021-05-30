import { NextApiHandler } from 'next'

import firebase from 'firebase-admin'
import { initializeFirebase } from '../../modules/api/services/initializeFirebase'
import { getUserAndFilterAuth } from '../../modules/api/services/getUserAndFilterAuth'

const api: NextApiHandler = async (req, res) => {
  if (req.method.toLowerCase() === 'post') {
    try {
      initializeFirebase()

      const userData = await getUserAndFilterAuth(
        req.headers.authorization,
        [],
        true
      )

      // todo: remove favorite
      const { targetArcade } = req.body
      const {
        auth: { uid },
        metadata: { favoriteArcades },
      } = userData

      // if arcadeId found in favoriteArcades, then remove. otherwise add
      const processedResult = favoriteArcades.includes(targetArcade)
        ? favoriteArcades.filter(o => o !== targetArcade)
        : [...favoriteArcades, targetArcade]

      await firebase.firestore().collection('users').doc(uid).update({
        favoriteArcades: processedResult,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

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
