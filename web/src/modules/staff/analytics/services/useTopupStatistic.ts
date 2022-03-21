import { useEffect, useMemo, useState } from 'react'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { getFirestoreInstance } from '../../../../core/services/getFirestoreInstance'

import { Transaction } from '../../../../core/@types/firebase/Transaction'
import { startOfDay } from '../../../analytics/services/startOfDay'
import { endOfDay } from '../../../analytics/services/endOfDay'

export const useTopupStatistic = (targetDate: Date, storeId: string) => {
  const [loading, setLoading] = useState<boolean>(true)

  const [topupTransactions, setTopupTransactions] = useState<Transaction[]>([])

  const summarizedTopupAmount = useMemo<number>(
    () => topupTransactions.reduce((acc, val) => acc + val.token, 0),
    [topupTransactions]
  )

  useEffect(() => {
    setLoading(true)

    const listener = onSnapshot(
      query(
        collection(getFirestoreInstance(), 'transactions'),
        where('type', '==', 'topup'),
        where('storeId', '==', storeId),
        where('createdAt', '<=', endOfDay(targetDate).toDate()),
        where('createdAt', '>=', startOfDay(targetDate).toDate())
      ),
      snapshot => {
        setTopupTransactions(
          snapshot.docs.map(doc => doc.data() as Transaction)
        )
        setLoading(false)
      }
    )

    return () => listener()
  }, [targetDate, storeId])

  return {
    loading,
    data: summarizedTopupAmount,
  }
}
