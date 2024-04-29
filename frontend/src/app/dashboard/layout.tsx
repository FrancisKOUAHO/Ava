'use client'

import { ReactNode, useEffect, useState } from 'react'
import SideBar from '@/components/organisms/sidebar/sideBar'
import TopBar from '@/components/organisms/topbar/topBar'
import AuthContextProvider from '@/context/AuthContext'
import AuthGuard from '@/lib/AuthGuard'

const Layout = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <AuthContextProvider>
          <AuthGuard>
            <section className="c-layout-dashboard">
              <SideBar />
              <div className="c-layout-dashboard__container">
                <TopBar />
                {children}
              </div>
            </section>
          </AuthGuard>
        </AuthContextProvider>
      )}
    </>
  )
}

export default Layout
