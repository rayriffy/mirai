import { memo } from 'react'

import { FaCoins, FaProductHunt } from 'react-icons/fa'

import { useStoreon } from '../../../../context/storeon'
import { useLocale } from '../../../../core/services/useLocale'

export const Balance = memo(() => {
  const { locale } = useLocale({
    en: {
      balance: 'Balance',
    },
    th: {
      balance: 'คงเหลือ',
    },
  })

  const {
    user: {
      metadata: { balance_coin, balance_buck = undefined },
    },
  } = useStoreon('user')

  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {locale('balance')}
      </h2>
      <div className="mt-3 border border-gray-200 bg-white rounded-md p-4 w-full flex justify-between">
        <dd className="text-3xl font-semibold text-gray-900 flex items-center">
          {balance_coin.toLocaleString()}
          <FaCoins className="ml-2" />
        </dd>
      </div>
      {balance_buck !== undefined && (
        <div className="mt-3 border border-gray-200 bg-white rounded-md p-4 w-full flex justify-between">
          <dd className="text-3xl font-semibold text-gray-900 flex items-center">
            {balance_buck.toLocaleString()}
            <FaProductHunt className="ml-2" />
          </dd>
        </div>
      )}
    </div>
  )
})
