import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Loader2, CheckCircle2, XCircle, Clock, ArrowLeft, X } from 'lucide-react'
import { apiRequest } from '../config/api'
import { useApiResource } from '../hooks/useApiResource'
import { ROUTES } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'
import { loadDocumentFile } from '../utils/documentFile'

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
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
    label: 'Approved',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  REJECTED: {
    bg: '#FEF2F2',
    text: '#DC2626',
    border: '#FECACA',
    label: 'Rejected',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  EXPIRED: {
    bg: '#FEF2F2',
    text: '#DC2626',
    border: '#FECACA',
    label: 'Expired',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  PENDING: {
    bg: '#F9FAFB',
    text: '#6B7280',
    border: '#E5E7EB',
    label: 'pending',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  SUBMITTED: {
    bg: '#F9FAFB',
    text: '#6B7280',
    border: '#E5E7EB',
    label: 'pending',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
}

function getStatus(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
}

function DocImage({ fileUrl, mimeType, alt }) {
  const [file, setFile] = useState(null) // { url, isPdf } from loadDocumentFile
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let loaded = null
    loadDocumentFile(fileUrl, mimeType, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return URL.revokeObjectURL(result.url)
        loaded = result
        setFile(result)
      })
      .catch(() => {
        if (!controller.signal.aborted) setHasError(true)
      })
    return () => {
      controller.abort()
      if (loaded) URL.revokeObjectURL(loaded.url)
    }
  }, [fileUrl, mimeType])

  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
      {hasError ? (
        <div className="flex flex-col items-center gap-2 p-8 text-gray-400">
          <FileText className="h-12 w-12" strokeWidth={1.5} />
          <span className="text-sm">Unable to load document</span>
        </div>
      ) : !file ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      ) : file.isPdf ? (
        // An <img> can't display a PDF, so it opens in the browser's PDF viewer.
        // #view=FitH fits the page to the panel's width.
        <iframe
          src={`${file.url}#view=FitH`}
          title={alt}
          className="min-h-[400px] w-full self-stretch border-0"
        />
      ) : (
        <img
          src={file.url}
          alt={alt}
          className="h-full w-full object-contain"
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
      <div className="w-[480px] rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h3 className="text-lg font-bold text-heading">{title}</h3>
          <button onClick={onClose} className="text-muted transition-colors hover:text-heading">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 pb-6">
          <p className="text-sm text-muted">
            {isApprove ? 'Approving' : 'Rejecting'}{' '}
            <strong className="text-heading">{docLabel}</strong>
          </p>

          {/* Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isApprove
                  ? 'e.g. Document is clear and valid'
                  : 'e.g. Document is blurry or expired'
              }
              rows={3}
              className="w-full resize-none rounded-xl border px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-blue-400"
              style={{ borderColor: '#D9D9D9' }}
            />
          </div>

          {/* Admin Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">
              Admin Notes <span className="text-muted">(optional)</span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Additional notes for internal reference"
              rows={2}
              className="w-full resize-none rounded-xl border px-3 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-blue-400"
              style={{ borderColor: '#D9D9D9' }}
            />
          </div>

          {/* Buttons */}
          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-xl border text-sm font-semibold text-muted transition-colors hover:bg-gray-50"
              style={{ borderColor: '#D9D9D9' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          backgroundColor: selectedDoc && !approveDisabled ? '#0067DE' : '#FFFFFF',
          color: selectedDoc && !approveDisabled ? '#FFFFFF' : '#0067DE',
          border: selectedDoc && !approveDisabled ? 'none' : '1px solid #0067DE',
        }}
      >
        <CheckCircle2 className="h-5 w-5" />
        {isApproved ? 'Already Approved' : 'Approve'}
      </button>
      <button
        onClick={onReject}
        disabled={rejectDisabled}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          backgroundColor: selectedDoc && !rejectDisabled ? '#DC2626' : '#FFFFFF',
          color: selectedDoc && !rejectDisabled ? '#FFFFFF' : '#DC2626',
          border: selectedDoc && !rejectDisabled ? 'none' : '1px solid #DC2626',
        }}
      >
        <XCircle className="h-5 w-5" />
        {isRejected ? 'Already Rejected' : 'Reject'}
      </button>
    </>
  )
}

