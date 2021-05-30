import { memo, Fragment, useState } from 'react'

import { Menu, Transition } from '@headlessui/react'
import {
  DotsVerticalIcon,
  PencilAltIcon,
  DuplicateIcon,
  UserAddIcon,
  TrashIcon,
} from '@heroicons/react/outline'

import { classNames } from '../../../../../core/services/classNames'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { StatusBadge } from './statusBadge'
import { TransactionWithId } from '../../../../../core/@types/TransactionWithId'
import { useLocale } from '../../../../../core/services/useLocale'

import 'dayjs/locale/th'

dayjs.extend(relativeTime)

interface Props {
  transaction: TransactionWithId
}

export const TableItem = memo<Props>(props => {
  const { transaction } = props

  const { locale, detectedLocale } = useLocale({
    en: {
      at: 'at',
      topup: 'Topup',
    },
    th: {
      at: 'ที่',
      topup: 'เติมเงิน',
    },
  })

  return (
    <tr>
      <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center space-x-3 lg:pl-2">
          <span className="truncate hover:text-gray-600">
            {transaction.data.type === 'payment' ? (
              <Fragment>
                {transaction.data.arcadeName}{' '}
                <span className="text-gray-500 font-normal">
                  {locale('at')} {transaction.data.storeName}
                </span>
              </Fragment>
            ) : (
              locale('topup')
            )}
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
        {transaction.data.token.toLocaleString()}
      </td>
      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
        ฿{transaction.data.value.toLocaleString()}
      </td>
      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
        <StatusBadge status={transaction.data.status} />
      </td>
      <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
        {dayjs(transaction.data.updatedAt.toDate())
          .locale(detectedLocale)
          .fromNow()}
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
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm'
                          )}
                        >
                          <PencilAltIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Edit
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm'
                          )}
                        >
                          <DuplicateIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Duplicate
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm'
                          )}
                        >
                          <UserAddIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Share
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm'
                          )}
                        >
                          <TrashIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Delete
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </td>
    </tr>
  )
})
