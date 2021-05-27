import { FunctionComponent, memo } from 'react'

import { Spinner } from './spinner'

export const CenterSpinner: FunctionComponent = memo(() => (
  <div className="min-h-screen bg-gray-50 flex justify-center items-center"><Spinner /></div>
))
