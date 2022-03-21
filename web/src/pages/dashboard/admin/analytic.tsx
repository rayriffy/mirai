import { useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { StoreSelector } from '../../../modules/admin/analytic/components/storeSelector'
import { Analytics } from '../../../modules/analytics/components'

import { Store } from '../../../core/@types/firebase/Store'

interface Props {
  stores: {
    id: string
    name: string
  }[]
}

const Page: NextPage = props => {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(
    // 'Vy6YQ3mP4SSdwmECWJfw'
    null
  )

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">Analytics</h1>
      </div>
      <div className="block sm:flex space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <StoreSelector onSelect={storeId => setSelectedStoreId(storeId)} />
      </div>
      {selectedStoreId !== null && (
        <Analytics storeId={selectedStoreId} />
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../modules/api/services/initializeFirebase'
  )

  try {
    initializeFirebase()

    const storeSnapshot = await firebase
      .firestore()
      .collection('stores')
      .orderBy('name', 'asc')
      .get()

    const storesWithId = storeSnapshot.docs.map(doc => {
      const storeData = doc.data() as Store
      const storeWithId = {
        id: doc.id,
        name: storeData.name,
      }

      return storeWithId
    })


    return {
      props: {
        stores: storesWithId,
      },
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

export default Page
