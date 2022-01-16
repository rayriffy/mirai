import { Fragment, useState, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { TransactionWithId } from '../../../core/@types/TransactionWithId'
import { Transaction } from '../../../core/@types/firebase/Transaction'
import { useLocale } from '../../../core/services/useLocale'
import { RelativeTime } from '../../../modules/dashboard/overview/components/txTable/relativeTime'

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

  console.log(transactionWithId)

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">{locale(`type_${transactionWithId.data.type}`)}</h1>
        <p className="flex text-sm text-gray-600">
          <span>
            {transactionWithId.id}
          </span>
          <span className="mx-2">·</span>
          <span className="flex items-center">
            <RelativeTime datetime={new Date(transactionWithId.data.updatedAt as any)} />
          </span>
        </p>
      </div>
      <div>
        {JSON.stringify(transactionWithId)}
      </div>
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
