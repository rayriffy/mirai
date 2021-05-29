import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { Store } from '../../core/@types/firebase/Store'
import { StoreWithId } from '../../core/@types/StoreWithId'

interface Props {
  storesWithId: StoreWithId[]
}

const Page: NextPage<Props> = props => {
  const { storesWithId } = props
  return (
    <Fragment>
      <div>{JSON.stringify(props)}</div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {storesWithId.map(store => (
          <div className="" key={store.id}>
            <Link href={`/dashboard/arcades/${store.id}`}>
              <a>
                <div className="border border-gray-200 bg-white rounded-md p-4 w-full">
                  <h1 className="text-gray-800 font-semibold text-xl">{store.data.name}</h1>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../modules/api/services/initializeFirebase'
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
        data: {
          ...storeData,
          location: {
            latitude: storeData.location.latitude,
            longitude: storeData.location.longitude,
          },
        },
      } as StoreWithId

      return storeWithId
    })

    return {
      props: {
        storesWithId
      }
    }
  } catch (e) {
    console.error(e)
    return {
      notFound: true,
    }
  }
}

export default Page
