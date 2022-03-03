import { FunctionComponent, useState, useCallback, useEffect } from 'react'

import { useRouter } from 'next/router'

import { Unauthorized } from './unauthorized'
import { Footer } from '../footer'

import { MobileHeader } from './header/mobile'
import { MobileOverlay } from './mobileOverlay'
import { DesktopHeader } from './header/desktop'

import { useRoleAccess } from '../../services/useRoleAccess'

export const DashboardWrapper: FunctionComponent = props => {
  const { children } = props

  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [router])

  const onToggleSidebar = useCallback(() => setSidebarOpen(o => !o), [])
  const { authorized } = useRoleAccess()

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <MobileOverlay show={sidebarOpen} onToggleSidebar={onToggleSidebar} />
      <DesktopHeader />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <MobileHeader onToggleSidebar={onToggleSidebar} />
        <main
          className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
          tabIndex={0}
        >
          <div className="h-full flex flex-col justify-between">
            <div>{authorized ? children : <Unauthorized />}</div>
            <Footer bg="bg-gray-50" />
          </div>
        </main>
      </div>
    </div>
  )
}
