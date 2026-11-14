// Approve/reject modal asking for a reason and optional admin notes.
import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import TextField from '../../components/ui/TextField'
import { COMMON_TEXT, VERIFICATION_TEXT } from '../../texts'

const TEXT = VERIFICATION_TEXT.details

const ACTION_TITLE_ID = 'verification-action-title'

export default function ActionModal({ isOpen, action, docLabel, onClose, onSubmit, loading }) {
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
