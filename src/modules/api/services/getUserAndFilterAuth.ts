import firebase from 'firebase-admin'

import { Role } from '../../../core/@types/Role'
import { User } from '../../../core/@types/firebase/User'

export const getUserAndFilterAuth = async (
  authHeader: string,
  allowRoles: Role[],
  ignoreAuthCheck = false
) => {
  const extractedToken = /Bearer (.+)/.exec(authHeader)[1] ?? ''
  const decodedToken = await firebase.auth().verifyIdToken(extractedToken)

  const userAuth = await firebase.auth().getUser(decodedToken.uid)
  const userMetadata = (await firebase
    .firestore()
    .collection('users')
    .doc(decodedToken.uid)
    .get()
    .then(o => o.data())) as User

  console.log(decodedToken.uid)

  if (ignoreAuthCheck || allowRoles.includes(userMetadata?.role)) {
    return {
      auth: userAuth,
      metadata: userMetadata,
    }
  } else {
    throw 'unauthorized'
  }
}
