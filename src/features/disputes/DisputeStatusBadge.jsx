import { Check, Clock } from 'lucide-react'
import StatusBadge from '../../components/ui/StatusBadge'

// The backend has three resolved statuses (RESOLVED_RELEASED / _REFUNDED / _SPLIT) and OPEN.
// Anything that is not a resolved one reads as "In Review".
export function isResolvedStatus(status) {
  return typeof status === 'string' && status.startsWith('RESOLVED')
}

/** "Resolved" (green) or "In Review" (grey) for a dispute status. */
export default function DisputeStatusBadge({ status }) {
  return isResolvedStatus(status) ? (
    <StatusBadge
      tone="success"
      shape="pill"
      icon={<Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
    >
      Resolved
    </StatusBadge>
  ) : (
    <StatusBadge
      tone="neutral"
      shape="pill"
      icon={<Clock className="h-4 w-4" aria-hidden="true" />}
    >
      In Review
    </StatusBadge>
  )
}
