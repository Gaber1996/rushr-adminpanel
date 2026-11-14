import { useState, useMemo } from 'react'
import { SlidersHorizontal, Circle } from 'lucide-react'
import { AUDIT_LOGS, AUDIT_MODULES } from '../data/auditLogs'
import DataTable from '../components/ui/DataTable'
import FilterMenu, { FilterLabel, multiSelectOptions } from '../components/ui/FilterMenu'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import { useClientPagination } from '../hooks/useClientPagination'
import { matchesSearch } from '../utils/search'
import SearchInput from '../components/ui/SearchInput'
import { AUDIT_LOG_TEXT, COMMON_TEXT } from '../texts'

const TEXT = AUDIT_LOG_TEXT

const PER_PAGE_OPTIONS = [5, 10, 20, 50]

const HIGH_IMPACT_BG = '#FFF7F7'
const HIGH_IMPACT_BORDER = '#C20A0A'

const COLUMNS = [
  {
    key: 'timestamp',
    width: '14.6%',
    minWidth: '120px',
    header: TEXT.columns.timestamp,
  },
  { key: 'actor', width: '15.7%', minWidth: '120px', header: TEXT.columns.actor },
  { key: 'module', width: '18.9%', minWidth: '140px', header: TEXT.columns.module },
  {
    key: 'action',
    minWidth: '150px',
    header: TEXT.columns.action,
    cellClassName: (log) =>
      `px-4 text-center text-[14px] font-medium leading-[1.4] ${log.highImpact ? 'text-danger' : 'text-ink'}`,
  },
  {
    key: 'reason',
    width: '29.8%',
    minWidth: '220px',
    header: COMMON_TEXT.reason,
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
  const [moduleFilter, setModuleFilter] = useState([])
  const [highImpactOnly, setHighImpactOnly] = useState(false)

  const filtered = useMemo(() => {
    return AUDIT_LOGS.filter((log) => {
      if (highImpactOnly && !log.highImpact) return false
      if (moduleFilter.length > 0 && !moduleFilter.includes(log.module)) return false
      return matchesSearch(search, [log.timestamp, log.actor, log.module, log.action, log.reason])
    })
  }, [search, moduleFilter, highImpactOnly])

  const { page, totalPages, perPage, pageItems, setPage, setPerPage, resetPage } =
    useClientPagination(filtered, 10)
  const activeFilterCount = moduleFilter.length + (highImpactOnly ? 1 : 0)

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
          <div className="flex items-center gap-3 md:gap-6">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value)
                resetPage()
              }}
              appearance="elevated"
              className="flex-1"
            />

            <FilterMenu
              renderTrigger={(props) => (
                <Button variant="secondary" size="fieldLarge" {...props}>
                  <SlidersHorizontal className="h-6 w-6" aria-hidden="true" />
                  <FilterLabel count={activeFilterCount} />
                </Button>
              )}
              sections={[
                {
                  heading: TEXT.moduleHeading,
                  options: [
                    ...multiSelectOptions(AUDIT_MODULES, moduleFilter, (update) => {
                      setModuleFilter(update)
                      resetPage()
                    }),
                    {
                      key: 'high-impact',
                      label: TEXT.highImpactOnly,
                      checked: highImpactOnly,
                      tone: 'danger',
                      separated: true,
                      onToggle: () => {
                        setHighImpactOnly((v) => !v)
                        resetPage()
                      },
                    },
                  ],
                },
              ]}
              onClear={clearFilters}
            />
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
