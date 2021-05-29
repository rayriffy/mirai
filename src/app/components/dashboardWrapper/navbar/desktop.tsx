import { memo, useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Menu, useMenus } from '../../../services/useMenus'

const DesktopMenuLink = memo<Menu>(props => {
  const { pathname } = useRouter()
  const isMatch = useMemo(() => props.match.includes(pathname), [pathname])

  return (
    <Link href={props.link}>
      <a
        className={`group flex items-center px-2 py-2 text-sm leading-5 font-medium rounded-md focus:outline-none focus:bg-gray-50 transition ease-in-out duration-150 ${
          isMatch
            ? 'text-gray-900 bg-gray-200'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <props.icon
          className={`mr-3 h-6 w-6 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150 ${
            isMatch ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
        {props.name}
      </a>
    </Link>
  )
})

export const DesktopNavbar = memo(() => {
  const { menus } = useMenus()

  return (
    <nav className="px-3 mt-6">
      <div className="space-y-1">
        {menus.map(menu => (
          <DesktopMenuLink key={`navbar-desktop-link-${menu.name}`} {...menu} />
        ))}
      </div>
    </nav>
  )
})
