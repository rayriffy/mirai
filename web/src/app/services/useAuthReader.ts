import { useEffect } from 'react'

import { getRedirectResult } from 'firebase/auth'
import { getAuthInstance } from '../../core/services/getAuthInstance'

export const useAuthReader = () => {
  useEffect(() => {
    getRedirectResult(getAuthInstance())
  }, [])
}
