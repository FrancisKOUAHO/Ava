'use client'

import { ReactNode, useEffect, useState } from 'react'
import SideBar from '@/components/organisms/sidebar/sideBar'
import TopBar from '@/components/organisms/topbar/topBar'
import AuthContextProvider from '@/context/AuthContext'
import AuthGuard from '@/lib/AuthGuard'
import SidebarModal from "@/components/atoms/modal/sidebarModal";

const Layout = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false)
  const [sidebarModalVisible, setSidebarModalVisible] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const openSidebarModal = () => {
    setSidebarModalVisible(true)
  }

  const closeSidebarModal = () => {
    setSidebarModalVisible(false)
  }

  return (
    <>
      {isClient && (
        <AuthContextProvider>
          <AuthGuard>
            <section className="c-layout-dashboard">
              <SidebarModal isOpen={sidebarModalVisible} closeModal={closeSidebarModal} />
              <SideBar />
              <div className="c-layout-dashboard__container">
                <TopBar openSidebar={openSidebarModal} />
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
