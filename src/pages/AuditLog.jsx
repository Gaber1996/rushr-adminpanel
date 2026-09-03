import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Circle, ChevronDown, Check } from 'lucide-react'
import { AUDIT_LOGS, AUDIT_MODULES } from '../data/auditLogs'

const PER_PAGE_OPTIONS = [5, 10, 20, 50]

const HIGH_IMPACT_BG = '#FFF7F7'
const HIGH_IMPACT_BORDER = '#C20A0A'

const COLUMNS = [
  { key: 'timestamp', label: 'Date & Time', width: '153px' },
  { key: 'actor', label: 'Actor', width: '164px' },
  { key: 'module', label: 'Module', width: '198px' },
  { key: 'action', label: 'Actions' },
  { key: 'reason', label: 'Reason', width: '311px' },
]

function Legend() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-xl border p-2"
      style={{ backgroundColor: HIGH_IMPACT_BG, borderColor: HIGH_IMPACT_BORDER }}
    >
      <Circle className="w-5 h-5 shrink-0" style={{ color: HIGH_IMPACT_BORDER }} />
      <span
        className="font-montserrat font-medium text-[#0F0F0F]"
        style={{ fontSize: '16px', lineHeight: '16px' }}
      >
        Red-highlighted fields represent high-impact actions.
      </span>
    </div>
  )
}

