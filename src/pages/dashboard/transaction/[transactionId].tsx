import { useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import { TransactionWithId } from '../../../core/@types/TransactionWithId'
import { useEffect } from 'react'
import { collection, onSnapshot, getFirestore, doc } from 'firebase/firestore'
import { createFirebaseInstance } from '../../../core/services/createFirebaseInstance'
import { Transaction } from '../../../core/@types/firebase/Transaction'

// interface Props {
//   transaction: TransactionWithId
// }

const Page: NextPage = props => {
  const [transaction, setTransaction] = useState<TransactionWithId | null>(null)
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

export default Page
