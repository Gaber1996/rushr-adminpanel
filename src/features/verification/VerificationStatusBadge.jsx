import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import StatusBadge from '../../components/ui/StatusBadge'

// One entry per backend verification status. Anything unknown reads as pending.
// `glyph`/`dot` draw the small filled circle used in the queue table.
const VERIFICATION_STATUS = {
  APPROVED: {
    tone: 'success',
    label: 'Approved',
    Icon: CheckCircle2,
    glyph: '✓',
    dot: 'bg-emerald-600',
  },
  REJECTED: { tone: 'danger', label: 'Rejected', Icon: XCircle, glyph: '✕', dot: 'bg-red-600' },
  EXPIRED: { tone: 'danger', label: 'Expired', Icon: XCircle, glyph: '✕', dot: 'bg-red-600' },
  PENDING: { tone: 'neutral', label: 'pending', Icon: Clock, glyph: '◷', dot: 'bg-gray-500' },
  SUBMITTED: { tone: 'neutral', label: 'pending', Icon: Clock, glyph: '◷', dot: 'bg-gray-500' },
}

export function verificationStatus(status) {
  return VERIFICATION_STATUS[status] ?? VERIFICATION_STATUS.PENDING
}

/**
 * The chip for a verification status (Approved / Rejected / Expired / pending).
 * `marker="dot"` (queue table) shows a filled circle with a glyph; `marker="icon"` (document list)
 * shows an outline icon — the two designs Figma uses.
 */
export default function VerificationStatusBadge({ status, marker = 'icon', className }) {
  const { tone, label, Icon, glyph, dot } = verificationStatus(status)
  const icon =
    marker === 'dot' ? (
      <span
        aria-hidden="true"
        className={`flex h-3 w-3 items-center justify-center rounded-full text-[8px] text-white ${dot}`}
      >
        {glyph}
      </span>
    ) : (
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    )
  return (
    <StatusBadge tone={tone} icon={icon} className={className}>
      {label}
    </StatusBadge>
  )
}
