import { useEffect, useMemo, useState } from 'react'

import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { getFirestoreInstance } from '../../../../core/services/getFirestoreInstance'

import { endOfDay } from '../../../admin/analytic/services/endOfDay'
import { startOfDay } from '../../../admin/analytic/services/startOfDay'

import { Transaction } from '../../../../core/@types/firebase/Transaction'

export const useTopupStatistic = (targetDate: Date, storeId: string) => {
  const [loading, setLoading] = useState<boolean>(true)

  const [topupTransactions, setTopupTransactions] = useState<Transaction[]>([])

  const summarizedTopupAmount = useMemo<number>(
    () => topupTransactions.reduce((acc, val) => acc + val.token, 0),
    [topupTransactions]
  )

  useEffect(() => {
    setLoading(true)

    console.log({
      startDate: `${startOfDay(targetDate)
        .toDate()
        .toLocaleDateString()} ${startOfDay(targetDate)
        .toDate()
        .toLocaleTimeString()}`,
      endOfDay: `${endOfDay(targetDate)
        .toDate()
        .toLocaleDateString()} ${endOfDay(targetDate)
        .toDate()
        .toLocaleTimeString()}`,
    })

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
