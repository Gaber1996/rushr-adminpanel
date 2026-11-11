import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { ROUTE_TITLES } from '../config/routes'

const BASE_TITLE = 'Rushr Admin'

/** "<Page> | Rushr Admin" for the current route, or just "Rushr Admin". */
export function titleFor(pathname) {
  const pattern = Object.keys(ROUTE_TITLES).find((p) => matchPath(p, pathname))
  return pattern ? `${ROUTE_TITLES[pattern]} | ${BASE_TITLE}` : BASE_TITLE
}

export function useDocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = titleFor(pathname)
  }, [pathname])
}
