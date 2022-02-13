import { memo, Fragment } from 'react'

import Link from 'next/link'

import { ChevronRightIcon } from '@heroicons/react/outline'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useRecentTransactions } from '../services/useRecentTransactions'

import { StatusBadge } from '../../../../core/components/statusBadge'
import { TableHeader } from './txTable/tableHeader'
import { TableItem } from './txTable/tableItem'
import { RelativeTime } from './txTable/relativeTime'
import { useLocale } from '../../../../core/services/useLocale'

dayjs.extend(relativeTime)

export const TransactionHistory = memo(() => {
  const { data, loading } = useRecentTransactions()
  const { locale, detectedLocale } = useLocale({
    en: {
      topup: 'Topup',
    },
    th: {
      topup: 'เติมเงิน',
    },
  })

  return (
    <Fragment>
      {/* Projects list (only on smallest breakpoint) */}
      <div className="mt-10 sm:hidden">
        <div className="px-4 sm:px-6">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Recent transaction
          </h2>
        </div>
        <ul className="mt-3 border-t border-gray-200 divide-y divide-gray-100">
          {data.map(transaction => (
            <li key={`mobile-recent-tx-${transaction.id}`}>
              <Link href={`/dashboard/transaction/${transaction.id}`}>
                <a className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6">
                  <span className="flex items-center truncate space-x-3">
                    <span className="font-medium truncate text-sm leading-6">
                      {transaction.data.type === 'payment'
                        ? transaction.data.arcadeName
                        : locale('topup')}
                    </span>
                  </span>
                  <div className="flex space-x-4">
                    <span className="text-sm text-gray-500">
                      <RelativeTime
                        datetime={transaction.data.updatedAt.toDate()}
                      />
                    </span>
                    <StatusBadge status={transaction.data.status} />
                    <div>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Projects table (small breakpoint and up) */}
      <div className="hidden mt-8 sm:block">
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
