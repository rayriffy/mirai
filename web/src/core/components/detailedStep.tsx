import { Fragment, memo } from 'react'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import { classNames } from '../services/classNames'

interface Props {
  currentIndex: number
  currentStatus: 'progress' | 'success' | 'fail'
  details: string[]
}

export const DetailedStep = memo<Props>(props => {
  const { details, currentIndex, currentStatus } = props

  return (
    <nav className="flex justify-center" aria-label="Progress">
      <ol role="list" className="space-y-6">
        {details.map((detail, i) => (
          <li key={`step-${detail}-${i}`}>
            {i < currentIndex || (i === currentIndex && currentStatus === 'success') ? (
              <span className="flex items-start">
                <span className="flex-shrink-0 relative h-5 w-5 flex items-center justify-center">
                  <CheckCircleIcon
                    className="h-full w-full text-indigo-600 group-hover:text-indigo-800"
                    aria-hidden="true"
                  />
                </span>
                <span className={classNames(i === currentIndex ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-900', 'ml-3 text-sm font-medium')}>
                  {detail}
                </span>
              </span>
            ) : i === currentIndex && currentStatus === 'fail' ? (
              <span className="flex items-start">
                <span className="flex-shrink-0 relative h-5 w-5 flex items-center justify-center">
                  <XCircleIcon
                    className="h-full w-full text-red-600 group-hover:text-red-800"
                    aria-hidden="true"
                  />
                </span>
                <span className="ml-3 text-sm font-medium text-red-600">
                  {detail}
                </span>
              </span>
            ) : i === currentIndex && currentStatus === 'progress' ? (
              <span className="flex items-start">
                <span
                  className="flex-shrink-0 h-5 w-5 relative flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="absolute h-4 w-4 rounded-full bg-indigo-200" />
                  <span className="relative block w-2 h-2 bg-indigo-600 rounded-full" />
                </span>
                <span className="ml-3 text-sm font-medium text-indigo-600">
                  {detail}
                </span>
              </span>
            ) : (
              <div className="flex items-start">
                <div
                  className="flex-shrink-0 h-5 w-5 relative flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="h-2 w-2 bg-gray-300 rounded-full group-hover:bg-gray-400" />
                </div>
                <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                  {detail}
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
})
