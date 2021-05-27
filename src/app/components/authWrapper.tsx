import { useRouter } from 'next/router'
import { FunctionComponent, useEffect } from 'react'

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
    user: { auth },
    dispatch,
  } = useStoreon('user')
  const metadata = useUserMetadata(auth.uid)

  useEffect(() => {
    if (metadata !== undefined) {
      dispatch('user/metadata', metadata)

      if (metadata === null && asPath !== '/onboarding') {
        push('/onboarding')
      }
    }
  }, [metadata, asPath])

  return (
    <>
      {metadata === undefined ? (
        <CenterSpinner />
      ) : (
        children
      )}
    </>
  )
}
