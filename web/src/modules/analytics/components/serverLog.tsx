import { memo } from 'react'

import { Spinner } from '../../../core/components/spinner'
import { useServerLog } from '../services/useServerLog'

interface Props {
  storeId: string
}

export const ServerLog = memo<Props>(props => {
  const { storeId } = props

  const { loading, data } = useServerLog(storeId)

  return (
    <div className="h-[25rem] overflow-y-scroll overflow-x-scroll text-xs">
      {loading ? (
        <Spinner />
      ) : (
        <table className="min-w-full divide-y divide-gray-300 border">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Unit
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Message
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map(log => (
              <tr key={`log-${storeId}-${log.createdAt}`}>
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {log.unit}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
})
