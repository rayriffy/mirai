import { useEffect, useState } from 'react'

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'
import { getFirestoreInstance } from '../../../../core/services/getFirestoreInstance'

import { useStoreon } from '../../../../context/storeon'

import { Transaction } from '../../../../core/@types/firebase/Transaction'
import { TransactionWithId } from '../../../../core/@types/TransactionWithId'

export const useRecentTransactions = () => {
  const {
    user: {
      auth: { uid },
    },
  } = useStoreon('user')
  const [data, setData] = useState<TransactionWithId[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const listener = onSnapshot(
      query(
        collection(getFirestoreInstance(), 'transactions'),
        where('userId', '==', uid),
        orderBy('updatedAt', 'desc'),
        limit(10)
      ),
      snapshot => {
        const transactionsWithId = snapshot.docs.map(doc => {
          const transaction = doc.data() as Transaction
          const transactionWithId = {
            id: doc.id,
            data: transaction,
          } as TransactionWithId

          return transactionWithId
        })

        setData(transactionsWithId)
        setLoading(false)
      }
    )

    return () => listener()
  }, [uid])

  return { data, loading }
}