export default function VerificationDetails() {
  const { contractorId } = useParams()
  const navigate = useNavigate()
  const {
    data,
    loading,
    error,
    reload: reloadDocuments,
  } = useApiResource(ENDPOINTS.contractorDocuments(contractorId), {
    errorMessage: 'Failed to load documents.',
    networkErrorMessage: 'Unable to connect to server.',
  })
  const documents = data ?? []
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [modal, setModal] = useState({ open: false, action: null })

  const contractor =
    documents.length > 0
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
      const res = await apiRequest(ENDPOINTS.contractorVerificationDecision(contractorId), {
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
        reloadDocuments()
      } else {
        alert(res.message || `Failed to ${modal.action} document.`)
      }
    } catch {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm font-medium"
        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
      >
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(ROUTES.proVerification)}
          className="mb-4 flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Verification Queue
        </button>
        <h1
          className="font-extrabold text-heading"
          style={{ fontSize: '40px', lineHeight: '40px' }}
        >
          Verification Details
        </h1>
        <p
          className="mt-4 font-semibold text-muted"
          style={{ fontSize: '24px', lineHeight: '24px' }}
        >
          Review pro information and documents
        </p>
      </div>

      {/* Content: Left (Info + Docs) + Right (Document Viewer) */}
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Pro Information Card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-heading">Pro Information</h2>
            <div className="flex flex-col">
              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-sm font-semibold text-muted">Full Name:</span>
                <span className="text-sm font-bold text-heading">{contractor.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-sm font-semibold text-muted">Phone Number:</span>
                <span className="text-sm font-bold text-heading">—</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-muted">Email:</span>
                <span className="text-sm font-bold text-heading">{contractor.email}</span>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-heading">Documents</h2>
            <div className="flex flex-col gap-2">
              {documents.map((doc) => {
                const status = getStatus(doc.verificationStatus)
                const isSelected = selectedDoc?.documentId === doc.documentId
                return (
                  <button
                    key={doc.documentId}
                    onClick={() => setSelectedDoc(doc)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-primary bg-white'
                        : 'border-transparent bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted" />
                      <div>
                        <p className="text-sm font-bold text-heading">
                          {DOC_TYPE_LABELS[doc.documentType] || doc.documentType}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          Uploaded {formatDate(doc.createdAt)}
                          {doc.verifiedByName ? ` · Reviewed by ${doc.verifiedByName}` : ''}
                        </p>
                      </div>
                    </div>
                    <span
                      className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: status.bg,
                        color: status.text,
                        border: `1px solid ${status.border}`,
                      }}
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
        <div className="flex w-[340px] flex-col gap-4">
          <div
            className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6"
            style={{ minHeight: '480px' }}
          >
            <h2 className="mb-4 text-lg font-bold text-heading">Document Viewer</h2>

            {selectedDoc ? (
              <DocImage
                key={selectedDoc.documentId}
                fileUrl={selectedDoc.fileUrl}
                mimeType={selectedDoc.mimeType}
                alt={DOC_TYPE_LABELS[selectedDoc.documentType] || 'Document'}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted">
                <FileText className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
                <p className="text-sm font-medium">Document Viewer</p>
                <p className="text-xs text-gray-400">Select Document To View.</p>
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
        docLabel={
          selectedDoc ? DOC_TYPE_LABELS[selectedDoc.documentType] || selectedDoc.documentType : ''
        }
        onClose={() => setModal({ open: false, action: null })}
        onSubmit={handleSubmitAction}
        loading={actionLoading}
      />
    </div>
  )
}
