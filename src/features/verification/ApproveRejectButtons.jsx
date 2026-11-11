// Approve and Reject buttons for the selected document.
import { CheckCircle2, XCircle } from 'lucide-react'
import { VERIFICATION_TEXT } from '../../texts'

const TEXT = VERIFICATION_TEXT.details

export default function ApproveRejectButtons({ selectedDoc, actionLoading, onApprove, onReject }) {
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
