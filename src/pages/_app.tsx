import { useEffect } from 'react'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { Context } from '../context/storeon'
import { HeadTitle } from '../core/components/headTitle'
import { AppLayout } from '../app/components/layout'
import { useStoreon } from '../context/storeon'

import { AuthWrapper } from '../app/components/authWrapper'
import { DashboardWrapper } from '../app/components/dashboardWrapper'

import { useAuthReader } from '../app/services/useAuthReader'
import { useAuth } from '../core/services/useAuth'

import '../styles/tailwind.css'

const NextApp: NextPage<AppProps> = props => {
  const { Component, pageProps } = props

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
    <Context>
      <HeadTitle />
      <AppLayout>
        {['/', '/register', '/forgot'].includes(asPath) ? (
          <Component {...pageProps} />
        ) : (
          <AuthWrapper>
            {['/onboarding'].includes(asPath) ? (
              <Component {...pageProps} />
            ) : (
              <DashboardWrapper>
                <Component {...pageProps} />
              </DashboardWrapper>
            )}
          </AuthWrapper>
        )}
      </AppLayout>
    </Context>
  )
}

export default NextApp