export default function AuditLog() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [perPageOpen, setPerPageOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [moduleFilter, setModuleFilter] = useState([])
  const [highImpactOnly, setHighImpactOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return AUDIT_LOGS.filter((log) => {
      if (highImpactOnly && !log.highImpact) return false
      if (moduleFilter.length > 0 && !moduleFilter.includes(log.module)) return false
      if (!q) return true
      return (
        log.timestamp.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q)
      )
    })
  }, [search, moduleFilter, highImpactOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * perPage
  const pageRows = filtered.slice(startIndex, startIndex + perPage)
  const activeFilterCount = moduleFilter.length + (highImpactOnly ? 1 : 0)

  function changePerPage(value) {
    setPerPage(value)
    setPage(1)
    setPerPageOpen(false)
  }

  function toggleModule(name) {
    setModuleFilter((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    )
    setPage(1)
  }

  function clearFilters() {
    setModuleFilter([])
    setHighImpactOnly(false)
    setPage(1)
  }

  function goPrev() {
    if (currentPage > 1) setPage(currentPage - 1)
  }

  function goNext() {
    if (currentPage < totalPages) setPage(currentPage + 1)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1
          className="font-montserrat font-extrabold text-[#0F0F0F]"
          style={{ fontSize: '40px', lineHeight: '40px' }}
        >
          Audit Logs
        </h1>
        <p
          className="font-montserrat font-semibold text-[#6A6A6A]"
          style={{ fontSize: '24px', lineHeight: '24px' }}
        >
          Stay informed about every action and change made across the platform.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Legend />

        <div className="flex flex-col gap-8">
          {/* Search + Filter */}
          <div className="flex items-center gap-6">
            <div
              className="flex flex-1 items-center gap-2 rounded-xl px-3"
              style={{
                height: '56px',
                backgroundColor: '#FEFEFE',
                boxShadow: '0px 0px 0px 1px #E5E5E5, 0px 1px 3px 0px rgba(0,0,0,0.06)',
              }}
            >
              <Search className="w-6 h-6 text-[#6A6A6A]" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="flex-1 outline-none bg-transparent font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A]"
              />
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center justify-center gap-2 rounded-xl border transition-colors hover:bg-[#ECF5FF]"
                style={{ height: '56px', width: '157px', borderColor: '#0067DE' }}
              >
                <SlidersHorizontal className="w-6 h-6" style={{ color: '#0052B0' }} />
                <span
                  className="font-montserrat font-bold"
                  style={{ fontSize: '18px', color: '#0052B0' }}
                >
                  Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </span>
              </button>

              {filterOpen && (
                <div
                  className="absolute right-0 z-10 flex flex-col gap-2 rounded-xl bg-white p-3"
                  style={{
                    top: '64px',
                    minWidth: '240px',
                    border: '1px solid #D9D9D9',
                    boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.08)',
                  }}
                >
                  <span
                    className="font-montserrat font-semibold text-[#6A6A6A] px-1"
                    style={{ fontSize: '12px' }}
                  >
                    Module
                  </span>
                  {AUDIT_MODULES.map((name) => {
                    const checked = moduleFilter.includes(name)
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleModule(name)}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                      >
                        <span
                          className={`font-montserrat ${checked ? 'font-semibold text-[#0067DE]' : 'font-medium text-[#0F0F0F]'}`}
                          style={{ fontSize: '14px' }}
                        >
                          {name}
                        </span>
                        {checked && <Check className="w-4 h-4 text-[#0067DE]" strokeWidth={3} />}
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setHighImpactOnly((v) => !v)
                      setPage(1)
                    }}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                    style={{ borderTop: '1px solid #D9D9D9' }}
                  >
                    <span
                      className={`font-montserrat ${highImpactOnly ? 'font-semibold' : 'font-medium'}`}
                      style={{ fontSize: '14px', color: HIGH_IMPACT_BORDER }}
                    >
                      High-impact only
                    </span>
                    {highImpactOnly && (
                      <Check className="w-4 h-4" style={{ color: HIGH_IMPACT_BORDER }} strokeWidth={3} />
                    )}
                  </button>

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-lg px-2 py-2 text-left font-montserrat font-semibold text-[#6A6A6A] hover:bg-gray-50"
                      style={{ fontSize: '14px' }}
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div
            className="rounded-xl overflow-hidden bg-white"
            style={{ boxShadow: '0px 0px 0px 1px #ECECEE, 0px 1px 3px 0px rgba(0,0,0,0.06)' }}
          >
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                {COLUMNS.map((col) => (
                  <col key={col.key} style={col.width ? { width: col.width } : undefined} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="font-montserrat font-medium text-[#0F0F0F] text-center"
                      style={{
                        height: '48px',
                        backgroundColor: '#FAFAFA',
                        // Shared edge with the first row — red when that row is high-impact.
                        borderBottom: `1px solid ${pageRows[0]?.highImpact ? HIGH_IMPACT_BORDER : '#D9D9D9'}`,
                        fontSize: '16px',
                        padding: '0 16px',
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((log, idx) => {
                  const zebra = idx % 2 === 1 ? '#FAFAFA' : '#FEFEFE'
                  // Borders collapse, so each edge is drawn once by the row above it.
                  // An edge is red when either of the rows it separates is high-impact —
                  // that gives the red row a red rule on both its top and its bottom.
                  const nextIsHighImpact = pageRows[idx + 1]?.highImpact
                  const rowStyle = {
                    backgroundColor: log.highImpact ? HIGH_IMPACT_BG : zebra,
                    borderBottom: `1px solid ${
                      log.highImpact || nextIsHighImpact ? HIGH_IMPACT_BORDER : '#D9D9D9'
                    }`,
                  }
                  const cellStyle = {
                    height: '56px',
                    padding: '0 16px',
                    textAlign: 'center',
                    ...rowStyle,
                  }
                  return (
                    <tr key={log.id}>
                      <td className="font-montserrat font-medium text-[#0F0F0F]" style={{ ...cellStyle, fontSize: '14px' }}>
                        {log.timestamp}
                      </td>
                      <td className="font-montserrat font-medium text-[#0F0F0F]" style={{ ...cellStyle, fontSize: '14px' }}>
                        {log.actor}
                      </td>
                      <td className="font-montserrat font-medium text-[#0F0F0F]" style={{ ...cellStyle, fontSize: '14px' }}>
                        {log.module}
                      </td>
                      <td
                        className="font-montserrat font-medium"
                        style={{
                          ...cellStyle,
                          fontSize: '14px',
                          lineHeight: '1.4',
                          color: log.highImpact ? HIGH_IMPACT_BORDER : '#0F0F0F',
                        }}
                      >
                        {log.action}
                      </td>
                      <td
                        className="font-montserrat font-medium text-[#0F0F0F]"
                        style={{ ...cellStyle, fontSize: '12px', lineHeight: '1.4', padding: '8px 16px' }}
                      >
                        {log.reason}
                      </td>
                    </tr>
                  )
                })}
                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      className="px-4 py-10 text-center font-montserrat text-sm text-[#6A6A6A]"
                      style={{ borderBottom: '1px solid #D9D9D9' }}
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination footer */}
            <div
              className="flex items-center justify-center gap-4"
              style={{ height: '60px', padding: '0 16px', backgroundColor: '#FEFEFE' }}
            >
              {/* Per page selector */}
              <div
                className="relative flex items-center rounded-lg overflow-visible"
                style={{ height: '40px', border: '1px solid #D9D9D9', boxShadow: '0px 0.5px 2px 0px rgba(0,0,0,0.05)' }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ height: '100%', padding: '8px 13px 8px 12px', borderRight: '1px solid #D9D9D9' }}
                >
                  <span className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '14px' }}>
                    Per page
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPerPageOpen((v) => !v)}
                  className="flex items-center gap-1 justify-center"
                  style={{ height: '100%', padding: '8px 13px 8px 12px' }}
                >
                  <span className="font-montserrat font-medium text-[#0F0F0F]" style={{ fontSize: '14px' }}>
                    {perPage}
                  </span>
                  <ChevronDown
                    className="w-5 h-5 text-[#6A6A6A] transition-transform"
                    style={{ transform: perPageOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {perPageOpen && (
                  <div
                    className="absolute right-0 bg-white rounded-lg overflow-hidden z-10"
                    style={{
                      bottom: '44px',
                      border: '1px solid #D9D9D9',
                      boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.08)',
                      minWidth: '80px',
                    }}
                  >
                    {PER_PAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => changePerPage(opt)}
                        className={`w-full text-left px-3 py-2 font-montserrat hover:bg-gray-50 ${
                          opt === perPage ? 'text-[#0067DE] font-semibold' : 'text-[#0F0F0F] font-medium'
                        }`}
                        style={{ fontSize: '14px' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Prev */}
              <button
                type="button"
                onClick={goPrev}
                disabled={currentPage <= 1}
                className="rounded-lg flex items-center justify-center font-montserrat font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  height: '40px',
                  padding: '8px 16px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#FEFEFE',
                  color: '#0052B0',
                  fontSize: '14px',
                  boxShadow: '0px 0.5px 1px 0px rgba(0,0,0,0.05)',
                }}
              >
                Prev
              </button>

              {/* Page indicator */}
              <span className="font-montserrat font-medium text-[#6A6A6A]" style={{ fontSize: '14px' }}>
                Page {currentPage} of {totalPages}
              </span>

              {/* Next */}
              <button
                type="button"
                onClick={goNext}
                disabled={currentPage >= totalPages}
                className="rounded-lg flex items-center justify-center font-montserrat font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  height: '40px',
                  padding: '8px 16px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#FEFEFE',
                  color: '#0052B0',
                  fontSize: '14px',
                  boxShadow: '0px 0.5px 1px 0px rgba(0,0,0,0.05)',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
