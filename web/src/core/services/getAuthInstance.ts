import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { createFirebaseInstance } from './createFirebaseInstance'

export const getAuthInstance = () => {
  const { app } = createFirebaseInstance()
  const auth = getAuth(app)

  if (process.env.NODE_ENV === 'development') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
    } catch (e) {}
  }

  return auth
}
