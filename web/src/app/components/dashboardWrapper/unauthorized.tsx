import { memo } from 'react'

import { BanIcon } from '@heroicons/react/solid'

import { useLocale } from '../../../core/services/useLocale'

export const Unauthorized = memo(() => {
  const { locale } = useLocale({
    en: {
      title: 'Unauthorized',
      desc: 'You don\'t have enough permission to access this page.',
    },
    th: {
      title: 'ไม่มีสิทธิ์เข้าถึง',
      desc: 'คุณไม่มีสิทธิ์พอที่จะเข้าถึงหน้านี้',
    },
  })
  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center">
      <div>
        <BanIcon className="w-10 h-10 text-gray-500 mx-auto" />
        <h1 className="text-center text-gray-500 font-semibold text-xl mt-1">
          {locale('title')}
        </h1>
        <p className="text-gray-500">{locale('desc')}</p>
      </div>
    </div>
  )
})
