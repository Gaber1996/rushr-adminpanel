import { useState } from 'react'

/**
 * Paging over a list already in memory. `page` is 1-based and clamped to the last page, so a
 * shrinking list (search, filters) never leaves you on an empty page. `perPage` changes return to
 * page 1. Call `resetPage()` when the list's criteria change.
 */
export function useClientPagination(items, initialPerPage = 10) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPageState] = useState(initialPerPage)

  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * perPage

  return {
    page: currentPage,
    totalPages,
    perPage,
    pageItems: items.slice(start, start + perPage),
    setPage: (next) => setPage(Math.min(Math.max(1, next), totalPages)),
    setPerPage: (next) => {
      setPerPageState(next)
      setPage(1)
    },
    resetPage: () => setPage(1),
  }
}
