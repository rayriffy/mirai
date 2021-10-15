import { Fragment, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import { TransactionWithId } from '../../../core/@types/TransactionWithId'
import { useEffect } from 'react'
import { collection, onSnapshot, getFirestore, doc } from 'firebase/firestore'
import { createFirebaseInstance } from '../../../core/services/createFirebaseInstance'
import { Transaction } from '../../../core/@types/firebase/Transaction'

interface Props {
  transactionWithId: TransactionWithId
}

const Page: NextPage<Props> = props => {
  const { transactionWithId } = props

  const [transaction, setTransaction] =
    useState<TransactionWithId>(transactionWithId)
  const { query } = useRouter()

  useEffect(() => {
    const listener = onSnapshot(
      doc(
        collection(getFirestore(createFirebaseInstance()), 'transactions'),
        query.transactionId as string
      ),
      doc => {
        if (doc.exists()) {
          setTransaction({
            id: doc.id,
            data: doc.data() as Transaction,
          })
        }
      }
    )

    return () => {
      listener()
    }
  }, [])

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8">
      {JSON.stringify(transaction)}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { transactionId } = ctx.params

  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../modules/api/services/initializeFirebase'
  )

  try {
    initializeFirebase()

    const transactionDoc = await firebase
      .firestore()
      .collection('transactions')
      .doc(transactionId as string)
      .get()

    if (transactionDoc.exists) {
      return {
        props: {
          transactionWithId: {
            id: transactionDoc.id,
            data: JSON.parse(
              JSON.stringify(transactionDoc.data())
            ) as Transaction,
          },
        },
      }
    } else {
      throw 'no-data'
    }
  } catch (e) {
    console.error(e)
    return {
      notFound: true,
    }
  }
}

export default Page
