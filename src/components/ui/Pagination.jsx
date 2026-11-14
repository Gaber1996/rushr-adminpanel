import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COMMON_TEXT } from '../../texts'

const PAGE_BUTTON =
  'flex h-10 items-center justify-center rounded-lg border border-line bg-surface px-4 py-2 text-[14px] font-semibold text-primary-strong shadow-[0_0.5px_1px_0_rgba(0,0,0,0.05)] transition-colors disabled:cursor-not-allowed disabled:opacity-40'

/**
 * Table footer: "Per page" picker, Prev, "Page X of Y", Next. `page` is 1-based.
 * `onPerPageChange` should also send the list back to page 1.
 */
export default function Pagination({
  page,
  totalPages,
  perPage,
  perPageOptions,
  onPageChange,
  onPerPageChange,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-[60px] flex-wrap items-center justify-center gap-4 bg-surface px-4 py-2">
      {/* Per page selector */}
      <div className="relative flex h-10 items-center overflow-visible rounded-lg border border-line shadow-[0_0.5px_2px_0_rgba(0,0,0,0.05)]">
        <div className="flex h-full items-center justify-center border-r border-line py-2 pl-3 pr-[13px]">
          <span className="text-[14px] font-semibold text-muted">{COMMON_TEXT.perPage}</span>
        </div>
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-full items-center justify-center gap-1 py-2 pl-3 pr-[13px]"
        >
          <span className="text-[14px] font-medium text-ink">{perPage}</span>
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 text-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {menuOpen && (
          <div className="absolute bottom-11 right-0 z-10 min-w-[80px] overflow-hidden rounded-lg border border-line bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]">
            {perPageOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onPerPageChange(option)
                }}
                className={`w-full px-3 py-2 text-left text-[14px] hover:bg-gray-50 ${
                  option === perPage ? 'font-semibold text-primary' : 'font-medium text-ink'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={PAGE_BUTTON}
      >
        {COMMON_TEXT.prev}
      </button>

      <span className="text-[14px] font-medium text-muted">
        {COMMON_TEXT.pageOf(page, totalPages)}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={PAGE_BUTTON}
      >
        {COMMON_TEXT.next}
      </button>
    </div>
  )
}

/**
 * The static "Per page 5 · Next" footer on the verification queue and categories tables.
 * Not wired to the API yet — later; kept so the screens match Figma.
 */
export function PaginationPlaceholder() {
  return (
    <div className="flex items-center justify-center gap-4 border-t border-gray-100 px-4 py-4">
      <span className="text-sm text-muted">{COMMON_TEXT.perPage}</span>
      <div className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5">
        <span className="text-sm">5</span>
        <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" />
      </div>
      <button
        type="button"
        className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted"
      >
        {COMMON_TEXT.next}
      </button>
    </div>
  )
}
