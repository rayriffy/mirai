import { Fragment } from 'react'

import { NextPage } from 'next'

import { Balance } from '../../modules/dashboard/overview/components/balance'
import { QRProfile } from '../../modules/dashboard/overview/components/qrProfile'

import { FavoriteArcades } from '../../modules/dashboard/overview/components/favoriteArcades'
import { TransactionHistory } from '../../modules/dashboard/overview/components/transactionHistory'
import { useLocale } from '../../core/services/useLocale'

const Page: NextPage = () => {
  const { locale } = useLocale({
    en: {
      home: 'Home',
    },
    th: {
      home: 'หน้าหลัก',
    },
  })

  return (
    <Fragment>
      {/* Page title & actions */}
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
            {locale('home')}
          </h1>
        </div>
      </div>
      {/* Pinned projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div className="col-span-1 px-4 mt-6 sm:px-6 lg:px-8 space-y-4">
          <QRProfile />
          <Balance />
        </div>
        <FavoriteArcades />
      </div>

      <TransactionHistory />
    </Fragment>
  )
}

export default Page
