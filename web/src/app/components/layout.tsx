import { FunctionComponent, PropsWithChildren, useEffect } from 'react'

import { useRouter } from 'next/router'

import NProgress from 'nprogress'

import { useStoreon } from '../../context/storeon'
import { useAuth } from '../../core/services/useAuth'

export const AppLayout: FunctionComponent<PropsWithChildren<{}>> = props => {
  const { children } = props

  const {
    dispatch,
    next: { path },
    user: { auth },
  } = useStoreon('user', 'next')

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
