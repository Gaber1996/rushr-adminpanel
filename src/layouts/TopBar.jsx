import { Bell, Menu } from 'lucide-react'
import logo from '../assets/logo.png'
import { getUser } from '../lib/session'
import { COMMON_TEXT, NAVIGATION_TEXT } from '../texts'
import { ADMIN_NAV_ID } from './Sidebar'

/** Initials for the avatar; falls back to the original "AK" placeholder. */
export function getInitials({ firstName, lastName }) {
  return `${(firstName || 'A')[0]}${(lastName || 'K')[0]}`.toUpperCase()
}

export default function TopBar({ navOpen, onMenuClick, menuButtonRef }) {
  const initials = getInitials(getUser())

  return (
    <header className="flex h-20 w-full shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:gap-4 sm:px-8 lg:px-20">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onMenuClick}
        aria-label={NAVIGATION_TEXT.openMenu}
        aria-expanded={navOpen}
        aria-controls={ADMIN_NAV_ID}
        className="lg:hidden"
      >
        <Menu className="h-6 w-6 text-gray-400" aria-hidden="true" />
      </button>

      <img
        src={logo}
        alt={COMMON_TEXT.brandName}
        className="h-14 w-14 object-contain sm:h-[80px] sm:w-[80px]"
      />

      <div className="flex-1" />

      {/* Notification */}
      <div className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full hover:bg-gray-50">
        <Bell className="h-6 w-6 text-muted" />
        <span
          className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-md text-xs"
          style={{ backgroundColor: '#FFFBF3', color: '#D97706', fontSize: '12px' }}
        >
          4
        </span>
      </div>

      {/* Profile */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full font-semibold text-white"
        style={{ backgroundColor: '#0067DE', fontSize: '24px' }}
        // The start-up skeleton script (build/bootSkeletons.js) blanks this until React fills it.
        data-initials
      >
        {initials}
      </div>
    </header>
  )
}
