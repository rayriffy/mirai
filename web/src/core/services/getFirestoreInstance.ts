import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { createFirebaseInstance } from './createFirebaseInstance'

export const getFirestoreInstance = () => {
  const { app } = createFirebaseInstance()
  const firestore = getFirestore(app)

  if (process.env.NODE_ENV === 'development' && process.env.disableEmulator !== 'true') {
    try {
      connectFirestoreEmulator(firestore, 'localhost', 8080)
    } catch (e) {}
  }

  return firestore
}
