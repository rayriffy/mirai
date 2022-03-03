import firebase from 'firebase-admin'

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    return process.env.NODE_ENV === 'development'
      ? firebase.initializeApp({
          projectId: process.env.PROJECT_ID,
        })
      : firebase.initializeApp({
          credential: firebase.credential.cert({
            projectId: process.env.PROJECT_ID,
            clientEmail: process.env.CLIENT_EMAIL,
            privateKey: process.env.PRIVATE_KEY,
          }),
        })
  } else {
    return firebase.app
  }
}
