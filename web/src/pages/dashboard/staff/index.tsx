import { NextPage } from 'next'
import Link from 'next/link'

import { useStoreon } from '../../../context/storeon'
import { useLocale } from '../../../core/services/useLocale'
import { useMenus } from '../../../modules/staff/dashboard/services/useMenus'

const Page: NextPage = () => {
  const { user } = useStoreon('user')

  const { menus } = useMenus()
  const { locale } = useLocale({
    en: {
      title: 'Staff dashboard',
    },
    th: {
      title: 'แดชบอร์ดพนักงาน',
    },
  })

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">{locale('title')}</h1>
        <p className="flex text-sm text-gray-600">
          <span>{user.metadata.staffStoreName}</span>
          <span className="mx-2">·</span>
          <span className="flex items-center">
            {user.metadata.staffStoreId}
          </span>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {menus.map(menu => (
          <Link href={menu.link} key={`admin-menu-${menu.id}`}>
            <a className="col-span-1 rounded-lg p-6 space-y-2 transition border border-gray-200 hover:border-blue-500 hover:text-blue-500 bg-white">
              <h1 className="text-2xl font-bold inline-flex items-center">
                <menu.icon className="w-6 h-6 mr-2" /> {menu.title}
              </h1>
              <p>{menu.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Page
