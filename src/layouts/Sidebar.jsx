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
    <aside className="w-[300px] h-full bg-white flex flex-col justify-between border-r border-gray-100">
      <nav className="flex flex-col">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <div key={item.path} className="px-[14px] py-[8px]">
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2 px-[10px] py-[8px] rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#ECF5FF] text-[#0067DE] font-semibold'
                    : 'text-[#6A6A6A] hover:bg-gray-50'
                }`}
                style={{ height: '40px' }}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span className="font-montserrat text-base">{item.label}</span>
              </button>
            </div>
          )
        })}
      </nav>

      <div className="px-[14px] py-[16px]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-[10px] py-[8px] rounded-lg text-[#C20A0A] hover:bg-red-50 transition-colors"
          style={{ height: '40px' }}
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span className="font-montserrat text-base font-semibold">Log Out</span>
        </button>
      </div>
    </aside>
  )
}
