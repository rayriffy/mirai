import { Fragment, useState, useEffect, useMemo } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import dayjs from 'dayjs'
import { FaCoins, FaProductHunt } from 'react-icons/fa'

import { useLocale } from '../../../core/services/useLocale'
import { RelativeTime } from '../../../modules/dashboard/overview/components/txTable/relativeTime'
import { DetailedStep } from '../../../core/components/detailedStep'

import { TransactionWithId } from '../../../core/@types/TransactionWithId'
import { Transaction } from '../../../core/@types/firebase/Transaction'

interface Props {
  transactionWithId: TransactionWithId
}

const Page: NextPage<Props> = props => {
  const { transactionWithId } = props

  const { locale, detectedLocale } = useLocale({
    en: {
      type_topup: 'Topup',
      type_payment: 'Payment',
      step_payment_1: 'Order has been placed',
      step_payment_2: 'Store has recived order',
      step_payment_3: 'Coin has been inserted',
      step_payment_cancel: 'Order has been cancelled',
      step_payment_failed: 'Arcade offline',
      key_ref: 'Reference ID',
      key_type: 'Transaction type',
      key_status: 'Status',
      key_arcade: 'Arcade',
      key_store: 'Store',
      key_amount: 'Amount',
      key_created: 'Created at',
      key_updated: 'Updated at',
    },
    th: {
      type_topup: 'เติมเงิน',
      type_payment: 'ชำระเงิน',
      step_payment_1: 'ได้รับคำสั่งซื้อแล้ว',
      step_payment_2: 'สาขารับคำสั่งซื้อแล้ว',
      step_payment_3: 'เหรียญได้ถูกหยอดแล้ว',
      step_payment_cancel: 'คำสั่งซื้อได้ถูกยกเลิกแล้ว',
      step_payment_failed: 'ไม่สามารถเชื่อมต่อกับตู้เกมได้',
      key_ref: 'รหัสอ้างอิง',
      key_type: 'ประเภทคำสั่งซื้อ',
      key_status: 'สถานะคำสั่งซื้อ',
      key_arcade: 'ตู้เกม',
      key_store: 'สาขาร้าน',
      key_amount: 'จำนวนเหรียญ',
      key_created: 'สร้างเมื่อ',
      key_updated: 'อัพเดทเมื่อ',
    },
  })

  const keyValues = useMemo(
    () => [
      [locale('key_ref'), transactionWithId.id],
      [locale('key_type'), transactionWithId.data.type],
      [locale('key_status'), transactionWithId.data.status],
      ...(transactionWithId.data.type === 'payment'
        ? [
            [locale('key_arcade'), transactionWithId.data.arcadeName],
            [locale('key_store'), transactionWithId.data.storeName],
          ]
        : []),
      [
        locale('key_amount'),
        <>
          <div className="flex items-center">
            {transactionWithId.data.token}
            {transactionWithId.data.currency === 'coin' ? (
              <FaCoins className="ml-2" />
            ) : (
              <FaProductHunt className="ml-2" />
            )}
          </div>
        </>,
      ],
      [
        locale('key_created'),
        dayjs(new Date(transactionWithId.data.createdAt as any)).toISOString(),
      ],
      [
        locale('key_updated'),
        dayjs(new Date(transactionWithId.data.updatedAt as any)).toISOString(),
      ],
    ],
    [detectedLocale]
  )

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
                  locale('step_payment_1'),
                  locale('step_payment_2'),
                  locale(
                    transactionWithId.data.status === 'cancelled'
                      ? 'step_payment_cancel'
                      : transactionWithId.data.status === 'failed'
                      ? 'step_payment_failed'
                      : 'step_payment_3'
                  ),
                ]}
                currentIndex={
                  transactionWithId.data.status === 'pending'
                    ? 0
                    : transactionWithId.data.status === 'processing'
                    ? 1
                    : 2
                }
                currentStatus={
                  ['cancelled', 'failed'].includes(
                    transactionWithId.data.status
                  )
                    ? 'fail'
                    : transactionWithId.data.status === 'success'
                    ? 'success'
                    : 'progress'
                }
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
                      {transactionWithId.data.currency === 'coin' ? (
                        <FaCoins className="ml-2" />
                      ) : (
                        <FaProductHunt className="ml-2" />
                      )}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Transaction information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detailed description of the transaction.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                {keyValues.map(([key, value]) => (
                  <div
                    className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                    key={`transaction-${key}`}
                  >
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
      {/* <div>{JSON.stringify(transactionWithId)}</div> */}
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
