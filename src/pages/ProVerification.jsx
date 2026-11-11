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
import { PaginationPlaceholder } from '../components/ui/Pagination'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import VerificationStatusBadge from '../features/verification/VerificationStatusBadge'
import { COMMON_TEXT, VERIFICATION_TEXT } from '../texts'

const TEXT = VERIFICATION_TEXT.queue
const DOC_TYPES = VERIFICATION_TEXT.docTypes

export default function ProVerification() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data, loading, error } = useApiResource(ENDPOINTS.verificationQueue, {
    errorMessage: TEXT.loadError,
    networkErrorMessage: COMMON_TEXT.networkError,
  })

  const filtered = (data ?? []).filter((item) => {
    const name = `${item.firstName} ${item.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  // Cell renderer for one verification step's status chip.
  function stepBadge(step) {
    return function renderStepBadge(item) {
      return (
        <VerificationStatusBadge
          marker="dot"
          status={item.stepStatuses?.[step]?.status || 'PENDING'}
        />
      )
    }
  }

  const columns = [
    {
      key: 'name',
      header: TEXT.nameColumn,
      sortIndicator: true,
      cellClassName: 'text-sm text-heading',
      render: (item) => `${item.firstName} ${item.lastName}`,
    },
    {
      key: 'govId',
      header: DOC_TYPES.governmentId,
      sortIndicator: true,
      render: stepBadge('GOV_ID'),
    },
    {
      key: 'license',
      header: DOC_TYPES.license,
      sortIndicator: true,
      render: stepBadge('LICENSE'),
    },
    {
      key: 'insurance',
      header: DOC_TYPES.insurance,
      sortIndicator: true,
      render: stepBadge('INSURANCE'),
    },
    {
      key: 'submitted',
      header: TEXT.submittedColumn,
      cellClassName: 'text-sm text-muted',
      render: (item) => formatDate(item.submittedAt),
    },
    {
      key: 'action',
      header: COMMON_TEXT.action,
      sortIndicator: true,
      cardLabel: null,
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
      {/* Export Report and Filter are not wired to the API yet — later. */}
      <PageHeader
        title={TEXT.title}
        subtitle={TEXT.subtitle}
        actions={<Button size="lg">{TEXT.exportReport}</Button>}
      />

      {/* Search & Filter */}
      <div className="flex items-center gap-3 md:gap-6">
        <SearchInput value={search} onChange={setSearch} className="flex-1" />
        <Button variant="outlinePrimary" size="field">
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          {COMMON_TEXT.filter}
        </Button>
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
