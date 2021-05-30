import { locale } from 'dayjs'
import { memo } from 'react'

import { useLocale } from '../../../../../core/services/useLocale'

export const TableHeader = memo(() => {
  const {} = useLocale({
    en: {
      transaction: 'Transaction',
      token: 'Token',
      value: 'Value',
      status: 'Status',
      updated: 'Last updated',
    },
    th: {
      transaction: 'รายการใช้งาน',
      token: 'จำนวนเหรียญ',
      value: 'ราคา',
      status: 'สถานะ',
      updated: 'อัพเดตล่าสุดเมื่อ',
    },
  })
  return (
    <tr className="border-t border-gray-200">
      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <span className="lg:pl-2">{locale('transaction')}</span>
      </th>
      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {locale('token')}
      </th>
      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {locale('value')}
      </th>
      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {locale('status')}
      </th>
      <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
        {locale('updated')}
      </th>
      <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
    </tr>
  )
})
