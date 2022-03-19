import { memo } from 'react'

import { useNetworkAvailability } from 'web-api-hooks'

import { MenuAlt1Icon } from '@heroicons/react/outline'
import { MobileUser } from '../user/mobile'

interface Props {
  onToggleSidebar?(): void
}

export const MobileHeader = memo<Props>(props => {
  const { onToggleSidebar = () => {} } = props

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
      <button
        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
        onClick={onToggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <div className="inline-block relative">
          <MenuAlt1Icon className="h-6 w-6" />
          <Indicator />
        </div>
      </button>
      <div className="flex-1 flex justify-end px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {/* Profile dropdown */}
          <MobileUser />
        </div>
      </div>
    </div>
  )
})

const Indicator = memo(() => {
  const isOnline = useNetworkAvailability()

  if (!isOnline) {
    return (
      <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full text-white shadow-solid bg-red-400"></span>
    )
  } else {
    return null
  }
})
