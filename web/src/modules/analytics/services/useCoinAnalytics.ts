import { useEffect, useState } from 'react'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { getFirestoreInstance } from '../../../core/services/getFirestoreInstance'

import { startOfDay } from './startOfDay'

import { TransactionAnalytic } from '../@types/TransactionAnalytic'
import { Transaction } from '../../../core/@types/firebase/Transaction'

export const useCoinAnalytics = (
  storeId: string | null,
  startDate: Date,
  endDate: Date
) => {
  const [data, setData] = useState<undefined | null | TransactionAnalytic[]>(
    null
  )

  useEffect(() => {
    setData(null)

    if (storeId === null) {
      setData(undefined)
    }

    const listener =
      storeId === null
        ? () => {}
        : onSnapshot(
            query(
              collection(getFirestoreInstance(), 'transactions'),
              where('type', '==', 'payment'),
              where('storeId', '==', storeId),
              where('updatedAt', '<=', endDate),
              where('updatedAt', '>=', startDate)
            ),
            snapshot => {
              setData(
                snapshot.docs
                  .map(doc => {
                    const transactionData = doc.data() as Transaction

                    if (transactionData.type === 'payment') {
                      return {
                        id: doc.id,
                        type: transactionData.type,
                        amount: transactionData.token,
                        status: transactionData.status,
                        arcadeId: transactionData.arcadeId,
                        arcadeName: transactionData.arcadeName,
                        date: startOfDay(
                          transactionData.updatedAt.toDate()
                        ).toDate(),
                      }
                    } else {
                      return null
                    }
                  })
                  .filter(o => o !== null)
              )
            }
          )

    return () => listener()
  }, [storeId, startDate, endDate])

  return data
}
