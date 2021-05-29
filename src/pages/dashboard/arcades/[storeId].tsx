import { GetServerSideProps, NextPage } from 'next'
import { ArcadeWithId } from '../../../core/@types/ArcadeWithId'
import { StoreWithId } from '../../../core/@types/StoreWithId'
import { Arcade } from '../../../core/@types/firebase/Arcade'
import { Store } from '../../../core/@types/firebase/Store'

interface Props {
  arcadesWithId: ArcadeWithId[]
  storeWithId: StoreWithId
}

const Page: NextPage<Props> = props => {
  return <div>{JSON.stringify(props)}</div>
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
