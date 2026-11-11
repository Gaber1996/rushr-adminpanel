import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, Clock, Check, ChevronDown, Loader2 } from 'lucide-react'
import emptyFolder from '../assets/empty-folder.png'
import { useApiResource } from '../hooks/useApiResource'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const PER_PAGE_OPTIONS = [10, 20, 50]

// The backend has three resolved statuses (RESOLVED_RELEASED / _REFUNDED / _SPLIT)
// and OPEN. Anything that is not a resolved one reads as "In Review".
function isResolved(status) {
  return typeof status === 'string' && status.startsWith('RESOLVED')
}

function StatusBadge({ status }) {
  if (isResolved(status)) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-lg border px-2 py-2 font-montserrat font-semibold"
        style={{
          backgroundColor: '#EFFFF5',
          borderColor: '#00861D',
          color: '#00861D',
          fontSize: '14px',
        }}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
        Resolved
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-2 rounded-lg border px-2 py-2 font-montserrat font-semibold"
      style={{
        backgroundColor: '#F7F7F7',
        borderColor: '#6A6A6A',
        color: '#6A6A6A',
        fontSize: '14px',
      }}
    >
      <Clock className="h-4 w-4" />
      In Review
    </span>
  )
}

export default function DisputeResolution() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [perPageOpen, setPerPageOpen] = useState(false)

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
  const params = new URLSearchParams({
    page: String(page - 1), // the API is zero-based
    size: String(perPage),
  })
  if (debouncedSearch) params.set('search', debouncedSearch)

  const { data, loading, error, reload } = useApiResource(`/api/admin/disputes/paged?${params}`, {
    errorMessage: 'Could not load disputes.',
  })
  const rows = data?.content ?? []
  const totalPages = Math.max(1, data?.totalPages ?? 1)

  const currentPage = Math.min(page, totalPages)
  const pageRows = rows

  function changePerPage(value) {
    setPerPage(value)
    setPage(1)
    setPerPageOpen(false)
  }

  function goPrev() {
    if (currentPage > 1) setPage(currentPage - 1)
  }

  function goNext() {
    if (currentPage < totalPages) setPage(currentPage + 1)
  }

  // The empty state stands in for the whole screen, but only when there are genuinely no
  // disputes — a search that matches nothing keeps the table and its search box.
  if (!loading && !error && rows.length === 0 && !debouncedSearch) {
    return (
      <div className="flex h-full flex-col">
        <h1
          className="font-montserrat font-extrabold text-[#0F0F0F]"
          style={{ fontSize: '40px', lineHeight: '40px' }}
        >
          Dispute Resolution
        </h1>
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <img
            src={emptyFolder}
            alt="No disputes"
            className="object-contain"
            style={{ width: '390px', height: '390px' }}
          />
          <p
            className="text-center font-montserrat font-semibold text-[#0F0F0F]"
            style={{ fontSize: '24px', lineHeight: '24px' }}
          >
            There is no <span className="font-semibold">Dispute Resolution</span> yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <h1
        className="font-montserrat font-extrabold text-[#0F0F0F]"
        style={{ fontSize: '40px', lineHeight: '40px' }}
      >
        Dispute Resolution
      </h1>

      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-xl px-3"
        style={{
          height: '56px',
          backgroundColor: '#FEFEFE',
          boxShadow: '0px 0px 0px 1px #E5E5E5, 0px 1px 3px 0px rgba(0,0,0,0.06)',
        }}
      >
        <Search className="h-6 w-6 text-[#6A6A6A]" />
        <input
          type="text"
          placeholder="Search by dispute ID, customer or pro name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent font-montserrat text-sm text-[#0F0F0F] outline-none placeholder:text-[#6A6A6A]"
        />
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl bg-white"
        style={{ boxShadow: '0px 0px 0px 1px #ECECEE, 0px 1px 3px 0px rgba(0,0,0,0.06)' }}
      >
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '120px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '150px' }} />
            <col />
            <col style={{ width: '150px' }} />
            <col style={{ width: '130px' }} />
          </colgroup>
          <thead>
            <tr>
              {[
                'Dispute ID',
                'Customer Name',
                'Pro Name',
                'Service',
                'Reason',
                'Status',
                'Action',
              ].map((label) => (
                <th
                  key={label}
                  className="text-center font-montserrat font-medium text-[#0F0F0F]"
                  style={{
                    height: '48px',
                    backgroundColor: '#FAFAFA',
                    borderBottom: '1px solid #D9D9D9',
                    fontSize: '16px',
                    padding: '0 16px',
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading &&
              !error &&
              pageRows.map((d, idx) => {
                const zebra = idx % 2 === 1 ? '#FAFAFA' : '#FEFEFE'
                return (
                  <tr key={d.id}>
                    <td
                      className="text-center font-montserrat font-semibold text-[#0F0F0F]"
                      style={{
                        height: '56px',
                        backgroundColor: zebra,
                        borderBottom: '1px solid #D9D9D9',
                        fontSize: '14px',
                        padding: '0 16px',
                      }}
                    >
                      {d.caseId}
                    </td>
                    <td
                      className="text-center font-montserrat font-semibold text-[#0F0F0F]"
                      style={{
                        height: '56px',
                        backgroundColor: zebra,
                        borderBottom: '1px solid #D9D9D9',
                        fontSize: '14px',
                        padding: '0 16px',
                      }}
                    >
                      {d.consumerName}
                    </td>
                    <td
                      className="text-center font-montserrat font-semibold text-[#0F0F0F]"
                      style={{
                        height: '56px',
                        backgroundColor: zebra,
                        borderBottom: '1px solid #D9D9D9',
                        fontSize: '14px',
                        padding: '0 16px',
                      }}
                    >
                      {/* Null when a dispute was raised before any pro was assigned. */}
                      {d.contractorName || '—'}
                    </td>
                    <td
                      className="text-center font-montserrat font-semibold text-[#0F0F0F]"
                      style={{
                        height: '56px',
                        backgroundColor: zebra,
                        borderBottom: '1px solid #D9D9D9',
                        fontSize: '14px',
                        padding: '0 16px',
                      }}
                    >
                      {d.categoryName || '—'}
                    </td>
                    <td
                      className="font-montserrat font-semibold text-[#0F0F0F]"
                      style={{
                        height: '56px',
                        backgroundColor: zebra,
                        borderBottom: '1px solid #D9D9D9',
                        fontSize: '12px',
                        padding: '8px',
                        lineHeight: '1.5',
                      }}
                    >
                      {d.reason}
                    </td>
                    <td
                      style={{
                        height: '56px',
                        backgroundColor: zebra,
                        borderBottom: '1px solid #D9D9D9',
                        padding: '0 16px',
                        textAlign: 'center',
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <StatusBadge status={d.status} />
                      </div>
                    </td>
                    <td
                      style={{
                        height: '56px',
                        backgroundColor: zebra,
                        borderBottom: '1px solid #D9D9D9',
                        padding: '0 16px',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        onClick={() => navigate(`/dispute-resolution/${d.id}`)}
                        className="inline-flex items-center gap-2 font-montserrat font-semibold text-[#0F0F0F] transition-colors hover:text-[#0067DE]"
                        style={{ fontSize: '14px' }}
                      >
                        <Eye className="h-6 w-6" />
                        Review
                      </button>
                    </td>
                  </tr>
                )
              })}
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10"
                  style={{ borderBottom: '1px solid #D9D9D9' }}
                >
                  <div className="flex items-center justify-center gap-2 font-montserrat text-sm text-[#6A6A6A]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading disputes…
                  </div>
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10"
                  style={{ borderBottom: '1px solid #D9D9D9' }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <p className="font-montserrat text-sm text-[#C20A0A]">{error}</p>
                    <button
                      type="button"
                      onClick={reload}
                      className="rounded-lg px-4 py-2 font-montserrat font-semibold transition-colors hover:bg-[#ECF5FF]"
                      style={{ border: '1px solid #0067DE', color: '#0052B0', fontSize: '14px' }}
                    >
                      Try again
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {!loading && !error && pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
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
            className="relative flex items-center overflow-visible rounded-lg"
            style={{
              height: '40px',
              border: '1px solid #D9D9D9',
              boxShadow: '0px 0.5px 2px 0px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                height: '100%',
                padding: '8px 13px 8px 12px',
                borderRight: '1px solid #D9D9D9',
              }}
            >
              <span
                className="font-montserrat font-semibold text-[#6A6A6A]"
                style={{ fontSize: '14px' }}
              >
                Per page
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPerPageOpen((v) => !v)}
              className="flex items-center justify-center gap-1"
              style={{ height: '100%', padding: '8px 13px 8px 12px' }}
            >
              <span
                className="font-montserrat font-medium text-[#0F0F0F]"
                style={{ fontSize: '14px' }}
              >
                {perPage}
              </span>
              <ChevronDown
                className="h-5 w-5 text-[#6A6A6A] transition-transform"
                style={{ transform: perPageOpen ? 'rotate(180deg)' : 'none' }}
              />
            </button>

            {perPageOpen && (
              <div
                className="absolute right-0 z-10 overflow-hidden rounded-lg bg-white"
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
                    className={`w-full px-3 py-2 text-left font-montserrat hover:bg-gray-50 ${
                      opt === perPage
                        ? 'font-semibold text-[#0067DE]'
                        : 'font-medium text-[#0F0F0F]'
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
            className="flex items-center justify-center rounded-lg font-montserrat font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
            className="flex items-center justify-center rounded-lg font-montserrat font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
  )
}
