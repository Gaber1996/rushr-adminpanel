import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ROUTE_TITLES = [
  { match: /^\/login$/, title: 'Sign In' },
  { match: /^\/dashboard$/, title: 'Dashboard' },
  { match: /^\/pro-verification$/, title: 'Pro Verification' },
  { match: /^\/pro-verification\/[^/]+$/, title: 'Verification Details' },
  { match: /^\/dispute-resolution$/, title: 'Dispute Resolution' },
  { match: /^\/dispute-resolution\/[^/]+$/, title: 'Dispute Details' },
  { match: /^\/user-management$/, title: 'User Management' },
  { match: /^\/platform-settings$/, title: 'Platform Settings' },
  { match: /^\/audit-log$/, title: 'Audit Log' },
]

const BASE_TITLE = 'Rushr Admin'

export function useDocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const entry = ROUTE_TITLES.find((r) => r.match.test(pathname))
    document.title = entry ? `${entry.title} | ${BASE_TITLE}` : BASE_TITLE
  }, [pathname])
}
