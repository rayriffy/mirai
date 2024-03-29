import { memo, Fragment, useCallback } from 'react'

import { Menu, Transition } from '@headlessui/react'

import { classNames } from '../../../../core/services/classNames'

import { signOut } from 'firebase/auth'
import { useStoreon } from '../../../../context/storeon'
import { useLocale } from '../../../../core/services/useLocale'
import { getAuthInstance } from '../../../../core/services/getAuthInstance'
import Link from 'next/link'

export const MobileUser = memo(() => {
  const {
    user: {
      metadata: { emailHash },
    },
  } = useStoreon('user')

  const onLogout = useCallback(() => {
    signOut(getAuthInstance())
  }, [])

  const { locale } = useLocale({
    en: {
      logout: 'Logout',
      settings: 'Settings',
    },
    th: {
      logout: 'ออกจากระบบ',
      settings: 'ตั้งค่า',
    },
  })

  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src={`https://www.gravatar.com/avatar/${emailHash}`}
                width={32}
                height={32}
                alt=""
              />
            </Menu.Button>
          </div>
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
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
            >
              <div className="py-1">
                {/* <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      View profile
                    </a>
                  )}
                </Menu.Item> */}
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/settings">
                      <a
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        {locale('settings')}
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              </div>
              {/* <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Support
                    </a>
                  )}
                </Menu.Item>
              </div> */}
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onLogout}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm w-full text-left'
                      )}
                    >
                      {locale('logout')}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
})
