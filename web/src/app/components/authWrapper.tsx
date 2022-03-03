import { useRouter } from 'next/router'
import { Fragment, FunctionComponent, useEffect, useState } from 'react'

import { useStoreon } from '../../context/storeon'

import { CenterSpinner } from '../../core/components/centerSpinner'
import { useUserMetadata } from '../services/useUserMetadata'

export const AuthWrapper: FunctionComponent = props => {
  const { push, asPath } = useRouter()
  const {
    user: { auth },
    dispatch,
  } = useStoreon('user', 'next')

  useEffect(() => {
    if (auth === undefined) {
      dispatch('next/set', asPath)
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
  } = useStoreon('user')
  const [lock, setLock] = useState(true)

  useUserMetadata(auth?.uid)

  useEffect(() => {
    if (contextMeta === null && asPath === '/onboarding') {
      setLock(false)
    }
  }, [contextMeta, asPath])

  return (
    <Fragment>
      {(contextMeta === undefined || contextMeta === null) && lock ? (
        <Fragment>
          <CenterSpinner />
        </Fragment>
      ) : (
        children
      )}
    </Fragment>
  )
}
