import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Eye, ChevronDown, Loader2 } from 'lucide-react'
import { useApiResource } from '../hooks/useApiResource'
import { toVerificationDetails } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'

const STATUS_STYLES = {
  APPROVED: {
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
    dot: '#059669',
    label: 'Approved',
  },
  REJECTED: {
    bg: '#FEF2F2',
    text: '#DC2626',
    border: '#FECACA',
    dot: '#DC2626',
    label: 'Rejected',
  },
  EXPIRED: {
    bg: '#FEF2F2',
    text: '#DC2626',
    border: '#FECACA',
    dot: '#DC2626',
    label: 'Expired',
  },
  PENDING: {
    bg: '#F9FAFB',
    text: '#6B7280',
    border: '#E5E7EB',
    dot: '#6B7280',
    label: 'pending',
  },
  SUBMITTED: {
    bg: '#F9FAFB',
    text: '#6B7280',
    border: '#E5E7EB',
    dot: '#6B7280',
    label: 'pending',
  },
}

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.PENDING
}

function StatusBadge({ status }) {
  const style = getStatusStyle(status)
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      <span
        className="flex h-3 w-3 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: style.dot, fontSize: '8px' }}
      >
        {status === 'APPROVED' ? '✓' : status === 'REJECTED' || status === 'EXPIRED' ? '✕' : '◷'}
      </span>
      {style.label}
    </span>
  )
}

export default function ProVerification() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data, loading, error } = useApiResource(ENDPOINTS.verificationQueue, {
    errorMessage: 'Failed to load verification data.',
    networkErrorMessage: 'Unable to connect to server.',
  })

  const filtered = (data ?? []).filter((item) => {
    const name = `${item.firstName} ${item.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <h1
            className="font-extrabold text-heading"
            style={{ fontSize: '40px', lineHeight: '40px' }}
          >
            Pro Verification
          </h1>
          <p className="font-semibold text-muted" style={{ fontSize: '24px', lineHeight: '24px' }}>
            Review and approve pro verification documents.
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-xl font-extrabold text-white"
          style={{
            backgroundColor: '#0067DE',
            height: '56px',
            padding: '8px 32px',
            fontSize: '18px',
          }}
        >
          Export Report
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-6">
        <div
          className="flex flex-1 items-center gap-2 rounded-xl border px-3"
          style={{ borderColor: '#D9D9D9', height: '56px', backgroundColor: '#FEFEFE' }}
        >
          <Search className="h-6 w-6 text-muted" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </div>
        <button
          className="flex items-center gap-2 rounded-xl border px-4 font-semibold"
          style={{ borderColor: '#D9D9D9', height: '56px', fontSize: '16px', color: '#0067DE' }}
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filter
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div
          className="rounded-xl px-4 py-3 text-sm font-medium"
          style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
        >
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    Name <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    Government ID <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    Professional License <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    Business Insurance <ChevronDown className="h-4 w-4" />
                  </span>
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">Submitted</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                  <span className="flex items-center gap-1">
                    Action <ChevronDown className="h-4 w-4" />
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
                    <StatusBadge status={item.stepStatuses?.GOV_ID?.status || 'PENDING'} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={item.stepStatuses?.LICENSE?.status || 'PENDING'} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={item.stepStatuses?.INSURANCE?.status || 'PENDING'} />
                  </td>
                  <td className="px-4 py-4 text-sm text-muted">{formatDate(item.submittedAt)}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => navigate(toVerificationDetails(item.contractorId))}
                      className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-center gap-4 border-t border-gray-100 px-4 py-4">
            <span className="text-sm text-muted">Per page</span>
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
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
