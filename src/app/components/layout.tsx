import { useRouter } from 'next/router'
import { FunctionComponent, Fragment, useEffect } from 'react'
import { useStoreon } from '../../context/storeon'
import { useAuth } from '../../core/services/useAuth'
import { useAuthReader } from '../services/useAuthReader'

import { Footer } from './footer'

export const AppLayout: FunctionComponent = props => {
  const { children } = props

  const { asPath, push } = useRouter()
  const user = useAuth()

  const { dispatch } = useStoreon('user')

  useAuthReader()

  useEffect(() => {
    dispatch('user/auth', user)
  }, [user])

  useEffect(() => {
    if (
      ['/', '/register', '/forgot'].includes(asPath) &&
      user !== undefined &&
      user !== null
    ) {
      push('/dashboard')
    }
  }, [asPath, user])

  return (
    <Fragment>
      <main className="bg-gray-50 min-h-screen">{children}</main>
      <Footer />
    </Fragment>
  )
}
