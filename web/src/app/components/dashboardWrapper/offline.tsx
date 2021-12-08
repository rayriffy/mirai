import { memo } from 'react'

import { StatusOfflineIcon } from '@heroicons/react/outline'
import { useNetworkAvailability } from 'web-api-hooks'

import { useLocale } from '../../../core/services/useLocale'

export const Offline = memo(() => {
  const isOnline = useNetworkAvailability()

  const { locale } = useLocale({
    en: {
      offline: 'No internet',
    },
    th: {
      offline: 'ไม่มีสัญญาณอินเตอร์เน็ต',
    },
  })

  if (!isOnline) {
    return (
      <div className="pt-4 px-6">
        <div className="bg-red-500 text-white text-sm rounded-full px-4 py-1 font-bold flex items-center">
          <StatusOfflineIcon className="w-4 h-4 mr-1" />
          {locale('offline')}
        </div>
      </div>
    )
  } else {
    return null
  }
})
