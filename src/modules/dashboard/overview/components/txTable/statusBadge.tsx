import { memo, useMemo } from 'react'

import { useLocale } from '../../../../../core/services/useLocale'
import { classNames } from '../../../../../core/services/classNames'

import { Transaction } from "../../../../../core/@types/firebase/Transaction"

interface Props {
  status: Transaction['status']
}

export const StatusBadge = memo<Props>(props => {
  const { status } = props

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
      pending: 'bg-orange-100 text-orange-800',
      processing: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }

    return colorScheme[status]
  }, [status])

  return (
    <span className={classNames(color, "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium")}>
      {locale(status)}
    </span>
  )
})