import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Eye } from 'lucide-react'
import { useApiResource } from '../hooks/useApiResource'
import { toVerificationDetails } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import ErrorState from '../components/ui/ErrorState'
import FilterMenu, { FilterLabel, multiSelectOptions } from '../components/ui/FilterMenu'
import { PaginationPlaceholder } from '../components/ui/Pagination'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import VerificationStatusBadge from '../features/verification/VerificationStatusBadge'
import { VERIFICATION_STATUS, stepStatus } from '../features/verification/verificationStatus'
import { matchesSearch } from '../utils/search'
import { DOC_TYPE_TO_STEP } from '../features/verification/documentTypes'
import { COMMON_TEXT, VERIFICATION_TEXT } from '../texts'

const TEXT = VERIFICATION_TEXT.queue
const DOC_TYPES = VERIFICATION_TEXT.docTypes

/** "First Last", skipping a missing part (the API sends null when a name is not set). */
const fullName = (item) => [item.firstName, item.lastName].filter(Boolean).join(' ')

const STEPS = Object.values(DOC_TYPE_TO_STEP)
const FILTER_STATUSES = [
  VERIFICATION_STATUS.PENDING,
  VERIFICATION_STATUS.APPROVED,
  VERIFICATION_STATUS.REJECTED,
  VERIFICATION_STATUS.EXPIRED,
]

export default function ProVerification() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const { data, loading, error } = useApiResource(ENDPOINTS.verificationQueue, {
    errorMessage: TEXT.loadError,
    networkErrorMessage: COMMON_TEXT.networkError,
  })

  const filtered = (data ?? []).filter(
    (item) =>
      matchesSearch(search, [fullName(item)]) &&
      (statusFilter.length === 0 ||
        STEPS.some((step) => statusFilter.includes(stepStatus(item, step))))
  )

  // Cell renderer for one verification step's status chip.
  function stepBadge(step) {
    return function renderStepBadge(item) {
      return <VerificationStatusBadge marker="dot" status={stepStatus(item, step)} />
    }
  }

  const columns = [
    {
      key: 'name',
      minWidth: '160px',
      header: TEXT.nameColumn,
      sortIndicator: true,
      cellClassName: 'text-sm text-heading',
      render: fullName,
    },
    {
      key: 'govId',
      width: '16%',
      minWidth: '140px',
      header: DOC_TYPES.governmentId,
      sortIndicator: true,
      render: stepBadge(DOC_TYPE_TO_STEP.GOVERNMENT_ID),
    },
    {
      key: 'license',
      width: '19.5%',
      minWidth: '170px',
      header: DOC_TYPES.license,
      sortIndicator: true,
      render: stepBadge(DOC_TYPE_TO_STEP.LICENSE),
    },
    {
      key: 'insurance',
      width: '19%',
      minWidth: '170px',
      header: DOC_TYPES.insurance,
      sortIndicator: true,
      render: stepBadge(DOC_TYPE_TO_STEP.INSURANCE),
    },
    {
      key: 'submitted',
      width: '11%',
      minWidth: '110px',
      header: TEXT.submittedColumn,
      cellClassName: 'text-sm text-muted',
      render: (item) => formatDate(item.submittedAt),
    },
    {
      key: 'action',
      width: '10%',
      minWidth: '90px',
      header: COMMON_TEXT.action,
      sortIndicator: true,
      render: (item) => (
        <button
          type="button"
          onClick={() => navigate(toVerificationDetails(item.contractorId))}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          {COMMON_TEXT.review}
        </button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-10">
      {/* Export Report is not wired to the API yet — later. */}
      <PageHeader
        title={TEXT.title}
        subtitle={TEXT.subtitle}
        actions={<Button size="lg">{TEXT.exportReport}</Button>}
      />

      {/* Search & Filter */}
      <div className="flex items-center gap-3 md:gap-6">
        <SearchInput value={search} onChange={setSearch} className="flex-1" />
        <FilterMenu
          renderTrigger={(props) => (
            <Button variant="outlinePrimary" size="field" {...props}>
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              <FilterLabel count={statusFilter.length} />
            </Button>
          )}
          sections={[
            {
              heading: TEXT.filterHeading,
              options: multiSelectOptions(
                FILTER_STATUSES,
                statusFilter,
                setStatusFilter,
                (status) => TEXT.filterStatus[status]
              ),
            },
          ]}
          onClear={() => setStatusFilter([])}
        />
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(item) => item.contractorId}
          loading={loading}
          loadingLabel={TEXT.loading}
          footer={<PaginationPlaceholder />}
        />
      )}
    </div>
  )
}
