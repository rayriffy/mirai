import { useRouter } from 'next/router'
import { Fragment, FunctionComponent, useEffect } from 'react'

import { useStoreon } from '../../context/storeon'

import { CenterSpinner } from '../../core/components/centerSpinner'
import { useUserMetadata } from '../services/useUserMetadata'

export const AuthWrapper: FunctionComponent = props => {
  const { push } = useRouter()
  const {
    user: { auth },
  } = useStoreon('user')

  useEffect(() => {
    if (auth === null) {
      push('/')
    }
  }, [auth])

  return (
    <>
      auth
      {auth === undefined || auth === null ? (
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
  const metadata = useUserMetadata(auth.uid)

  useEffect(() => {
    if (metadata !== undefined) {
      dispatch('user/metadata', metadata)
    }
  }, [metadata])

  useEffect(() => {
    if (contextMeta === null && asPath !== '/onboarding') {
      push('/onboarding')
    }
  }, [contextMeta, asPath])

  return (
    <Fragment>
      user
      {contextMeta === undefined || contextMeta === null ? (
        <CenterSpinner />
      ) : (
        <>
          inapp
          {children}
        </>
      )}
    </Fragment>
  )
}
