import { useEffect, useState } from 'react'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { createFirebaseInstance } from './createFirebaseInstance'
import { useStoreon } from '../../context/storeon'

export const useAuth = () => {
  const { dispatch } = useStoreon('user')

  useEffect(() => {
    const instance = createFirebaseInstance()

    const listener = onAuthStateChanged(getAuth(instance), res => {
      dispatch('user/auth', res)
    })

    return () => listener()
  }, [])
}
