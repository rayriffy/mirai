import { Fragment } from 'react'

import { NextPage } from 'next'
import Image from 'next/image'

import { Menu, Transition } from '@headlessui/react'
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  DuplicateIcon,
  PencilAltIcon,
  TrashIcon,
  UserAddIcon,
} from '@heroicons/react/outline'
import { classNames } from '../../core/services/classNames'

import { FavoriteArcadeItem } from '../../modules/dashboard/overview/components/favoriteArcadeItem'
import { TransactionHistory } from '../../modules/dashboard/overview/components/transactionHistory'

import { useStoreon } from '../../context/storeon'

const projects = [
  {
    id: 1,
    title: 'GraphQL API',
    initials: 'GA',
    team: 'Engineering',
    members: [
      {
        name: 'Dries Vincent',
        handle: 'driesvincent',
        imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Courtney Henry',
        handle: 'courtneyhenry',
        imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 12,
    lastUpdated: 'March 17, 2020',
    pinned: true,
    bgColorClass: 'bg-pink-600',
  },
  // More projects...
]

const Page: NextPage = () => {
  const {
    user: {
      auth: { uid },
      metadata: { favoriteArcades, balance },
    },
  } = useStoreon('user')

  return (
    <Fragment>
      {/* Page title & actions */}
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
            Home
          </h1>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <button
            type="button"
            className="order-1 ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-0 sm:ml-0"
          >
            Share
          </button>
          <button
            type="button"
            className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3"
          >
            Create
          </button>
        </div>
      </div>
      {/* Pinned projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div className="col-span-1 px-4 mt-6 sm:px-6 lg:px-8 space-y-4">
          <div className="">
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
              Qr Profile
            </h2>
            <div className="mt-3 border border-gray-200 bg-white rounded-md p-4 w-full">
              <Image src={`/api/qr/${uid}`} width={768} height={768} />
              {/* <div className="w-full aspect-w-1 aspect-h-1" dangerouslySetInnerHTML={{ __html: data }} /> */}
              <dd className="text-sm lg:text-xs text-center font-mono pt-2 break-words">
                {uid}
              </dd>
            </div>
          </div>
          <div className="">
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
              Balance
            </h2>
            <div className="mt-3 border border-gray-200 bg-white rounded-md p-4 w-full flex justify-between">
              <dd className="text-3xl font-semibold text-gray-900">
                ฿{balance.toLocaleString()}
              </dd>
              {/* <button className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon className="w-6 h-6 text-gray-500" />
              </button> */}
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-4 px-4 mt-6 sm:px-6 lg:px-8">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Favorite Arcades
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-4 mt-3">
            {(favoriteArcades ?? []).length === 0 ? (
              <li className="col-span-1">
                <div className="border-2 border-gray-400 border-dotted rounded-md h-14 flex justify-center items-center text-sm text-gray-500">
                  Add favorite arcade for faster access
                </div>
              </li>
            ) : (
              (favoriteArcades ?? []).map(arcade => (
                <FavoriteArcadeItem
                  key={`favoriteArcade-${arcade}`}
                  arcadeId={arcade}
                />
              ))
            )}
          </ul>
        </div>
      </div>

      <TransactionHistory />
    </Fragment>
  )
}

export default Page
