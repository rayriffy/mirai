import { memo } from 'react'

import { FaCoins, FaProductHunt } from 'react-icons/fa'

import { useStoreon } from '../../../../context/storeon'
import { currencies } from '../../../../core/constants/currencies'
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
      metadata,
    },
  } = useStoreon('user')

  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {locale('balance')}
      </h2>
      <div className="space-y-3">
        {currencies.map(currency => {
          if (metadata[`balance_${currency.id}`] === undefined) {
            return null
          } else {
            return (
              <div key={`live-balance-${currency.id}`} className="mt-3 border border-gray-200 bg-white rounded-md p-4 w-full flex justify-between">
                <dd className="text-3xl font-semibold text-gray-900 flex items-center">
                  {metadata[`balance_${currency.id}`].toLocaleString()}
                  <currency.icon className="ml-2" />
                </dd>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
})
