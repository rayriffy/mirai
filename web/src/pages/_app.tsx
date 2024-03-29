import { Fragment, useEffect } from 'react'

import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { Context } from '../context/storeon'
import { HeadTitle } from '../core/components/headTitle'
import { AppLayout } from '../app/components/layout'
import { Footer } from '../app/components/footer'

import { AuthWrapper } from '../app/components/authWrapper'
import { DashboardWrapper } from '../app/components/dashboardWrapper'

import { getPerformance } from 'firebase/performance'
import { getAnalytics } from 'firebase/analytics'
import { createFirebaseInstance } from '../core/services/createFirebaseInstance'

import '../styles/nprogress.css'
import '../styles/tailwind.css'

const NextApp: NextPage<AppProps> = props => {
  const { Component, pageProps } = props

  const { asPath } = useRouter()

  useEffect(() => {
    const instance = createFirebaseInstance()

    getPerformance(instance.app)
    getAnalytics(instance.app)
  }, [])

  return (
    <Context>
      <HeadTitle />
      <AppLayout>
        {['/', '/register', '/forgot'].includes(asPath) ? (
          <Fragment>
            <Component {...pageProps} />
            <Footer />
          </Fragment>
        ) : (
          <AuthWrapper>
            {['/onboarding'].includes(asPath) ? (
              <Fragment>
                <Component {...pageProps} />
                <Footer />
              </Fragment>
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
