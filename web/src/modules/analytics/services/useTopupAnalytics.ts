import { useEffect, useState } from 'react'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { getFirestoreInstance } from '../../../core/services/getFirestoreInstance'

import { startOfDay } from './startOfDay'

import { Transaction } from '../../../core/@types/firebase/Transaction'
import { TopupAnalytic } from '../@types/TopupAnalytic'

export const useTopupAnalytics = (
  storeId: string | null,
  startDate: Date,
  endDate: Date
) => {
  const [data, setData] = useState<undefined | null | TopupAnalytic[]>(
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
              where('type', '==', 'topup'),
              where('storeId', '==', storeId),
              where('updatedAt', '<=', endDate),
              where('updatedAt', '>=', startDate)
            ),
            snapshot => {
              setData(
                snapshot.docs
                  .map(doc => {
                    const transactionData = doc.data() as Transaction

                    if (transactionData.type === 'topup') {
                      return {
                        id: doc.id,
                        type: transactionData.type,
                        amount: transactionData.token,
                        status: transactionData.status,
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
