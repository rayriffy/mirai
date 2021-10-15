import { memo } from 'react'

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
      metadata: { balance },
    },
  } = useStoreon('user')

  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {locale('balance')}
      </h2>
      <div className="mt-3 border border-gray-200 bg-white rounded-md p-4 w-full flex justify-between">
        <dd className="text-3xl font-semibold text-gray-900">
          ฿{balance.toLocaleString()}
        </dd>
      </div>
    </div>
  )
})
