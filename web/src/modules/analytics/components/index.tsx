import { memo } from 'react'

import { ServerLog } from './serverLog'
import { TopupPerformance } from './topupPerformance'
import { UsagePerformance } from './usagePerformance'

interface Props {
  storeId: string
}

export const Analytics = memo<Props>(props => {
  const { storeId } = props

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold mb-3">Server log</h1>
          <ServerLog storeId={storeId} />
        </div>
        <div>
          <h1 className="text-xl font-bold mb-3">Topup performance</h1>
          <TopupPerformance storeId={storeId} />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold mb-3">Usage performance</h1>
        <UsagePerformance storeId={storeId} />
      </div>
    </div>
  )
})
