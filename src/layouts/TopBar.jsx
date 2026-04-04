import { Search, Bell, Menu } from 'lucide-react'
import logo from '../assets/logo.png'

export default function TopBar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const initials = `${(user.firstName || 'A')[0]}${(user.lastName || 'K')[0]}`.toUpperCase()

  return (
    <header
      className="w-full flex items-center gap-4 bg-white border-b border-gray-100"
      style={{ height: '80px', padding: '12px 80px' }}
    >
      <button className="lg:hidden">
        <Menu className="w-6 h-6 text-gray-400" />
      </button>

      <img src={logo} alt="Rushr" className="w-[80px] h-[80px] object-contain" />

      {/* Search */}
      <div
        className="flex-1 flex items-center gap-2 rounded-xl border px-3"
        style={{ borderColor: '#D9D9D9', height: '56px', backgroundColor: '#FEFEFE' }}
      >
        <Search className="w-6 h-6 text-[#6A6A6A]" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none bg-transparent font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A]"
        />
      </div>

      {/* Notification */}
      <div className="relative w-14 h-14 flex items-center justify-center rounded-full hover:bg-gray-50 cursor-pointer">
        <Bell className="w-6 h-6 text-[#6A6A6A]" />
        <span
          className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-md text-xs font-montserrat"
          style={{ backgroundColor: '#FFFBF3', color: '#D97706', fontSize: '12px' }}
        >
          4
        </span>
      </div>

      {/* Profile */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-montserrat font-semibold"
        style={{ backgroundColor: '#0067DE', fontSize: '24px' }}
      >
        {initials}
      </div>
    </header>
  )
}
