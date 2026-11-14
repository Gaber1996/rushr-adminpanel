import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  // Below `lg` the sidebar is a slide-in drawer; at `lg` and up it is always shown.
  const [navOpen, setNavOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const { pathname } = useLocation()

  const closeNav = useCallback(() => {
    setNavOpen(false)
    // Hand focus back to the button that opened the drawer.
    menuButtonRef.current?.focus()
  }, [])

  // Moving to another page (e.g. browser back) closes the drawer.
  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen flex-col bg-surface">
      <TopBar
        navOpen={navOpen}
        onMenuClick={() => setNavOpen(true)}
        menuButtonRef={menuButtonRef}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={navOpen} onClose={closeNav} />
        {/* The scrollbar's room is always kept, so the page doesn't shift sideways when a list
            gets short enough to stop scrolling (e.g. while filtering). */}
        <main className="flex-1 overflow-auto p-4 [scrollbar-gutter:stable] sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
