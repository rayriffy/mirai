import { useEffect } from 'react'

import { getAuth, getRedirectResult } from 'firebase/auth'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'

export const useAuthReader = () => {
  useEffect(() => {
    const instance = createFirebaseInstance()
    getRedirectResult(getAuth(instance))
  }, [])
}
