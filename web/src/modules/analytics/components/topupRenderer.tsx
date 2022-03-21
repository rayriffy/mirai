import { memo, useMemo } from "react";

import groupBy from "lodash/groupBy";

import { TopupAnalytic } from "../@types/TopupAnalytic";
import dayjs from "dayjs";
import { CurrencyIcon } from "../../../core/components/currencyIcon";

interface Props {
  storeId: string
  topups: TopupAnalytic[]
  startRange: Date
  endRange: Date
}

export const TopupRenderer = memo<Props>(props => {
  const { storeId, topups, startRange, endRange } = props

  const grouppedTopup = useMemo(() => {
    const groupedByDay = groupBy(topups, item =>
      dayjs(item.date).format('D MMM')
    )

    const diffRange = Math.abs(dayjs(startRange).diff(dayjs(endRange), 'day'))

    const sumByStatus = (
      analyticItems: TopupAnalytic[],
      status: TopupAnalytic['status']
    ) =>
      analyticItems
        .filter(o => o.status === status)
        .reduce((acc, cur) => acc + cur.amount, 0)

    const res = Array.from({ length: diffRange + 1 }).map((_, i) => {
      const targetDate = dayjs(startRange).add(i, 'day')
      const titleKey = targetDate.format('D MMM')

      const targetGroupItems = Object.entries(groupedByDay).find(
        ([key]) => key === titleKey
      )

      return {
        key: titleKey,
        title: targetDate.format('DD MMM YYYY'),
        success: targetGroupItems
          ? sumByStatus(targetGroupItems[1], 'success')
          : 0,
      }
    })

    return res.reverse()
  }, [])

  return (
    <table className="min-w-full divide-y divide-gray-300 text-xs">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
            Date
          </th>
          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Amount
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {grouppedTopup.map(item => (
          <tr key={`topup-${storeId}-${item.key}`}>
            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {item.title}
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 flex items-center">{item.success} <CurrencyIcon className='ml-2 mr-3' currency="coin" /> ({(item.success * 10).toLocaleString()} ฿)</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
})