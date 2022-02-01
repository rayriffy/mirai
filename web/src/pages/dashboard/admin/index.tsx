import { ChartBarIcon } from '@heroicons/react/solid'
import ArrowRightIcon from '@heroicons/react/solid/ArrowRightIcon'
import { NextPage } from 'next'
import { menus } from '../../../modules/admin/dashboard/constants/menus'

const Page: NextPage = () => {
  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">Admin dashboard</h1>
        <p className="flex text-sm text-gray-600">
          <span>feature</span>
          <span className="mx-2">·</span>
          <span className="flex items-center">123</span>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {menus.map(menu => (
          <a
            className="col-span-1 rounded-lg p-6 space-y-2 transition border border-gray-200 hover:border-blue-500 hover:text-blue-500 bg-white"
            href={menu.link}
            key={`admin-menu-${menu.id}`}
          >
            <h1 className="text-2xl font-bold inline-flex items-center">
              <menu.icon className="w-6 h-6 mr-2" /> {menu.title}
            </h1>
            <p>{menu.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Page
