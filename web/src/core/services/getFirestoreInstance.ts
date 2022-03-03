import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { createFirebaseInstance } from './createFirebaseInstance'

export const getFirestoreInstance = () => {
  const instance = createFirebaseInstance()
  const firestore = getFirestore(instance)

  if (process.env.NODE_ENV === 'development') {
    try {
      connectFirestoreEmulator(firestore, 'localhost', 8080)
    } catch (e) {}
  }

  return firestore
}
