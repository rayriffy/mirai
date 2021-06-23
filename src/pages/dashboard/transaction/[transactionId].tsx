import { useState } from 'react'

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

  const [transaction, setTransaction] = useState<TransactionWithId>(transactionWithId)
  const { query } = useRouter()

  useEffect(() => {
    const listener = onSnapshot(doc(collection(getFirestore(createFirebaseInstance()), 'transactions'), query.transactionId as string), doc => {
      if (doc.exists()) {
        setTransaction({
          id: doc.id,
          data: doc.data() as Transaction,
        })
      }
    })

    return () => {
      listener()
    }
  }, [])

  return (
    <>{JSON.stringify(transaction)}</>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { transactionId } = ctx.params

  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../modules/api/services/initializeFirebase'
  )
  const { default: omit } = await import('lodash/omit')

  try {
    initializeFirebase()

    const transactionDoc = await firebase.firestore().collection('transactions').doc(transactionId as string).get()

    if (transactionDoc.exists) {
      return {
        props: {
          transactionWithId: {
            id: transactionDoc.id,
            data: omit(transactionDoc.data(), ['updatedAt', 'createdAt']) as Transaction,
          }
        }
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
