import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { ExternalLinkIcon } from '@heroicons/react/outline'

import { Arcade } from '../../../core/@types/firebase/Arcade'
import { Store } from '../../../core/@types/firebase/Store'
import { ArcadeWithId } from '../../../core/@types/ArcadeWithId'
import { StoreWithId } from '../../../core/@types/StoreWithId'
import { useLocale } from '../../../core/services/useLocale'

interface Props {
  arcadesWithId: ArcadeWithId[]
  storeWithId: StoreWithId
}

const Page: NextPage<Props> = props => {
  const { arcadesWithId, storeWithId } = props

  const { locale } = useLocale({
    en: {
      machine: 'Machines',
      maps: 'Maps',
      pergame: 'coins per game',
    },
    th: {
      machine: 'ตู้',
      maps: 'แผนที่',
      pergame: 'เหรียญต่อการเข้าเล่นหนึ่งรอบ',
    },
  })

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">{storeWithId.data.name}</h1>
        <p className="flex text-sm text-gray-600">
          <span>
            {arcadesWithId.length} {locale('machine')}
          </span>
          <span className="mx-2">·</span>
          <span className="flex items-center">
            <a
              href={`https://www.google.com/maps?q=${storeWithId.data.location.latitude},${storeWithId.data.location.longitude}`}
              className="flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5 mr-0.5" />
              Google {locale('maps')}
            </a>
          </span>
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {arcadesWithId.map(arcade => (
          <div className="" key={arcade.id}>
            <Link href={`/pay/${arcade.id}`}>
              <a>
                <div className="border border-gray-200 bg-white rounded-md p-4 w-full">
                  <h1 className="text-gray-800 font-semibold text-xl">
                    {arcade.data.name}
                  </h1>
                  <div className="mt-0.5">
                    <h2 className="text-gray-500 text-sm">
                      {arcade.data.tokenPerCredit} {locale('pergame')}
                    </h2>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { storeId } = ctx.params

  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../modules/api/services/initializeFirebase'
  )
  const { default: sortBy } = await import('lodash/sortBy')

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
          arcadesWithId: sortBy(arcades, [
            arcade => arcade.data.name.toLowerCase(),
          ]),
          // arcadesWithId: arcades,
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
