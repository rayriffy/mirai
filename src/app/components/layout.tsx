import { FunctionComponent, Fragment, useEffect } from 'react'

import { useRouter } from 'next/router'

import { useStoreon } from '../../context/storeon'
import { useAuth } from '../../core/services/useAuth'

import { Footer } from './footer'

export const AppLayout: FunctionComponent = props => {
  const { children } = props

  useAuth()
  const { asPath, push } = useRouter()

  const {
    user: { auth },
  } = useStoreon('user')

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
