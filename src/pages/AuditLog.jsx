import { useState, useMemo } from 'react'
import { SlidersHorizontal, Circle, Check } from 'lucide-react'
import { AUDIT_LOGS, AUDIT_MODULES } from '../data/auditLogs'
import DataTable from '../components/ui/DataTable'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import { useClientPagination } from '../hooks/useClientPagination'
import SearchInput from '../components/ui/SearchInput'
import { AUDIT_LOG_TEXT, COMMON_TEXT } from '../texts'

const TEXT = AUDIT_LOG_TEXT

const PER_PAGE_OPTIONS = [5, 10, 20, 50]

const HIGH_IMPACT_BG = '#FFF7F7'
const HIGH_IMPACT_BORDER = '#C20A0A'

const COLUMNS = [
  { key: 'timestamp', header: TEXT.columns.timestamp, width: '153px' },
  { key: 'actor', header: TEXT.columns.actor, width: '164px' },
  { key: 'module', header: TEXT.columns.module, width: '198px' },
  {
    key: 'action',
    header: TEXT.columns.action,
    cellClassName: (log) =>
      `px-4 text-center text-[14px] font-medium leading-[1.4] ${log.highImpact ? 'text-danger' : 'text-ink'}`,
  },
  {
    key: 'reason',
    header: COMMON_TEXT.reason,
    width: '311px',
    cellClassName: 'px-4 py-2 text-center text-[12px] font-medium leading-[1.4] text-ink',
  },
]

function Legend() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-xl border p-2"
      style={{ backgroundColor: HIGH_IMPACT_BG, borderColor: HIGH_IMPACT_BORDER }}
    >
      <Circle className="h-5 w-5 shrink-0" style={{ color: HIGH_IMPACT_BORDER }} />
      <span className="font-medium text-ink" style={{ fontSize: '16px', lineHeight: '16px' }}>
        {TEXT.legend}
      </span>
    </div>
  )
}

export default function AuditLog() {
  const [search, setSearch] = useState('')
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

  const { page, totalPages, perPage, pageItems, setPage, setPerPage, resetPage } =
    useClientPagination(filtered, 10)
  const activeFilterCount = moduleFilter.length + (highImpactOnly ? 1 : 0)

  function toggleModule(name) {
    setModuleFilter((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    )
    resetPage()
  }

  function clearFilters() {
    setModuleFilter([])
    setHighImpactOnly(false)
    resetPage()
  }

  const columns = COLUMNS.map((col) => ({ ...col, render: (log) => log[col.key] }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={TEXT.title}
        titleTone="ink"
        textGapClassName="gap-3"
        subtitle={TEXT.subtitle}
      />

      <div className="flex flex-col gap-4">
        <Legend />

        <div className="flex flex-col gap-8">
          {/* Search + Filter */}
          <div className="flex items-center gap-6">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value)
                resetPage()
              }}
              appearance="elevated"
              className="flex-1"
            />

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center justify-center gap-2 rounded-xl border transition-colors hover:bg-primary-soft"
                style={{ height: '56px', width: '157px', borderColor: '#0067DE' }}
              >
                <SlidersHorizontal className="h-6 w-6" style={{ color: '#0052B0' }} />
                <span className="font-bold" style={{ fontSize: '18px', color: '#0052B0' }}>
                  {TEXT.filterLabel(activeFilterCount)}
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
                  <span className="px-1 font-semibold text-muted" style={{ fontSize: '12px' }}>
                    {TEXT.moduleHeading}
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
                          className={`${checked ? 'font-semibold text-primary' : 'font-medium text-ink'}`}
                          style={{ fontSize: '14px' }}
                        >
                          {name}
                        </span>
                        {checked && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setHighImpactOnly((v) => !v)
                      resetPage()
                    }}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                    style={{ borderTop: '1px solid #D9D9D9' }}
                  >
                    <span
                      className={`${highImpactOnly ? 'font-semibold' : 'font-medium'}`}
                      style={{ fontSize: '14px', color: HIGH_IMPACT_BORDER }}
                    >
                      {TEXT.highImpactOnly}
                    </span>
                    {highImpactOnly && (
                      <Check
                        className="h-4 w-4"
                        style={{ color: HIGH_IMPACT_BORDER }}
                        strokeWidth={3}
                      />
                    )}
                  </button>

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-lg px-2 py-2 text-left font-semibold text-muted hover:bg-gray-50"
                      style={{ fontSize: '14px' }}
                    >
                      {TEXT.clearAll}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <DataTable
            variant="grid"
            columns={columns}
            rows={pageItems}
            rowKey={(log) => log.id}
            cellClassName="px-4 text-center text-[14px] font-medium text-ink"
            isHighlighted={(log) => log.highImpact}
            footer={
              <Pagination
                page={page}
                totalPages={totalPages}
                perPage={perPage}
                perPageOptions={PER_PAGE_OPTIONS}
                onPageChange={setPage}
                onPerPageChange={setPerPage}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}
