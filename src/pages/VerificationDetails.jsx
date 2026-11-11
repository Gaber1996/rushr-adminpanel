import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Loader2, CheckCircle2, XCircle, ArrowLeft, X } from 'lucide-react'
import { apiRequest } from '../config/api'
import { useApiResource } from '../hooks/useApiResource'
import { ROUTES } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import TextField from '../components/ui/TextField'
import VerificationStatusBadge from '../features/verification/VerificationStatusBadge'
import { loadDocumentFile } from '../utils/documentFile'
import { COMMON_TEXT, VERIFICATION_TEXT } from '../texts'

const TEXT = VERIFICATION_TEXT.details

const DOC_TYPE_LABELS = {
  GOVERNMENT_ID: VERIFICATION_TEXT.docTypes.governmentId,
  LICENSE: VERIFICATION_TEXT.docTypes.license,
  INSURANCE: VERIFICATION_TEXT.docTypes.insurance,
}

// Map document types to verification step enum values
const DOC_TYPE_TO_STEP = {
  GOVERNMENT_ID: 'GOV_ID',
  LICENSE: 'LICENSE',
  INSURANCE: 'INSURANCE',
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
          <span className="text-sm">{TEXT.documentLoadError}</span>
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

const ACTION_TITLE_ID = 'verification-action-title'

function ActionModal({ isOpen, action, docLabel, onClose, onSubmit, loading }) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      labelledBy={ACTION_TITLE_ID}
      dismissOnBackdrop={false}
      className="w-[480px] rounded-2xl bg-white"
    >
      {/* Mounted per open, so the fields start empty each time. */}
      <ActionForm
        action={action}
        docLabel={docLabel}
        onClose={onClose}
        onSubmit={onSubmit}
        loading={loading}
      />
    </Modal>
  )
}

function ActionForm({ action, docLabel, onClose, onSubmit, loading }) {
  const [reason, setReason] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const isApprove = action === 'approve'

  function handleSubmit(e) {
    e.preventDefault()
    if (!reason.trim()) return
    onSubmit({ reason: reason.trim(), adminNotes: adminNotes.trim() || null })
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 pb-4 pt-6">
        <h3 id={ACTION_TITLE_ID} className="text-lg font-bold text-heading">
          {isApprove ? TEXT.approveTitle : TEXT.rejectTitle}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label={TEXT.close}
          className="text-muted transition-colors hover:text-heading"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 pb-6">
        <p className="text-sm text-muted">
          {isApprove ? TEXT.approving : TEXT.rejecting}{' '}
          <strong className="text-heading">{docLabel}</strong>
        </p>

        <TextField
          label={COMMON_TEXT.reason}
          hint={<span className="text-red-500">{COMMON_TEXT.requiredMark}</span>}
          rows={3}
          gapClassName="gap-1.5"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={isApprove ? TEXT.approveReasonPlaceholder : TEXT.rejectReasonPlaceholder}
        />
        <TextField
          label={TEXT.adminNotesLabel}
          hint={<span className="text-muted">{TEXT.optionalHint}</span>}
          rows={2}
          gapClassName="gap-1.5"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder={TEXT.adminNotesPlaceholder}
        />

        <div className="mt-1 flex gap-3">
          <Button variant="outline" size="mdSemibold" className="flex-1" onClick={onClose}>
            {COMMON_TEXT.cancel}
          </Button>
          <Button
            type="submit"
            variant={isApprove ? 'primary' : 'dangerSoft'}
            className="flex-1"
            loading={loading}
            disabled={!reason.trim()}
          >
            {isApprove ? TEXT.approve : TEXT.reject}
          </Button>
        </div>
      </form>
    </>
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
        {isApproved ? TEXT.alreadyApproved : TEXT.approve}
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
        {isRejected ? TEXT.alreadyRejected : TEXT.reject}
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
    errorMessage: TEXT.loadError,
    networkErrorMessage: COMMON_TEXT.networkError,
  })
  const documents = data ?? []
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [modal, setModal] = useState({ open: false, action: null })

  const contractor =
    documents.length > 0
      ? { name: documents[0].contractorName, email: documents[0].contractorEmail }
      : { name: COMMON_TEXT.emptyValue, email: COMMON_TEXT.emptyValue }

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
        alert(res.message || TEXT.actionFailed(modal.action))
      }
    } catch {
      alert(COMMON_TEXT.networkError)
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
    return <ErrorState message={error} />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.proVerification)}
          className="mb-4 flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {TEXT.backToQueue}
        </button>
        <PageHeader title={TEXT.title} subtitle={TEXT.subtitle} />
      </div>

      {/* Content: Left (Info + Docs) + Right (Document Viewer) */}
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Pro Information Card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-heading">{TEXT.proInfoTitle}</h2>
            <div className="flex flex-col">
              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-sm font-semibold text-muted">{TEXT.fullNameLabel}</span>
                <span className="text-sm font-bold text-heading">{contractor.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-3">
                <span className="text-sm font-semibold text-muted">{TEXT.phoneLabel}</span>
                <span className="text-sm font-bold text-heading">{COMMON_TEXT.emptyValue}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-muted">{TEXT.emailLabel}</span>
                <span className="text-sm font-bold text-heading">{contractor.email}</span>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-heading">{TEXT.documentsTitle}</h2>
            <div className="flex flex-col gap-2">
              {documents.map((doc) => {
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
                          {TEXT.uploadedOn(formatDate(doc.createdAt))}
                          {doc.verifiedByName ? TEXT.reviewedBy(doc.verifiedByName) : ''}
                        </p>
                      </div>
                    </div>
                    <VerificationStatusBadge status={doc.verificationStatus} className="shrink-0" />
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
            <h2 className="mb-4 text-lg font-bold text-heading">{TEXT.viewerTitle}</h2>

            {selectedDoc ? (
              <DocImage
                key={selectedDoc.documentId}
                fileUrl={selectedDoc.fileUrl}
                mimeType={selectedDoc.mimeType}
                alt={DOC_TYPE_LABELS[selectedDoc.documentType] || TEXT.documentAlt}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted">
                <FileText className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
                <p className="text-sm font-medium">{TEXT.viewerTitle}</p>
                <p className="text-xs text-gray-400">{TEXT.viewerEmptyHint}</p>
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
