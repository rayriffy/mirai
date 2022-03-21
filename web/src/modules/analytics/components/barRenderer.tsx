import { DetailedHTMLProps, HTMLAttributes, memo, useMemo } from 'react'

import { ResponsiveBar, BarDatum } from '@nivo/bar'
import _groupBy from 'lodash/groupBy'
import dayjs from 'dayjs'

import { TransactionAnalytic } from '../@types/TransactionAnalytic'
import { useMedia } from 'web-api-hooks'
import { classNames } from '../../../core/services/classNames'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  startRange: Date
  endRange: Date
  analyticItems: TransactionAnalytic[]
  disableLegends?: boolean
  layout?: 'horizontal' | 'vertical'
  groupBy: 'date' | 'arcade'
  margin?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

interface BarItem extends BarDatum {
  titleKey: string
  pending: number
  processing: number
  success: number
  failed: number
  cancelled: number
}

export const BarRenderer = memo<Props>(props => {
  const { analyticItems, groupBy = 'date', startRange, endRange, layout, disableLegends = false, margin, ...rest } = props

  const isScreenTooSmall = useMedia('(max-width: 1024px)')

  const barData = useMemo<BarItem[]>(() => {
    const groupedByDay = _groupBy(analyticItems, item =>
      groupBy === 'date' ? dayjs(item.date).format('D MMM') : item.arcadeId
    )

    const sumByStatus = (
      analyticItems: TransactionAnalytic[],
      status: TransactionAnalytic['status']
    ) =>
      analyticItems
        .filter(o => o.status === status)
        .reduce((acc, cur) => acc + cur.amount, 0)

    if (groupBy === 'date') {
      const diffRange = Math.abs(dayjs(startRange).diff(dayjs(endRange), 'day'))

      const res = Array.from({ length: diffRange + 1 }).map((_, i) => {
        const titleKey = dayjs(startRange).add(i, 'day').format('D MMM')

        const targetGroupItems = Object.entries(groupedByDay).find(
          ([key]) => key === titleKey
        )

        return {
          titleKey,
          pending: targetGroupItems
            ? sumByStatus(targetGroupItems[1], 'pending')
            : 0,
          processing: targetGroupItems
            ? sumByStatus(targetGroupItems[1], 'processing')
            : 0,
          success: targetGroupItems
            ? sumByStatus(targetGroupItems[1], 'success')
            : 0,
          failed: targetGroupItems
            ? sumByStatus(targetGroupItems[1], 'failed')
            : 0,
          cancelled: targetGroupItems
            ? sumByStatus(targetGroupItems[1], 'cancelled')
            : 0,
        }
      })

      return res
    } else {
      const items: BarItem[] = Object.entries(groupedByDay).map(
        ([key, value]) => ({
          titleKey:
            groupBy === 'arcade'
              ? analyticItems.find(o => o.arcadeId === key).arcadeName
              : key,
          pending: sumByStatus(value, 'pending'),
          processing: sumByStatus(value, 'processing'),
          success: sumByStatus(value, 'success'),
          failed: sumByStatus(value, 'failed'),
          cancelled: sumByStatus(value, 'cancelled'),
        })
      )

      return items
    }
  }, [analyticItems])

  return (
    <div {...{
      ...rest,
      className: classNames(rest.className, 'h-[500px]')
    }}>
      <ResponsiveBar
        data={barData}
        keys={['pending', 'processing', 'success', 'failed', 'cancelled']}
        indexBy="titleKey"
        colors={bar => {
          switch (bar.id) {
            case 'failed':
              return 'rgb(244, 117, 96)'
            case 'success':
              return 'rgb(97, 205, 187)'
            case 'cancelled':
              return 'rgb(232, 193, 160)'
            case 'processing':
              return 'rgb(241, 225, 91)'
            case 'pending':
              return 'rgb(242, 242, 242)'
            default:
              return undefined
          }
        }}
        margin={{ top: margin?.top ?? 50, bottom: margin?.bottom ?? 50, left: margin?.left ?? 50, right: margin?.right ?? 125 }}
        padding={0.3}
        layout={layout ?? (isScreenTooSmall ? 'horizontal' : 'vertical')}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        {...{
          legends: disableLegends ? undefined : [
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]
        }}
      />
    </div>
  )
})
