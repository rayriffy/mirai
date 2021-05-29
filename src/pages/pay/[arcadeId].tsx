import { Fragment } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { InputDialog } from '../../modules/pay/components/inputDialog'

import { ArcadeWithId } from '../../core/@types/ArcadeWithId'
import { BranchWithId } from '../../core/@types/BranchWithId'
import { Branch } from '../../core/@types/firebase/Branch'

interface Props {
  arcadeWithId: ArcadeWithId
  branchWithId: BranchWithId
}

const Page: NextPage<Props> = props => {
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

      const branchDoc = await firebase
        .firestore()
        .collection('branches')
        .doc(arcade.data.branchId)
        .get()

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
            arcadeWithId: arcade,
            branchWithId: branch,
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
