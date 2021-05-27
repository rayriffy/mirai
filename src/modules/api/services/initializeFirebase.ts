import firebase from 'firebase-admin'

export const initializeFirebase = () => {
  return !firebase.apps.length ?
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY,
      })
    })
  : firebase.app
}