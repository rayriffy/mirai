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
      const { auth: { uid }, metadata: { favoriteArcades } } = userData

      const filteredOutResult = favoriteArcades.filter(o => o !== targetArcade)

      console.log({ filteredOutResult })

      await firebase.firestore().collection('users').doc(uid).update({
        favoriteArcades: filteredOutResult,
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
