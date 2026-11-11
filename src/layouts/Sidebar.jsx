import { useNavigate, useLocation } from 'react-router-dom'
import { clearSession } from '../lib/session'
import { ROUTES } from '../config/routes'
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
  { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.dashboard },
  { label: 'Pro Verification', icon: ShieldCheck, path: ROUTES.proVerification },
  { label: 'Dispute Resolution', icon: MessageSquareWarning, path: ROUTES.disputeResolution },
  { label: 'User Management', icon: Users, path: ROUTES.userManagement },
  { label: 'Platform Settings', icon: Settings, path: ROUTES.platformSettings },
  { label: 'Audit Log', icon: ClipboardList, path: ROUTES.auditLog },
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
          <span className="text-base font-semibold">Log Out</span>
        </button>
      </div>
    </aside>
  )
}
