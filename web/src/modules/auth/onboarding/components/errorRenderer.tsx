import { FunctionComponent, memo } from 'react'

import { XCircleIcon } from '@heroicons/react/outline'
import { useLocale } from '../../../../core/services/useLocale'

export interface Props {
  errors: string[]
}

export const ErrorRenderer: FunctionComponent<Props> = memo(props => {
  const { errors } = props

  const { locale } = useLocale({
    en: {
      title: 'Unable to proceed',
    },
    th: {
      title: 'ไม่สามารถทำรายการต่อได้',
    },
  })

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {locale('title')}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, i) => (
                <li key={`onboard-error-${i}`}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})
