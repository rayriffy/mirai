import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { ArcadeWithId } from '../../core/@types/ArcadeWithId'
import { BranchWithId } from '../../core/@types/BranchWithId'
import { Branch } from '../../core/@types/firebase/Branch'

interface Props {
  arcade: ArcadeWithId
  branch: BranchWithId
}

const Page: NextPage<Props> = props => {
  return (
    <>{JSON.stringify(props)}</>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { arcadeId } = ctx.params

  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import('../../modules/api/services/initializeFirebase')

  try {
    initializeFirebase()

    const arcadeDoc = await firebase.firestore().collection('arcades').doc(arcadeId as string).get()

    if (arcadeDoc.exists) {
      const arcade = {
        id: arcadeDoc.id,
        data: arcadeDoc.data()
      } as ArcadeWithId

      const branchDoc = await firebase.firestore().collection('branches').doc(arcade.data.branchId).get()

      if (branchDoc.exists) {
        const branchData = branchDoc.data() as Branch

        const branch = {
          id: branchDoc.id,
          data: {
            ...branchData,
            location: {
              latitude: branchData.location.latitude,
              longitude: branchData.location.longitude,
            },
          },
        } as BranchWithId

        return {
          props: {
            arcade,
            branch,
          }
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
