import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { createFirebaseInstance } from './createFirebaseInstance'

export const getDatabaseInstance = () => {
  const { app } = createFirebaseInstance()
  const auth = getDatabase(app)

  if (process.env.NODE_ENV === 'development' && process.env.disableEmulator !== 'true') {
    try {
      // connectAuthEmulator(auth, 'http://localhost:9099')
    } catch (e) {}
  }

  return auth
}
