import { useMemo } from 'react'

import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { useStoreon } from '../context/storeon'
import { Spinner } from '../core/components/spinner'
import { classNames } from '../core/services/classNames'

const SigninModule = dynamic(async () => await import('../modules/auth/signin/components').then(o => o.SigninModule))

const Page: NextPage = () => {
  const { user: { auth } } = useStoreon('user')

  const isRequireSignin = useMemo(() => auth === null, [auth])

  return (
    <div className={classNames(isRequireSignin ? '' : 'items-center', 'min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8')}>
      {isRequireSignin ? <SigninModule /> : <Spinner />}
      {auth === undefined ? 'undefined' : auth === null ? 'null' : JSON.stringify(auth)}
    </div>
  )
}

export default Page
