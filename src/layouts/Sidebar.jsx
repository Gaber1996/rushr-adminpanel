import { useNavigate, useLocation } from 'react-router-dom'
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
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Pro Verification', icon: ShieldCheck, path: '/pro-verification' },
  { label: 'Dispute Resolution', icon: MessageSquareWarning, path: '/dispute-resolution' },
  { label: 'User Management', icon: Users, path: '/user-management' },
  { label: 'Platform Settings', icon: Settings, path: '/platform-settings' },
  { label: 'Audit Log', icon: ClipboardList, path: '/audit-log' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
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
                    ? 'bg-[#ECF5FF] font-semibold text-[#0067DE]'
                    : 'text-[#6A6A6A] hover:bg-gray-50'
                }`}
                style={{ height: '40px' }}
              >
                <item.icon className="h-6 w-6 flex-shrink-0" />
                <span className="font-montserrat text-base">{item.label}</span>
              </button>
            </div>
          )
        })}
      </nav>

      <div className="px-[14px] py-[16px]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-[10px] py-[8px] text-[#C20A0A] transition-colors hover:bg-red-50"
          style={{ height: '40px' }}
        >
          <LogOut className="h-6 w-6 flex-shrink-0" />
          <span className="font-montserrat text-base font-semibold">Log Out</span>
        </button>
      </div>
    </aside>
  )
}
