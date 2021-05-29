import { memo, Fragment } from 'react'

import Link from 'next/link'

import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/solid'
import { classNames } from '../../../core/services/classNames'

import { useArcade } from '../services/useArcade'

interface Props {
  arcadeId: string
}

export const FavoriteArcadeItem = memo<Props>(props => {
  const { arcadeId } = props

  const { data, loading, error } = useArcade(arcadeId)

  return (
    <li className="relative col-span-1 flex shadow-sm rounded-md">
      <div className="flex-1 flex items-center justify-between border border-gray-200 bg-white rounded-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          {loading ? (
            <Fragment>
              <div className="h-4 w-20 bg-gray-900 rounded-md animate-pulse mt-1" />
              <div className="h-4 w-10 bg-gray-500 rounded-md animate-pulse mt-0.5 mb-1" />
            </Fragment>
          ) : (
            <Fragment>
              <Link href={`/pay/${arcadeId}`}>
                <a className="text-gray-900 font-medium hover:text-gray-600">
                  {data.name}
                </a>
              </Link>
              <p className="text-gray-500">{data.branchName}</p>
            </Fragment>
          )}
        </div>
        {!loading && (
          <Menu as="div" className="flex-shrink-0 pr-2">
            {({ open }) => (
              <>
                <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
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
                    className="z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link href={`/pay/${arcadeId}`}>
                            <a
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              View
                            </a>
                          </Link>
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
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Remove from favorite
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
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Share
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        )}
      </div>
    </li>
  )
})
