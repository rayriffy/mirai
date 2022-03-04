import { memo, Fragment } from 'react'

import Link from 'next/link'

import { ChevronRightIcon } from '@heroicons/react/outline'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useRecentTransactions } from '../services/useRecentTransactions'

import { TableHeader } from './txTable/tableHeader'
import { TableItem } from './txTable/tableItem'

dayjs.extend(relativeTime)

export const TransactionHistory = memo(() => {
  const { data } = useRecentTransactions()

  return (
    <Fragment>
      {/* Projects table (small breakpoint and up) */}
      <div className="block mt-8 sm:block">
        <div className="align-middle inline-block min-w-full border-b border-gray-200">
          <table className="min-w-full">
            <thead>
              <TableHeader />
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map(transaction => (
                <TableItem
                  key={`desktop-recent-tx-${transaction.id}`}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  )
})
