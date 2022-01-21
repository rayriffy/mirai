import { memo, Fragment, useState, useEffect } from 'react'

import Link from 'next/link'

import { Menu, Transition } from '@headlessui/react'
import { FaCoins, FaProductHunt } from 'react-icons/fa'
import {
  DotsVerticalIcon,
  InformationCircleIcon,
  XIcon,
} from '@heroicons/react/outline'

import { classNames } from '../../../../../core/services/classNames'
import { useLocale } from '../../../../../core/services/useLocale'

import { CancelDialog } from './cancelDialog'
import { StatusBadge } from './statusBadge'
import { RelativeTime } from './relativeTime'

import { TransactionWithId } from '../../../../../core/@types/TransactionWithId'

interface Props {
  transaction: TransactionWithId
}

export const TableItem = memo<Props>(props => {
  const { transaction } = props

  const { locale } = useLocale({
    en: {
      at: 'at',
      topup: 'Topup',
      info: 'Information',
      cancel: 'Cancel',
    },
    th: {
      at: 'ที่',
      topup: 'เติมเงิน',
      info: 'ดูข้อมูลเพิ่มเติม',
      cancel: 'ยกเลิกคำสั่งซื้อ',
    },
  })

  const [cancelOpen, setCancelOpen] = useState(false)
  useEffect(() => {
    if (transaction.data.status !== 'pending') {
      setCancelOpen(false)
    }
  }, [transaction.data.status])

  return (
    <tr>
      <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center space-x-3 lg:pl-2">
          <span className="truncate hover:text-gray-600">
            {transaction.data.type === 'payment' ? (
              <Link href={`/pay/${transaction.data.arcadeId}`}>
                <a>
                  {transaction.data.arcadeName}{' '}
                  <span className="text-gray-500 font-normal">
                    {locale('at')} {transaction.data.storeName}
                  </span>
                </a>
              </Link>
            ) : (
              locale('topup')
            )}
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
        {transaction.data.type === 'payment'
          ? (
            <div className="flex items-center">{transaction.data.token.toLocaleString()}{transaction.data.currency === 'coin' ? <FaCoins className="ml-2" /> : <FaProductHunt className="ml-2" />}</div>
          )
          : '-'}
      </td>
      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
        <StatusBadge status={transaction.data.status} />
      </td>
      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
        <RelativeTime datetime={transaction.data.updatedAt.toDate()} />
      </td>
      <td className="pr-6">
        <Menu as="div" className="relative flex justify-end items-center">
          {({ open }) => (
            <>
              <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open options</span>
                <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                >
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link href={`/dashboard/transaction/${transaction.id}`}>
                          <a
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm'
                            )}
                          >
                            <InformationCircleIcon
                              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            {locale('info')}
                          </a>
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  {transaction.data.type === 'payment' &&
                    transaction.data.status === 'pending' && (
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setCancelOpen(true)}
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm w-full'
                              )}
                            >
                              <XIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              {locale('cancel')}
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    )}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
        <CancelDialog
          open={cancelOpen}
          onClose={() => setCancelOpen(false)}
          transactionId={transaction.id}
          transactionCurrency={transaction.data.currency}
          transactionValue={transaction.data.token}
        />
      </td>
    </tr>
  )
})
