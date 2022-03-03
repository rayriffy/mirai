import { memo, useEffect, useState } from 'react'

import { collection, doc, onSnapshot } from 'firebase/firestore'
import { getFirestoreInstance } from '../../../core/services/getFirestoreInstance'

import { Transaction } from '../../../core/@types/firebase/Transaction'
import { StatusBadge } from '../../../core/components/statusBadge'
import { CurrencyIcon } from '../../../core/components/currencyIcon'

export const TransactionSmall = memo<{ transactionId: string }>(props => {
  const { transactionId } = props

  const [transactionData, setTransactionData] = useState<Transaction | null>(
    null
  )

  useEffect(() => {
    const listener = onSnapshot(
      doc(collection(getFirestoreInstance(), 'transactions'), transactionId),
      doc => {
        if (doc.exists) {
          setTransactionData(doc.data() as Transaction)
        }
      }
    )

    return () => listener()
  }, [transactionId])

  return (
    <div>
      {transactionData?.type === 'payment' && (
        <div className="bg-white overflow-hidden shadow border border-gray-200 rounded-lg text-left my-6">
          <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
            <div>
              <h1 className="font-semibold text-xl text-gray-900">
                {transactionData.arcadeName}
              </h1>
              <h2 className="text-gray-600">{transactionData.storeName}</h2>
            </div>
            <div className="flex">
              <b className="flex items-center mr-4 text-gray-900 text-lg">
                {transactionData.token}{' '}
                <CurrencyIcon
                  currency={transactionData.currency}
                  className="ml-1"
                />
              </b>
              <StatusBadge status={transactionData.status} size="sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
