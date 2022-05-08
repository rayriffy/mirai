import { Fragment, useEffect } from 'react'

import { NextPage } from 'next'

import { Balance } from '../../modules/dashboard/overview/components/balance'
import { QRProfile } from '../../modules/dashboard/overview/components/qrProfile'

import { FavoriteArcades } from '../../modules/dashboard/overview/components/favoriteArcades'
import { TransactionHistory } from '../../modules/dashboard/overview/components/transactionHistory'
import { useLocale } from '../../core/services/useLocale'
import { useStoreon } from '../../context/storeon'

const Page: NextPage = props => {
   const { locale, detectedLocale } = useLocale({
    en: {
      home: 'Home',
    },
    th: {
      home: 'หน้าหลัก',
    },
  })

  const { dispatch } = useStoreon('title')
  useEffect(() => {
    dispatch('title/set', locale('home'))
  }, [detectedLocale])

  return (
    <Fragment>
      <div className="border-b border-gray-200 px-4 py-4 md:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
            {locale('home')}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div className="col-span-1 sm:col-span-2 md:col-span-1 px-4 mt-6 sm:px-6 lg:px-8 space-y-4">
          <QRProfile />
          <Balance />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 px-4 mt-6 sm:px-6 lg:px-8">
          <FavoriteArcades />
        </div>
      </div>

      <TransactionHistory />
    </Fragment>
  )
}

export default Page
