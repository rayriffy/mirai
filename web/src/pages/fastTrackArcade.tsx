import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useStoreon } from '../context/storeon'
import { Spinner } from '../core/components/spinner'

const Page: NextPage = props => {
  const { user: { metadata } } = useStoreon('user')
  const router = useRouter()

  useEffect(() => {
    if (metadata?.preferredStore !== null && metadata?.preferredStore !== undefined) {
      router.push(`/dashboard/arcades/${metadata?.preferredStore}`)
    }
  }, [metadata?.preferredStore])

  return (
    <div
      className={'min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center'}
    >
      <Spinner />
    </div>
  )
}

export default Page
