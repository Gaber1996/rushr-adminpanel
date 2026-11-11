import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { clearSession } from '../lib/session'
import { ROUTES } from '../config/routes'
import { NAVIGATION_TEXT } from '../texts'
import {
  LayoutDashboard,
  ShieldCheck,
  MessageSquareWarning,
  Users,
  Settings,
  ClipboardList,
  LogOut,
} from 'lucide-react'

/** Links the menu button (TopBar) to the drawer it controls. */
export const ADMIN_NAV_ID = 'admin-nav'

const navItems = [
  { label: NAVIGATION_TEXT.pages.dashboard, icon: LayoutDashboard, path: ROUTES.dashboard },
  {
    label: NAVIGATION_TEXT.pages.proVerification,
    icon: ShieldCheck,
    path: ROUTES.proVerification,
  },
  {
    label: NAVIGATION_TEXT.pages.disputeResolution,
    icon: MessageSquareWarning,
    path: ROUTES.disputeResolution,
  },
  { label: NAVIGATION_TEXT.pages.userManagement, icon: Users, path: ROUTES.userManagement },
  {
    label: NAVIGATION_TEXT.pages.platformSettings,
    icon: Settings,
    path: ROUTES.platformSettings,
  },
  { label: NAVIGATION_TEXT.pages.auditLog, icon: ClipboardList, path: ROUTES.auditLog },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    clearSession()
    navigate(ROUTES.login)
  }

  const firstLinkRef = useRef(null)

  // While the drawer is open: focus its first link, and let Esc close it.
  useEffect(() => {
    if (!open) return undefined
    firstLinkRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {/* Dimmed page behind the open drawer (below lg); clicking it closes the drawer. */}
      {open && (
        <button
          type="button"
          aria-label={NAVIGATION_TEXT.closeMenu}
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
      <aside
        id={ADMIN_NAV_ID}
        // lg and up: the original static sidebar. Below lg: an off-canvas drawer, invisible (so not
        // reachable with Tab or a screen reader) while closed.
        className={`flex h-full w-[300px] flex-col justify-between border-r border-gray-100 bg-white max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:max-w-[85vw] max-lg:overflow-y-auto ${
          // Opening: visible at once (so focus can move in) and slide in. Closing: slide out, and
          // only then become invisible.
          open
            ? 'max-lg:translate-x-0 max-lg:transition-transform'
            : 'max-lg:invisible max-lg:-translate-x-full max-lg:transition-[transform,visibility]'
        }`}
      >
        <nav aria-label={NAVIGATION_TEXT.mainNavigation} className="flex flex-col">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <div key={item.path} className="px-[14px] py-[8px]">
                <button
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={() => {
                    navigate(item.path)
                    onClose()
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-[10px] py-[8px] transition-colors ${
                    isActive
                      ? 'bg-primary-soft font-semibold text-primary'
                      : 'text-muted hover:bg-gray-50'
                  }`}
                  style={{ height: '40px' }}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                  <span className="text-base">{item.label}</span>
                </button>
              </div>
            )
          })}
        </nav>

        <div className="px-[14px] py-[16px]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-[10px] py-[8px] text-danger transition-colors hover:bg-red-50"
            style={{ height: '40px' }}
          >
            <LogOut className="h-6 w-6 flex-shrink-0" />
            <span className="text-base font-semibold">{NAVIGATION_TEXT.logOut}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
