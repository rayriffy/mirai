import { useEffect } from 'react'

import { onAuthStateChanged, User } from 'firebase/auth'
import { useStoreon } from '../../context/storeon'
import { getAuthInstance } from './getAuthInstance'

export const useAuth = () => {
  const { dispatch } = useStoreon('user')

  useEffect(() => {
    const listener = onAuthStateChanged(getAuthInstance(), res => {
      dispatch('user/auth', res)
    })

    return () => listener()
  }, [])
}
