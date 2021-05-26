import { useRouter } from 'next/router'
import { FunctionComponent, useEffect, useMemo } from 'react'

import { useStoreon } from '../../context/storeon'

import { Spinner } from '../../core/components/spinner'
import { useUserMetadata } from '../services/useUserMetadata'

export const AuthWrapper: FunctionComponent = props => {
  const { push } = useRouter()
  const {
    user: { auth },
  } = useStoreon('user')

  console.log({ auth })

  useEffect(() => {
    if (auth === undefined) {
      push('/')
    }
  }, [auth])

  return (
    <>
      {auth === undefined ? (
        <div>
          <Spinner />
        </div>
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
        <div>
          <Spinner />
        </div>
      ) : (
        children
      )}
    </>
  )
}
