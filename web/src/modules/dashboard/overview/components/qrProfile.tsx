/* eslint-disable @next/next/no-img-element */
import { memo } from 'react'

import Image from 'next/image'

import { useStoreon } from '../../../../context/storeon'
import { useLocale } from '../../../../core/services/useLocale'

export const QRProfile = memo(() => {
  const { locale } = useLocale({
    en: {
      qr: 'QR Profile',
    },
    th: {
      qr: 'โปรไฟล์ QR',
    },
  })

  const {
    user: {
      auth: { uid },
    },
  } = useStoreon('user')

  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {locale('qr')}
      </h2>
      <div className="mt-3 border border-gray-200 bg-white rounded-md p-4 w-full">
        <img
          src={`/api/qr/${uid}`}
          width={768}
          height={768}
          alt="Profile QR"
        />
        <dd className="text-sm lg:text-xs text-center font-mono pt-2 break-words">
          {uid}
        </dd>
      </div>
    </div>
  )
})
