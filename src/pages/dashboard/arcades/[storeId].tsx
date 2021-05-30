import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { Arcade } from '../../../core/@types/firebase/Arcade'
import { Store } from '../../../core/@types/firebase/Store'
import { ArcadeWithId } from '../../../core/@types/ArcadeWithId'
import { StoreWithId } from '../../../core/@types/StoreWithId'

interface Props {
  arcadesWithId: ArcadeWithId[]
  storeWithId: StoreWithId
}

const Page: NextPage<Props> = props => {
  const { arcadesWithId } = props
  return (
    <Fragment>
      <div>{JSON.stringify(props)}</div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {arcadesWithId.map(arcade => (
          <div className="" key={arcade.id}>
            <Link href={`/pay/${arcade.id}`}>
              <a>
                <div className="border border-gray-200 bg-white rounded-md p-4 w-full">
                  <h1 className="text-gray-800 font-semibold text-xl">
                    {arcade.data.name}
                  </h1>
                  <h2 className="text-gray-500">{arcade.data.storeName}</h2>
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
  const { storeId } = ctx.params

  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../modules/api/services/initializeFirebase'
  )

  try {
    initializeFirebase()

    const storeDoc = await firebase
      .firestore()
      .collection('stores')
      .doc(storeId as string)
      .get()

    if (storeDoc.exists) {
      const storeData = storeDoc.data() as Store
      const store = {
        id: storeDoc.id,
        data: {
          ...storeData,
          location: {
            latitude: storeData.location.latitude,
            longitude: storeData.location.longitude,
          },
        },
      } as StoreWithId

      const arcadeCollection = await firebase
        .firestore()
        .collection('arcades')
        .where('storeId', '==', storeDoc.id)
        .orderBy('name', 'asc')
        .get()
      const arcades = arcadeCollection.docs.map(doc => {
        const arcadeData = doc.data() as Arcade
        const arcade = {
          id: doc.id,
          data: arcadeData,
        } as ArcadeWithId

        return arcade
      })

      return {
        props: {
          arcadesWithId: arcades,
          storeWithId: store,
        },
      }
    } else {
      throw 'not-found'
    }
  } catch (e) {
    console.error(e)
    return {
      notFound: true,
    }
  }
}

export default Page
