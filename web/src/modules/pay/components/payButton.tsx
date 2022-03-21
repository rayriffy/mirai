import { memo, useMemo } from 'react'
import { classNames } from '../../../core/services/classNames'
import { useLocale } from '../../../core/services/useLocale'
import { useArcadeAvailability } from '../services/useArcadeAvailability'

interface Props {
  arcadeId: string
  calculatedPostBalance: number
  paymentProcessing: boolean
  onPayment?(): void
}

export const PayButton = memo<Props>(props => {
  const { arcadeId, calculatedPostBalance, paymentProcessing, onPayment = () => {} } = props

  const { locale } = useLocale({
    en: {
      pay: 'Pay',
      offline: 'Arcade is offline',
    },
    th: {
      pay: 'จ่าย',
      offline: 'ตู้เกมนี้ยังไม่ออนไลน์',
    },
  })

  const { availability } = useArcadeAvailability(arcadeId)

  const isPayButtonDisabled = useMemo(
    () => calculatedPostBalance < 0 || paymentProcessing || ['offline', 'unknown'].includes(availability),
    [calculatedPostBalance, paymentProcessing, availability]
  )

  return (
    <button
      type="button"
      disabled={isPayButtonDisabled}
      className={classNames(
        calculatedPostBalance < 0 || ['offline', 'unknown'].includes(availability)
          ? 'cursor-not-allowed'
          : paymentProcessing
          ? 'cursor-wait'
          : '',
        'transition inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-indigo-400 disabled:hover:bg-indigo-500'
      )}
      onClick={onPayment}
    >
      {['offline', 'unknown'].includes(availability) ? locale('offline') : locale('pay')}
    </button>
  )
})