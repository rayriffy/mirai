import firebase from 'firebase-admin'

export const verifyAppCheck = async (appCheckToken: string | undefined) => {
  if (!appCheckToken) {
    throw 'unauthorized'
  } else {
    try {
      const appCheckClaims = await firebase
        .appCheck()
        .verifyToken(appCheckToken)

      return true
    } catch (err) {
      throw 'unauthorized'
    }
  }
}
