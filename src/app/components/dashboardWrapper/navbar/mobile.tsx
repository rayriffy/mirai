import { memo, useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Menu, useMenus } from '../../../services/useMenus'

const MobileMenuLink = memo<Menu>(props => {
  const { name, link } = props

  const { pathname } = useRouter()
  const isMatch = useMemo(() => props.match.includes(pathname), [pathname])

  return (
    <Link href={link}>
      <a
        className={`group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md focus:outline-none transition ease-in-out duration-150 ${
          isMatch
            ? 'text-gray-900 bg-gray-100 hover:bg-gray-100 focus:bg-gray-200 hover:text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 focus:bg-gray-50 hover:text-gray-90'
        }`}
      >
        <props.icon
          className={`mr-3 h-6 w-6 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150 ${
            isMatch ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
        {name}
      </a>
    </Link>
  )
})

export const MobileNavbar: React.FC = memo(() => {
  const { menus } = useMenus()

  return (
    <nav className="px-2">
      <div className="space-y-1">
        {menus.map((menu, i) => (
          <MobileMenuLink
            key={`navbar-mobile-link-${menu.name}-${i}`}
            {...menu}
          />
        ))}
      </div>
    </nav>
  )
})
