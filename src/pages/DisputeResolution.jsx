import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import emptyFolder from '../assets/empty-folder.png'
import { useApiResource } from '../hooks/useApiResource'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { toDisputeDetails } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import DataTable from '../components/ui/DataTable'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import DisputeStatusBadge from '../features/disputes/DisputeStatusBadge'
import { COMMON_TEXT, DISPUTES_TEXT } from '../texts'

const TEXT = DISPUTES_TEXT.list

const PER_PAGE_OPTIONS = [10, 20, 50]

export default function DisputeResolution() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Debounced so a request goes out per pause, not per keystroke. The server owns both the
  // paging and the search, so a new term starts again at page 1.
  const debouncedSearch = useDebouncedValue(search.trim())
  const [lastSearch, setLastSearch] = useState(debouncedSearch)
  if (lastSearch !== debouncedSearch) {
    setLastSearch(debouncedSearch)
    setPage(1)
  }

  // One page of disputes at a time — Next/Prev and the per-page dropdown each refetch
  // rather than re-slicing a local list.
  const { data, loading, error, reload } = useApiResource(
    ENDPOINTS.disputesPage({ page, size: perPage, search: debouncedSearch }),
    { errorMessage: TEXT.loadError }
  )
  const rows = data?.content ?? []
  const totalPages = Math.max(1, data?.totalPages ?? 1)

  const currentPage = Math.min(page, totalPages)

  const columns = [
    {
      key: 'caseId',
      width: '11.3%',
      minWidth: '90px',
      header: TEXT.columns.disputeId,
      render: (d) => d.caseId,
    },
    {
      key: 'customer',
      width: '14.2%',
      minWidth: '110px',
      header: TEXT.columns.customerName,
      render: (d) => d.consumerName,
    },
    {
      key: 'pro',
      width: '14.2%',
      minWidth: '110px',
      header: TEXT.columns.proName,
      // Null when a dispute was raised before any pro was assigned.
      render: (d) => d.contractorName || COMMON_TEXT.emptyValue,
    },
    {
      key: 'service',
      width: '14.2%',
      minWidth: '110px',
      header: TEXT.columns.service,
      render: (d) => d.categoryName || COMMON_TEXT.emptyValue,
    },
    {
      key: 'reason',
      minWidth: '140px',
      header: COMMON_TEXT.reason,
      cellClassName: 'p-2 text-[12px] font-semibold leading-normal text-ink',
      render: (d) => d.reason,
    },
    {
      key: 'status',
      width: '14.2%',
      minWidth: '120px',
      header: TEXT.columns.status,
      cellClassName: 'px-4 text-center',
      render: (d) => (
        <div className="flex items-center justify-center">
          <DisputeStatusBadge status={d.status} />
        </div>
      ),
    },
    {
      key: 'action',
      width: '12.3%',
      minWidth: '100px',
      header: COMMON_TEXT.action,
      cellClassName: 'px-4 text-center',
      render: (d) => (
        <button
          type="button"
          onClick={() => navigate(toDisputeDetails(d.id))}
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink transition-colors hover:text-primary"
        >
          <Eye className="h-6 w-6" aria-hidden="true" />
          {COMMON_TEXT.review}
        </button>
      ),
    },
  ]

  // The empty state stands in for the whole screen, but only when there are genuinely no
  // disputes — a search that matches nothing keeps the table and its search box.
  if (!loading && !error && rows.length === 0 && !debouncedSearch) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title={TEXT.title} titleTone="ink" />
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <img
            src={emptyFolder}
            alt={TEXT.emptyAlt}
            className="aspect-square w-full max-w-[390px] object-contain"
          />
          <p
            className="text-center font-semibold text-ink"
            style={{ fontSize: '24px', lineHeight: '24px' }}
          >
            {TEXT.emptyBefore}
            <span className="font-semibold">{TEXT.emptyHighlight}</span>
            {TEXT.emptyAfter}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={TEXT.title} titleTone="ink" />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={TEXT.searchPlaceholder}
        appearance="elevated"
      />

      <DataTable
        variant="grid"
        columns={columns}
        rows={rows}
        rowKey={(d) => d.id}
        loading={loading}
        loadingLabel={TEXT.loading}
        error={error}
        onRetry={reload}
        footer={
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            perPageOptions={PER_PAGE_OPTIONS}
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value)
              setPage(1)
            }}
          />
        }
      />
    </div>
  )
}
