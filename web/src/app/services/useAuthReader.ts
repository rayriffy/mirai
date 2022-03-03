import { useEffect } from 'react'

import { getRedirectResult } from 'firebase/auth'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'
import { getAuthInstance } from '../../core/services/getAuthInstance'

export const useAuthReader = () => {
  useEffect(() => {
    const instance = createFirebaseInstance()
    getRedirectResult(getAuthInstance())
  }, [])
}
