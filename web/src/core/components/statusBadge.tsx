import { memo, useMemo } from 'react'

import { useLocale } from '../services/useLocale'
import { classNames } from '../services/classNames'

import { Transaction } from '../@types/firebase/Transaction'

interface Props {
  status: Transaction['status']
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const StatusBadge = memo<Props>(props => {
  const { status, size } = props

  const { locale } = useLocale({
    en: {
      pending: 'Pending',
      processing: 'Processing',
      success: 'Success',
      failed: 'Failed',
      cancelled: 'Cancelled',
    },
    th: {
      pending: 'กำลังรอดำเนินการ',
      processing: 'กำลังทำรายการ',
      success: 'สำเร็จ',
      failed: 'ล้มเหลว',
      cancelled: 'ยกเลิกแล้ว',
    },
  })

  const color = useMemo(() => {
    const colorScheme = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }

    return colorScheme[status]
  }, [status])

  return (
    <span
      className={classNames(
        size === 'md'
          ? 'text-base'
          : size === 'sm'
          ? 'text-sm'
          : size === 'lg'
          ? 'text-lg'
          : size === 'xl'
          ? 'text-xl'
          : 'text-xs',
        color,
        'inline-flex items-center px-2 py-0.5 rounded font-medium'
      )}
    >
      {locale(status)}
    </span>
  )
})
