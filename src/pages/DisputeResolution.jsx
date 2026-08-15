import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, Clock, Check, ChevronDown } from 'lucide-react'
import emptyFolder from '../assets/empty-folder.png'
import { useDisputes } from '../context/DisputesContext'

const PER_PAGE_OPTIONS = [10, 20, 50]

function StatusBadge({ status }) {
  if (status === 'RESOLVED') {
    return (
      <span
        className="inline-flex items-center gap-2 px-2 py-2 rounded-lg border font-montserrat font-semibold"
        style={{ backgroundColor: '#EFFFF5', borderColor: '#00861D', color: '#00861D', fontSize: '14px' }}
      >
        <Check className="w-4 h-4" strokeWidth={3} />
        Resolved
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-2 px-2 py-2 rounded-lg border font-montserrat font-semibold"
      style={{ backgroundColor: '#F7F7F7', borderColor: '#6A6A6A', color: '#6A6A6A', fontSize: '14px' }}
    >
      <Clock className="w-4 h-4" />
      In Review
    </span>
  )
}

export default function DisputeResolution() {
  const navigate = useNavigate()
  const { disputes } = useDisputes()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [perPageOpen, setPerPageOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return disputes
    return disputes.filter((d) =>
      d.id.toLowerCase().includes(q) ||
      d.customer.toLowerCase().includes(q) ||
      d.pro.toLowerCase().includes(q) ||
      d.service.toLowerCase().includes(q) ||
      d.reason.toLowerCase().includes(q)
    )
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * perPage
  const pageRows = filtered.slice(startIndex, startIndex + perPage)

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

  if (disputes.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <h1
          className="font-montserrat font-extrabold text-[#0F0F0F]"
          style={{ fontSize: '40px', lineHeight: '40px' }}
        >
          Dispute Resolution
        </h1>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <img src={emptyFolder} alt="No disputes" className="object-contain" style={{ width: '390px', height: '390px' }} />
          <p
            className="font-montserrat font-semibold text-[#0F0F0F] text-center"
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

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden bg-white"
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
              {['Dispute ID', 'Customer Name', 'Pro Name', 'Service', 'Reason', 'Status', 'Action'].map((label) => (
                <th
                  key={label}
                  className="font-montserrat font-medium text-[#0F0F0F] text-center"
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
            {pageRows.map((d, idx) => {
              const zebra = idx % 2 === 1 ? '#FAFAFA' : '#FEFEFE'
              return (
                <tr key={d.id + '-' + idx}>
                  <td
                    className="font-montserrat font-semibold text-[#0F0F0F] text-center"
                    style={{ height: '56px', backgroundColor: zebra, borderBottom: '1px solid #D9D9D9', fontSize: '14px', padding: '0 16px' }}
                  >
                    {d.id}
                  </td>
                  <td
                    className="font-montserrat font-semibold text-[#0F0F0F] text-center"
                    style={{ height: '56px', backgroundColor: zebra, borderBottom: '1px solid #D9D9D9', fontSize: '14px', padding: '0 16px' }}
                  >
                    {d.customer}
                  </td>
                  <td
                    className="font-montserrat font-semibold text-[#0F0F0F] text-center"
                    style={{ height: '56px', backgroundColor: zebra, borderBottom: '1px solid #D9D9D9', fontSize: '14px', padding: '0 16px' }}
                  >
                    {d.pro}
                  </td>
                  <td
                    className="font-montserrat font-semibold text-[#0F0F0F] text-center"
                    style={{ height: '56px', backgroundColor: zebra, borderBottom: '1px solid #D9D9D9', fontSize: '14px', padding: '0 16px' }}
                  >
                    {d.service}
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
                    style={{ height: '56px', backgroundColor: zebra, borderBottom: '1px solid #D9D9D9', padding: '0 16px', textAlign: 'center' }}
                  >
                    <div className="flex items-center justify-center">
                      <StatusBadge status={d.status} />
                    </div>
                  </td>
                  <td
                    style={{ height: '56px', backgroundColor: zebra, borderBottom: '1px solid #D9D9D9', padding: '0 16px', textAlign: 'center' }}
                  >
                    <button
                      onClick={() => navigate(`/dispute-resolution/${d.id}`)}
                      className="inline-flex items-center gap-2 font-montserrat font-semibold text-[#0F0F0F] hover:text-[#0067DE] transition-colors"
                      style={{ fontSize: '14px' }}
                    >
                      <Eye className="w-6 h-6" />
                      Review
                    </button>
                  </td>
                </tr>
              )
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center font-montserrat text-sm text-[#6A6A6A]" style={{ borderBottom: '1px solid #D9D9D9' }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center justify-center gap-4" style={{ height: '60px', padding: '0 16px', backgroundColor: '#FEFEFE' }}>
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
  )
}
