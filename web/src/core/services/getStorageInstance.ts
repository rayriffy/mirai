import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { createFirebaseInstance } from './createFirebaseInstance'

export const getStorageInstance = () => {
  const { app } = createFirebaseInstance()
  const storage = getStorage(app)

  if (process.env.NODE_ENV === 'development') {
    try {
      connectStorageEmulator(storage, 'localhost', 9199)
    } catch (e) {}
  }

  return storage
}
