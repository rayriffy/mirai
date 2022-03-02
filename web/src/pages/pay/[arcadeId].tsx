import { useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { useStoreon } from '../../context/storeon'
import { InputDialog } from '../../modules/pay/components/inputDialog'

import { ArcadeWithId } from '../../core/@types/ArcadeWithId'
import { StoreWithId } from '../../core/@types/StoreWithId'
import { Store } from '../../core/@types/firebase/Store'

interface Props {
  arcadeWithId: ArcadeWithId
  storeWithId: StoreWithId
}

const Page: NextPage<Props> = props => {
  const { dispatch } = useStoreon('title')
  useEffect(() => {
    dispatch('title/set', props.arcadeWithId.data.name)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="max-w-xl mx-auto">
        <InputDialog {...props} />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { arcadeId } = ctx.params

  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../modules/api/services/initializeFirebase'
  )

  try {
    initializeFirebase()

    const arcadeDoc = await firebase
      .firestore()
      .collection('arcades')
      .doc(arcadeId as string)
      .get()

    if (arcadeDoc.exists) {
      const arcade = {
        id: arcadeDoc.id,
        data: arcadeDoc.data(),
      } as ArcadeWithId

      const storeDoc = await firebase
        .firestore()
        .collection('stores')
        .doc(arcade.data.storeId)
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

        return {
          props: {
            arcadeWithId: arcade,
            storeWithId: store,
          },
        }
      } else {
        throw 'not-found'
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
