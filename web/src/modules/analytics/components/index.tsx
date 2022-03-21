import { memo } from 'react'
import { useLocale } from '../../../core/services/useLocale'

import { ServerLog } from './serverLog'
import { TopupPerformance } from './topupPerformance'
import { UsagePerformance } from './usagePerformance'

interface Props {
  storeId: string
}

export const Analytics = memo<Props>(props => {
  const { storeId } = props

  const { locale } = useLocale({
    en: {
      server: 'Server log',
      topup: 'Topup performance',
      usage: 'Usage performance',
    },
    th: {
      server: 'ข้อความจากเซิร์ฟเวอร์',
      topup: 'ประวัติการเติมเงิน',
      usage: 'ประวัติการใช้เหรียญ',
    },
  })

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold mb-3">{locale('server')}</h1>
          <ServerLog storeId={storeId} />
        </div>
        <div>
          <h1 className="text-xl font-bold mb-3">{locale('topup')}</h1>
          <TopupPerformance storeId={storeId} />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold mb-3">{locale('usage')}</h1>
        <UsagePerformance storeId={storeId} />
      </div>
    </div>
  )
})
