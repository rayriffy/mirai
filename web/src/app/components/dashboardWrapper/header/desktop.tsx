import { memo } from 'react'

import { DesktopNavbar } from '../navbar/desktop'
import { DesktopUser } from '../user/desktop'

import { Offline } from '../offline'

export const DesktopHeader = memo(() => {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-gray-100">
        <div className="flex items-center flex-shrink-0 px-6">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-logo-purple-500-mark-gray-700-text.svg"
            alt="Workflow"
          />
        </div>
        <Offline />
        <div className="h-0 flex-1 flex flex-col overflow-y-auto">
          <DesktopUser />
          <DesktopNavbar />
        </div>
      </div>
    </div>
  )
})
