import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Loader2, CheckCircle2, XCircle, Clock, ArrowLeft, X } from 'lucide-react'
import { apiRequest, BASE_URL } from '../config/api'

const DOC_TYPE_LABELS = {
  GOVERNMENT_ID: 'Government ID',
  LICENSE: 'Professional License',
  INSURANCE: 'Business Insurance',
}

// Map document types to verification step enum values
const DOC_TYPE_TO_STEP = {
  GOVERNMENT_ID: 'GOV_ID',
  LICENSE: 'LICENSE',
  INSURANCE: 'INSURANCE',
}

const STATUS_CONFIG = {
  APPROVED: {
    bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', label: 'Approved',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  REJECTED: {
    bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', label: 'Rejected',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  EXPIRED: {
    bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', label: 'Expired',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  PENDING: {
    bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB', label: 'pending',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  SUBMITTED: {
    bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB', label: 'pending',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
}

function getStatus(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function DocImage({ src, alt }) {
  const [objectUrl, setObjectUrl] = useState(null)
  const [hasError, setHasError] = useState(false)

  // /api/files rejects requests without the admin token, and an <img src> can't send one,
  // so the file is downloaded with the token and shown from a local object URL.
  useEffect(() => {
    let cancelled = false
    let url = null
    fetch(src, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((res) => {
        if (!res.ok) throw new Error(`File request failed (${res.status})`)
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setObjectUrl(url)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [src])

  return (
    <div className="flex-1 flex items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
      {hasError ? (
        <div className="flex flex-col items-center gap-2 text-gray-400 p-8">
          <FileText className="w-12 h-12" strokeWidth={1.5} />
          <span className="font-montserrat text-sm">Unable to load document</span>
        </div>
      ) : !objectUrl ? (
        <Loader2 className="w-8 h-8 animate-spin text-[#0067DE]" />
      ) : (
        <img
          src={objectUrl}
          alt={alt}
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  )
}

function ActionModal({ isOpen, action, docLabel, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  if (!isOpen) return null

  const isApprove = action === 'approve'
  const title = isApprove ? 'Approve Document' : 'Reject Document'
  const accentColor = isApprove ? '#0067DE' : '#DC2626'

  function handleSubmit(e) {
    e.preventDefault()
    if (!reason.trim()) return
    onSubmit({ reason: reason.trim(), adminNotes: adminNotes.trim() || null })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-[480px] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 className="font-montserrat font-bold text-lg text-[#202020]">{title}</h3>
          <button onClick={onClose} className="text-[#6A6A6A] hover:text-[#202020] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-5">
          <p className="font-montserrat text-sm text-[#6A6A6A]">
            {isApprove ? 'Approving' : 'Rejecting'} <strong className="text-[#202020]">{docLabel}</strong>
          </p>

          {/* Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat font-medium text-sm text-[#0F0F0F]">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isApprove ? 'e.g. Document is clear and valid' : 'e.g. Document is blurry or expired'}
              rows={3}
              className="w-full rounded-xl border px-3 py-3 outline-none font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A] resize-none focus:border-blue-400 transition-colors"
              style={{ borderColor: '#D9D9D9' }}
            />
          </div>

          {/* Admin Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat font-medium text-sm text-[#0F0F0F]">
              Admin Notes <span className="text-[#6A6A6A]">(optional)</span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Additional notes for internal reference"
              rows={2}
              className="w-full rounded-xl border px-3 py-3 outline-none font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A] resize-none focus:border-blue-400 transition-colors"
              style={{ borderColor: '#D9D9D9' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border font-montserrat font-semibold text-sm text-[#6A6A6A] hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#D9D9D9' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || loading}
              className="flex-1 h-12 rounded-xl font-montserrat font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isApprove ? 'Approve' : 'Reject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ApproveRejectButtons({ selectedDoc, actionLoading, onApprove, onReject }) {
  const status = selectedDoc?.verificationStatus
  const isApproved = status === 'APPROVED'
  const isRejected = status === 'REJECTED' || status === 'EXPIRED'
  const approveDisabled = !selectedDoc || actionLoading || isApproved
  const rejectDisabled = !selectedDoc || actionLoading || isRejected

  return (
    <>
      <button
        onClick={onApprove}
        disabled={approveDisabled}
        className="w-full h-14 rounded-xl font-montserrat font-bold text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: selectedDoc && !approveDisabled ? '#0067DE' : '#FFFFFF',
          color: selectedDoc && !approveDisabled ? '#FFFFFF' : '#0067DE',
          border: selectedDoc && !approveDisabled ? 'none' : '1px solid #0067DE',
        }}
      >
        <CheckCircle2 className="w-5 h-5" />
        {isApproved ? 'Already Approved' : 'Approve'}
      </button>
      <button
        onClick={onReject}
        disabled={rejectDisabled}
        className="w-full h-14 rounded-xl font-montserrat font-bold text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: selectedDoc && !rejectDisabled ? '#DC2626' : '#FFFFFF',
          color: selectedDoc && !rejectDisabled ? '#FFFFFF' : '#DC2626',
          border: selectedDoc && !rejectDisabled ? 'none' : '1px solid #DC2626',
        }}
      >
        <XCircle className="w-5 h-5" />
        {isRejected ? 'Already Rejected' : 'Reject'}
      </button>
    </>
  )
}

export default function VerificationDetails() {
  const { contractorId } = useParams()
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [modal, setModal] = useState({ open: false, action: null })

  useEffect(() => {
    fetchDocuments()
  }, [contractorId])

  async function fetchDocuments() {
    setLoading(true)
    setError('')
    try {
      const res = await apiRequest(`/api/admin/contractors/${contractorId}/documents`)
      if (res.success) {
        setDocuments(res.data)
      } else {
        setError(res.message || 'Failed to load documents.')
      }
    } catch (err) {
      setError('Unable to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const contractor = documents.length > 0
    ? { name: documents[0].contractorName, email: documents[0].contractorEmail }
    : { name: '—', email: '—' }

  function openModal(action) {
    if (!selectedDoc) return
    setModal({ open: true, action })
  }

  async function handleSubmitAction({ reason, adminNotes }) {
    if (!selectedDoc) return
    setActionLoading(true)

    const step = DOC_TYPE_TO_STEP[selectedDoc.documentType]
    const isApprove = modal.action === 'approve'

    try {
      const res = await apiRequest(`/api/admin/contractors/${contractorId}/verification/approve-reject`, {
        method: 'POST',
        body: JSON.stringify({
          step,
          approved: isApprove,
          reason,
          adminNotes: adminNotes || null,
        }),
      })

      if (res.success) {
        setModal({ open: false, action: null })
        setSelectedDoc(null)
        await fetchDocuments()
      } else {
        alert(res.message || `Failed to ${modal.action} document.`)
      }
    } catch (err) {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#0067DE]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-xl text-sm font-montserrat font-medium" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/pro-verification')}
          className="flex items-center gap-2 text-[#6A6A6A] hover:text-[#0067DE] font-montserrat text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Verification Queue
        </button>
        <h1 className="font-montserrat font-extrabold text-[#202020]" style={{ fontSize: '40px', lineHeight: '40px' }}>
          Verification Details
        </h1>
        <p className="font-montserrat font-semibold text-[#6A6A6A] mt-4" style={{ fontSize: '24px', lineHeight: '24px' }}>
          Review pro information and documents
        </p>
      </div>

      {/* Content: Left (Info + Docs) + Right (Document Viewer) */}
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Pro Information Card */}
          <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-6">
            <h2 className="font-montserrat font-bold text-[#202020] text-lg mb-4">Pro Information</h2>
            <div className="flex flex-col">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-montserrat font-semibold text-sm text-[#6A6A6A]">Full Name:</span>
                <span className="font-montserrat font-bold text-sm text-[#202020]">{contractor.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-montserrat font-semibold text-sm text-[#6A6A6A]">Phone Number:</span>
                <span className="font-montserrat font-bold text-sm text-[#202020]">—</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-montserrat font-semibold text-sm text-[#6A6A6A]">Email:</span>
                <span className="font-montserrat font-bold text-sm text-[#202020]">{contractor.email}</span>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-6">
            <h2 className="font-montserrat font-bold text-[#202020] text-lg mb-4">Documents</h2>
            <div className="flex flex-col gap-2">
              {documents.map((doc) => {
                const status = getStatus(doc.verificationStatus)
                const isSelected = selectedDoc?.documentId === doc.documentId
                return (
                  <button
                    key={doc.documentId}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors text-left ${
                      isSelected
                        ? 'border-[#0067DE] bg-white'
                        : 'border-transparent bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[#6A6A6A] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-montserrat font-bold text-sm text-[#202020]">
                          {DOC_TYPE_LABELS[doc.documentType] || doc.documentType}
                        </p>
                        <p className="font-montserrat text-xs text-[#6A6A6A] mt-0.5">
                          Uploaded {formatDate(doc.createdAt)}
                          {doc.verifiedByName ? ` · Reviewed by ${doc.verifiedByName}` : ''}
                        </p>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-montserrat font-medium flex-shrink-0"
                      style={{ backgroundColor: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Document Viewer */}
        <div className="w-[340px] flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-6 flex flex-col" style={{ minHeight: '480px' }}>
            <h2 className="font-montserrat font-bold text-[#202020] text-lg mb-4">Document Viewer</h2>

            {selectedDoc ? (
              <DocImage
                key={selectedDoc.documentId}
                src={`${BASE_URL}/api/files/${selectedDoc.fileUrl.replace('uploads/', '')}`}
                alt={DOC_TYPE_LABELS[selectedDoc.documentType] || 'Document'}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#6A6A6A] gap-3">
                <FileText className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
                <p className="font-montserrat font-medium text-sm">Document Viewer</p>
                <p className="font-montserrat text-xs text-gray-400">Select Document To View.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <ApproveRejectButtons
            selectedDoc={selectedDoc}
            actionLoading={actionLoading}
            onApprove={() => openModal('approve')}
            onReject={() => openModal('reject')}
          />
        </div>
      </div>

      {/* Approve/Reject Modal */}
      <ActionModal
        isOpen={modal.open}
        action={modal.action}
        docLabel={selectedDoc ? (DOC_TYPE_LABELS[selectedDoc.documentType] || selectedDoc.documentType) : ''}
        onClose={() => setModal({ open: false, action: null })}
        onSubmit={handleSubmitAction}
        loading={actionLoading}
      />
    </div>
  )
}
