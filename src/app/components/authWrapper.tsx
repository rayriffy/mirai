import { useRouter } from 'next/router'
import { Fragment, FunctionComponent, useEffect, useState } from 'react'

import { useStoreon } from '../../context/storeon'

import { CenterSpinner } from '../../core/components/centerSpinner'
import { useUserMetadata } from '../services/useUserMetadata'

export const AuthWrapper: FunctionComponent = props => {
  const { push } = useRouter()
  const {
    user: { auth },
  } = useStoreon('user')

  useEffect(() => {
    if (auth === undefined) {
      push('/')
    }
  }, [auth])

  return (
    <>
      {auth === undefined ? (
        <CenterSpinner />
      ) : (
        <UserWrapper {...props} />
      )}
    </>
  )
}

export const UserWrapper: FunctionComponent = props => {
  const { children } = props

  const { asPath, push } = useRouter()
  const {
    user: { auth, metadata: contextMeta },
    dispatch,
  } = useStoreon('user')
  const metadata = useUserMetadata(auth?.uid ?? '')
  const [lock, setLock] = useState(true)

  useEffect(() => {
    if (metadata !== undefined) {
      dispatch('user/metadata', metadata)
    }
  }, [metadata])

  useEffect(() => {
    if (contextMeta === null && asPath !== '/onboarding') {
      push('/onboarding')
    } else if (contextMeta === null && asPath === '/onboarding') {
      setLock(false)
    }
  }, [contextMeta, asPath])

  return (
    <Fragment>
      {(contextMeta === undefined || contextMeta === null) && lock ? (
        <CenterSpinner />
      ) : children}
    </Fragment>
  )
}
