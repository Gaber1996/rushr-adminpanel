import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Eye, ChevronDown, Loader2 } from 'lucide-react'
import { apiRequest } from '../config/api'

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
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-montserrat font-medium"
      style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      <span
        className="w-3 h-3 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: style.dot, fontSize: '8px' }}
      >
        {status === 'APPROVED' ? '✓' : status === 'REJECTED' || status === 'EXPIRED' ? '✕' : '◷'}
      </span>
      {style.label}
    </span>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProVerification() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVerificationQueue()
  }, [])

  async function fetchVerificationQueue() {
    setLoading(true)
    setError('')
    try {
      const res = await apiRequest('/api/admin/verification-queue')
      if (res.success) {
        setData(res.data)
      } else {
        setError(res.message || 'Failed to load verification data.')
      }
    } catch (err) {
      setError('Unable to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = data.filter((item) => {
    const name = `${item.firstName} ${item.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="font-montserrat font-extrabold text-[#202020]" style={{ fontSize: '40px', lineHeight: '40px' }}>
            Pro Verification
          </h1>
          <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '24px', lineHeight: '24px' }}>
            Review and approve pro verification documents.
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-xl font-montserrat font-extrabold text-white"
          style={{ backgroundColor: '#0067DE', height: '56px', padding: '8px 32px', fontSize: '18px' }}
        >
          Export Report
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-6">
        <div
          className="flex-1 flex items-center gap-2 rounded-xl border px-3"
          style={{ borderColor: '#D9D9D9', height: '56px', backgroundColor: '#FEFEFE' }}
        >
          <Search className="w-6 h-6 text-[#6A6A6A]" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A]"
          />
        </div>
        <button
          className="flex items-center gap-2 rounded-xl border px-4 font-montserrat font-semibold"
          style={{ borderColor: '#D9D9D9', height: '56px', fontSize: '16px', color: '#0067DE' }}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#0067DE]" />
        </div>
      ) : error ? (
        <div className="px-4 py-3 rounded-xl text-sm font-montserrat font-medium" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                  <span className="flex items-center gap-1">Name <ChevronDown className="w-4 h-4" /></span>
                </th>
                <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                  <span className="flex items-center gap-1">Government ID <ChevronDown className="w-4 h-4" /></span>
                </th>
                <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                  <span className="flex items-center gap-1">Professional License <ChevronDown className="w-4 h-4" /></span>
                </th>
                <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                  <span className="flex items-center gap-1">Business Insurance <ChevronDown className="w-4 h-4" /></span>
                </th>
                <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                  Submitted
                </th>
                <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                  <span className="flex items-center gap-1">Action <ChevronDown className="w-4 h-4" /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.contractorId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 font-montserrat text-sm text-[#202020]">
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
                  <td className="px-4 py-4 font-montserrat text-sm text-[#6A6A6A]">
                    {formatDate(item.submittedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => navigate(`/pro-verification/${item.contractorId}`)}
                      className="flex items-center gap-1.5 font-montserrat text-sm text-[#6A6A6A] hover:text-[#0067DE] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center font-montserrat text-sm text-[#6A6A6A]">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-center gap-4 px-4 py-4 border-t border-gray-100">
            <span className="font-montserrat text-sm text-[#6A6A6A]">Per page</span>
            <div className="flex items-center gap-1 border rounded-lg px-3 py-1.5" style={{ borderColor: '#D9D9D9' }}>
              <span className="font-montserrat text-sm">5</span>
              <ChevronDown className="w-4 h-4 text-[#6A6A6A]" />
            </div>
            <button
              className="px-4 py-2 rounded-lg border font-montserrat text-sm font-medium"
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
