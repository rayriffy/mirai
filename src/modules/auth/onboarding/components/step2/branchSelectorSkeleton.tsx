import { memo } from 'react'

import { LocationMarkerIcon, SelectorIcon } from '@heroicons/react/outline'

export const BranchSelectorSkeleton = memo(() => (
  <div className="flex space-x-2">
    <div className="mt-1 relative w-full">
      <button
        type="button"
        disabled
        className="bg-gray-100 relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-wait"
      >
        <span className="block truncate">Loading</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>
    </div>
    <div className="mt-1">
      <button
        type="button"
        disabled
        className="bg-gray-100 cursor-not-allowed inline-flex items-center p-2 h-10 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        <LocationMarkerIcon className="w-6 h-6" />
      </button>
    </div>
  </div>
))
