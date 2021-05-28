import { FunctionComponent, useState, useCallback, useEffect } from 'react'

import { useRouter } from 'next/router'

import { Footer } from '../footer'

import { MobileHeader } from './header/mobile'
import { MobileOverlay } from './mobileOverlay'
import { DesktopHeader } from './header/desktop'

export const DashboardWrapper: FunctionComponent = props => {
  const { children } = props

  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [router])

  const onToggleSidebar = useCallback(() => setSidebarOpen(o => !o), [])

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <MobileOverlay show={sidebarOpen} onToggleSidebar={onToggleSidebar} />
      <DesktopHeader />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <MobileHeader onToggleSidebar={onToggleSidebar} />
        <main
          className="flex-1 relative z-0 overflow-y-auto focus:outline-none pb-6"
          tabIndex={0}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
