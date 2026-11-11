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

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    clearSession()
    navigate(ROUTES.login)
  }

  return (
    <aside className="flex h-full w-[300px] flex-col justify-between border-r border-gray-100 bg-white">
      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <div key={item.path} className="px-[14px] py-[8px]">
              <button
                onClick={() => navigate(item.path)}
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
  )
}
