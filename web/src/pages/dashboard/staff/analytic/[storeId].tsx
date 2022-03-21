import { useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { Analytics } from '../../../../modules/analytics/components'

import { useStoreon } from '../../../../context/storeon'
import { useLocale } from '../../../../core/services/useLocale'

import { Store } from '../../../../core/@types/firebase/Store'

interface Props {
  storeId: string
  store: Omit<Store, 'location'>
}

const Page: NextPage<Props> = props => {
  const { name, currency } = props.store

  const { locale, detectedLocale } = useLocale({
    en: {
      page: 'Analytics',
    },
    th: {
      page: 'วิเคราะห์',
    },
  })

  const { dispatch } = useStoreon('title')
  useEffect(() => {
    dispatch('title/set', locale('page'))
  }, [detectedLocale])

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="flex text-sm text-gray-600">
          <span>{props.storeId}</span>
        </p>
      </div>
      <Analytics storeId={props.storeId} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../../modules/api/services/initializeFirebase'
  )

  const targetStoreId = ctx.params.storeId as string

  initializeFirebase()

  // fetch for store
  const storeDoc = await firebase
    .firestore()
    .collection('stores')
    .doc(targetStoreId)
    .get()

  if (!storeDoc.exists) {
    return {
      notFound: true,
    }
  } else {
    const storeData = storeDoc.data()

    ctx.res.setHeader(
      'Cache-Control',
      'public, maxage=86400, stale-while-revalidate=3600'
    )

    return {
      props: {
        storeId: storeDoc.id,
        store: {
          name: storeData.name,
          currency: storeData.currency,
        } as Store,
      },
    }
  }
}

export default Page
