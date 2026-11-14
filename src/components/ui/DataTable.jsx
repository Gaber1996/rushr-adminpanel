import { ChevronDown } from 'lucide-react'
import Button from './Button'
import Skeleton from './Skeleton'
import { COMMON_TEXT } from '../../texts'

/**
 * The two table designs in Figma.
 * - simple: left-aligned, hairline borders (verification queue, categories)
 * - grid: fixed column widths, centred, striped rows (disputes, audit log)
 */
const VARIANTS = {
  simple: {
    container: 'overflow-hidden rounded-xl border border-gray-100 bg-white',
    // Its minimum width is the sum of the column widths (see tableMinWidth).
    table: 'w-full table-fixed',
    headRow: 'border-b border-gray-100',
    th: 'px-4 py-4 text-left text-sm font-semibold text-muted',
    row: 'border-b border-gray-50 transition-colors hover:bg-gray-50/50',
    cell: 'px-4 py-4',
    cellText: '',
    message: 'px-4 py-10 text-center text-sm text-muted',
  },
  grid: {
    container:
      'overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_#ECECEE,0_1px_3px_0_rgba(0,0,0,0.06)]',
    // Its minimum width is the sum of the column widths (see tableMinWidth).
    table: 'w-full table-fixed',
    headRow: '',
    th: 'h-12 border-b bg-surface-subtle px-4 text-center text-base font-medium text-ink',
    row: '',
    cell: 'h-14 border-b',
    cellText: 'px-4 text-center text-[14px] font-semibold text-ink',
    message: 'border-b border-line px-4 py-10 text-center text-sm text-muted',
  },
}

const HIGHLIGHT_BG = 'bg-[#FFF7F7]'

/**
 * A fixed-layout table ignores its content, so its minimum width comes from the columns: each
 * one's `width`, or `minWidth` for the flexible column. Below that the table scrolls sideways.
 */
function tableMinWidth(columns) {
  const widths = columns.map((col) => col.width ?? col.minWidth).filter(Boolean)
  return widths.length ? `calc(${widths.join(' + ')})` : undefined
}

const cellClass = (col, row) =>
  typeof col.cellClassName === 'function' ? col.cellClassName(row) : col.cellClassName

/**
 * A data table with loading skeletons, an error row (with "Try again" when `onRetry` is given),
 * and an empty row. On screens narrower than the table it scrolls sideways, keeping the desktop layout.
 *
 * columns: [{ key, header, render(row, index), width?, minWidth?, sortIndicator?, cellClassName? }]
 * - `width` fixes a column; `minWidth` is the narrowest the flexible (width-less) column may get.
 *   Fixed widths keep the columns still while rows come and go (filtering, paging).
 * - `cellClassName` replaces the variant's default cell typography/padding for that column;
 *   it may be a function of the row. `cellClassName` on the table sets the default for every column.
 * - grid only: `isHighlighted(row)` paints a row with the red high-impact style.
 * - `loadingLabel` is announced to screen readers while the skeleton rows show.
 */
export default function DataTable({
  variant = 'simple',
  columns,
  rows,
  rowKey,
  loading = false,
  error = '',
  onRetry,
  emptyMessage = COMMON_TEXT.noResults,
  loadingLabel,
  skeletonRows = 5,
  cellClassName,
  isHighlighted = () => false,
  footer,
}) {
  const styles = VARIANTS[variant]
  const isGrid = variant === 'grid'
  const defaultCellText = cellClassName ?? styles.cellText
  // Skeletons only on a first load. A reload (page turn, search, save) keeps the rows on screen,
  // dimmed, until the new data arrives — no flash.
  const firstLoad = loading && rows.length === 0
  const refreshing = loading && rows.length > 0
  const showRows = !firstLoad && !error

  const gridRowTone = (index) => {
    const highlighted = isHighlighted(rows[index])
    // Borders collapse, so each edge is drawn by the row above it. An edge is red when either
    // row it separates is high-impact — a red row gets a red rule on its top and bottom.
    const redEdge = highlighted || (index + 1 < rows.length && isHighlighted(rows[index + 1]))
    const bg = highlighted ? HIGHLIGHT_BG : index % 2 === 1 ? 'bg-surface-subtle' : 'bg-surface'
    return `${bg} ${redEdge ? 'border-danger' : 'border-line'}`
  }

  const message = (content, tone = '') => (
    <tr>
      <td colSpan={columns.length} className={`${styles.message} ${tone}`}>
        {content}
      </td>
    </tr>
  )

  const errorContent = onRetry ? (
    <div role="alert" className="flex flex-col items-center gap-3">
      <p className="text-sm text-danger">{error}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        {COMMON_TEXT.tryAgain}
      </Button>
    </div>
  ) : (
    <p role="alert" className="text-sm text-danger">
      {error}
    </p>
  )

  return (
    <div className={styles.container}>
      {/* Scrolls sideways when the screen is narrower than the table */}
      <div className="overflow-x-auto">
        <table className={styles.table} style={{ minWidth: tableMinWidth(columns) }}>
          {loading && loadingLabel && <caption className="sr-only">{loadingLabel}</caption>}
          <colgroup>
            {columns.map((col) => (
              <col key={col.key} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr className={styles.headRow}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`${styles.th} ${
                    isGrid
                      ? showRows && rows.length > 0 && isHighlighted(rows[0])
                        ? 'border-danger'
                        : 'border-line'
                      : ''
                  }`}
                >
                  {col.sortIndicator ? (
                    <span className="flex items-center gap-1">
                      {col.header} <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </span>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            aria-busy={loading || undefined}
            className={refreshing ? 'opacity-60 transition-opacity' : undefined}
          >
            {firstLoad &&
              Array.from({ length: skeletonRows }, (_, i) => (
                <tr key={`skeleton-${i}`} className={isGrid ? '' : styles.row}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        isGrid
                          ? `${styles.cell} px-4 ${i % 2 ? 'bg-surface-subtle' : 'bg-surface'} border-line`
                          : styles.cell
                      }
                    >
                      <Skeleton className={`h-4 ${isGrid ? 'mx-auto w-3/4' : 'w-24'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading && error && message(errorContent)}
            {showRows &&
              rows.map((row, index) => (
                <tr key={rowKey(row)} className={styles.row}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        isGrid
                          ? `${styles.cell} ${gridRowTone(index)} ${cellClass(col, row) ?? defaultCellText}`
                          : `${styles.cell} ${cellClass(col, row) ?? defaultCellText}`
                      }
                    >
                      {col.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))}
            {showRows && !loading && rows.length === 0 && message(emptyMessage)}
          </tbody>
        </table>
      </div>

      {footer}
    </div>
  )
}
