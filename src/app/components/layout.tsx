import { FunctionComponent, Fragment, useEffect } from 'react'

import { useRouter } from 'next/router'

import { useStoreon } from '../../context/storeon'
import { useAuth } from '../../core/services/useAuth'

import { Footer } from './footer'
import { isAgentiOS } from '../../core/services/isAgentiOS'

export const AppLayout: FunctionComponent = props => {
  const { children } = props

  const {
    dispatch,
    startup,
    user: { auth },
  } = useStoreon('user', 'startup')

  useEffect(() => {
    if (isAgentiOS() && !startup) {
      dispatch('startup/init')
      window.location.reload()
    }
  }, [])

  useAuth()
  const { asPath, push } = useRouter()

  useEffect(() => {
    if (
      ['/', '/register', '/forgot'].includes(asPath) &&
      auth !== undefined &&
      auth !== null
    ) {
      push('/dashboard')
    }
  }, [asPath, auth])

  return <div className="bg-gray-50 min-h-screen">{children}</div>
}
