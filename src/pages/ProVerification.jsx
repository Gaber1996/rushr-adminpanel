import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Eye, ChevronDown, Loader2 } from 'lucide-react'
import { useApiResource } from '../hooks/useApiResource'
import { toVerificationDetails } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    {TEXT.nameColumn} <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    {DOC_TYPES.governmentId} <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    {DOC_TYPES.license} <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    {DOC_TYPES.insurance} <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  {TEXT.submittedColumn}
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    {COMMON_TEXT.action} <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.contractorId}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-4 py-4 text-sm text-heading">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="px-4 py-4">
                    <VerificationStatusBadge
                      marker="dot"
                      status={item.stepStatuses?.GOV_ID?.status || 'PENDING'}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <VerificationStatusBadge
                      marker="dot"
                      status={item.stepStatuses?.LICENSE?.status || 'PENDING'}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <VerificationStatusBadge
                      marker="dot"
                      status={item.stepStatuses?.INSURANCE?.status || 'PENDING'}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-muted">{formatDate(item.submittedAt)}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => navigate(toVerificationDetails(item.contractorId))}
                      className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                      {COMMON_TEXT.review}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                    {COMMON_TEXT.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-center gap-4 border-t border-gray-100 px-4 py-4">
            <span className="text-sm text-muted">{COMMON_TEXT.perPage}</span>
            <div
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5"
              style={{ borderColor: '#D9D9D9' }}
            >
              <span className="text-sm">5</span>
              <ChevronDown className="h-4 w-4 text-muted" />
            </div>
            <button
              className="rounded-lg border px-4 py-2 text-sm font-medium"
              style={{ borderColor: '#D9D9D9', color: '#6A6A6A' }}
            >
              {COMMON_TEXT.next}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
