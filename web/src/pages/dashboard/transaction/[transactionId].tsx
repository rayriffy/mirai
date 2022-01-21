import { Fragment, useState, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { TransactionWithId } from '../../../core/@types/TransactionWithId'
import { Transaction } from '../../../core/@types/firebase/Transaction'
import { useLocale } from '../../../core/services/useLocale'
import { RelativeTime } from '../../../modules/dashboard/overview/components/txTable/relativeTime'
import { DetailedStep } from '../../../core/components/detailedStep'
import { FaCoins } from 'react-icons/fa'

interface Props {
  transactionWithId: TransactionWithId
}

const Page: NextPage<Props> = props => {
  const { transactionWithId } = props

  const { locale } = useLocale({
    en: {
      type_topup: 'Topup',
      type_payment: 'Payment',
    },
    th: {
      type_topup: 'เติมเงิน',
      type_payment: 'ชำระเงิน',
    },
  })

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">
          {locale(`type_${transactionWithId.data.type}`)}
        </h1>
        <p className="flex text-sm text-gray-600">
          <span>{transactionWithId.id}</span>
          <span className="mx-2">·</span>
          <span className="flex items-center">
            <RelativeTime
              datetime={new Date(transactionWithId.data.updatedAt as any)}
            />
          </span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="col-span-1 space-y-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <DetailedStep
                details={[
                  'Order has been placed',
                  'Store inserting coins',
                  'Coin has been inserted',
                ]}
                currentIndex={1}
                currentStatus="progress"
              />
            </div>
          </div>
          {transactionWithId.data.type === 'payment' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-gray-800 font-semibold text-xl">
                      {transactionWithId.data.arcadeName}
                    </h1>
                    <div className="mt-0.5">
                      <h2 className="text-gray-500 text-sm">
                        {transactionWithId.data.storeName}
                      </h2>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold flex items-center">
                      {transactionWithId.data.token.toLocaleString()}
                      <FaCoins className="ml-2" />
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">ok</div>
          </div>
        </div>
      </div>
      <div>{JSON.stringify(transactionWithId)}</div>
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
      const transactionData = transactionDoc.data() as Transaction
      return {
        props: {
          transactionWithId: {
            id: transactionDoc.id,
            data: {
              ...transactionData,
              createdAt: transactionData.createdAt.toDate().toISOString(),
              updatedAt: transactionData.updatedAt.toDate().toISOString(),
            } as unknown as Transaction,
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
