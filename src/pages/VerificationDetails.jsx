import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'
import { apiRequest } from '../config/api'
import { useApiResource } from '../hooks/useApiResource'
import { ROUTES } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'
import ErrorState from '../components/ui/ErrorState'
import PageHeader from '../components/ui/PageHeader'
import VerificationStatusBadge from '../features/verification/VerificationStatusBadge'
import VerificationDetailsSkeleton from '../features/verification/VerificationDetailsSkeleton'
import DocImage from '../features/verification/DocImage'
import ActionModal from '../features/verification/ActionModal'
import ApproveRejectButtons from '../features/verification/ApproveRejectButtons'
import { DOC_TYPE_LABELS, DOC_TYPE_TO_STEP } from '../features/verification/documentTypes'
import { COMMON_TEXT, VERIFICATION_TEXT } from '../texts'

const TEXT = VERIFICATION_TEXT.details

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

  // Back link, title and subtitle — shown while loading too.
  const header = (
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
  )

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-8">
        {header}
        <VerificationDetailsSkeleton />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="flex flex-col gap-8">
      {header}

      {/* Content: Left (Info + Docs) + Right (Document Viewer) */}
      <div className="flex flex-col gap-8 lg:flex-row">
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
        <div className="flex w-full flex-col gap-4 lg:w-[340px]">
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
