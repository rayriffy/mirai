import { FunctionComponent, useEffect } from 'react'

import { useRouter } from 'next/router'

import NProgress from 'nprogress'

import { useStoreon } from '../../context/storeon'
import { useAuth } from '../../core/services/useAuth'

import { isAgentiOS } from '../../core/services/isAgentiOS'

export const AppLayout: FunctionComponent = props => {
  const { children } = props

  const {
    dispatch,
    startup,
    next: { path },
    user: { auth },
  } = useStoreon('user', 'startup', 'next')

  useEffect(() => {
    if (isAgentiOS() && !startup) {
      dispatch('startup/init')
      window.location.reload()
    }
  }, [startup])

  useAuth()
  const { asPath, push, events } = useRouter()

  const routeChangeStart = () => {
    NProgress.configure({ minimum: 0.3 })
    NProgress.start()
  }

  const routeChangeEnd = () => {
    NProgress.done()
  }

  useEffect(() => {
    events.on('routeChangeStart', routeChangeStart)
    events.on('routeChangeComplete', routeChangeEnd)
    events.on('routeChangeError', routeChangeEnd)

    return () => {
      events.off('routeChangeStart', routeChangeStart)
      events.off('routeChangeComplete', routeChangeEnd)
      events.off('routeChangeError', routeChangeEnd)
    }
  }, [])

  useEffect(() => {
    if (
      ['/', '/register', '/forgot'].includes(asPath) &&
      auth !== undefined &&
      auth !== null
    ) {
      if (path === undefined) {
        push('/dashboard')
      } else {
        const targetPath = path
        dispatch('next/unset')
        push(targetPath)
      }
    }
  }, [asPath, auth])

  return <div className="bg-gray-50 min-h-screen">{children}</div>
}
