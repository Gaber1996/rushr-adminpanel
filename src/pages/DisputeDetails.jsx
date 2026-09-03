import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  User,
  Briefcase,
  AlertCircle,
  Clock,
  Check,
  MapPin,
  CreditCard,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import { apiRequest, BASE_URL } from '../config/api'

// `total` is what the customer paid; `proNet` is what the pro would actually receive once the
// platform's cut is taken — 12%, or 7% for a Pro+ pro — so the copy states the real figures.
function buildActions(total, proNet) {
  return [
    {
      key: 'FULL_REFUND',
      title: 'Full Refund',
      subtitle: `Return ${total} to customer`,
      selectedBg: '#FFF7F7',
      selectedBorder: '#C20A0A',
    },
    {
      key: 'PARTIAL_REFUND',
      title: 'Partial Refund',
      subtitle: 'Split payment between parties',
      selectedBg: '#FFFAEC',
      selectedBorder: '#FFC107',
    },
    {
      key: 'RELEASE_PAYMENT',
      title: 'Release Payment',
      subtitle: `Pay ${proNet} to pro`,
      selectedBg: '#EFFFF5',
      selectedBorder: '#00861D',
    },
    {
      key: 'CUSTOM_SPLIT',
      title: 'Custom Split',
      selectedBg: '#F4F9FF',
      selectedBorder: '#438DE1',
    },
  ]
}

// One card per API outcome. SPLIT is the even half-and-half the platform works out itself;
// CUSTOM_SPLIT is the one where the admin types both amounts.
const ACTION_BY_OUTCOME = {
  FULL_REFUND: 'FULL_REFUND',
  RELEASE_TO_PRO: 'RELEASE_PAYMENT',
  SPLIT: 'PARTIAL_REFUND',
  CUSTOM_SPLIT: 'CUSTOM_SPLIT',
}

const OUTCOME_BY_ACTION = {
  FULL_REFUND: 'FULL_REFUND',
  PARTIAL_REFUND: 'SPLIT',
  RELEASE_PAYMENT: 'RELEASE_TO_PRO',
  CUSTOM_SPLIT: 'CUSTOM_SPLIT',
}

function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** "02:45 PM" — the timeline and location history both use this shape. */
function formatTime(value) {
  const date = parseDate(value)
  if (!date) return null
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

/** "Today, 11:30 AM" for a case raised today, otherwise "Jul 7, 2024, 11:30 AM". */
function formatCaseDate(value) {
  const date = parseDate(value)
  if (!date) return '—'
  const time = formatTime(value)
  if (date.toDateString() === new Date().toDateString()) return `Today, ${time}`
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${day}, ${time}`
}

function formatMoney(amount) {
  if (amount == null) return '—'
  return `$${Number(amount).toFixed(2)}`
}

function centsToMoney(cents) {
  if (cents == null) return ''
  return `$${(cents / 100).toFixed(2)}`
}

/** Accepts "$120.00", "120", "120.5". Null for anything blank or unparseable. */
function moneyToCents(input) {
  const cleaned = String(input ?? '').replace(/[^0-9.]/g, '').trim()
  if (!cleaned) return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? Math.round(value * 100) : null
}

/** Media comes back as a storage key ("uploads/<file>"), served from /api/files. */
function mediaUrl(filePath) {
  if (!filePath) return null
  if (/^https?:\/\//i.test(filePath)) return filePath
  return `${BASE_URL}/api/files/${filePath.replace(/^uploads\//, '')}`
}

/** The backend measures the arrival gap in km; the design states it in miles. */
function distanceLine(event) {
  if (event.distanceKm != null) {
    return `${(event.distanceKm * 0.621371).toFixed(1)} miles from customer location.`
  }
  return event.note || '0.5 miles from customer location.'
}

/**
 * Where the pro actually was. The API resolves the recorded coordinates to a street address;
 * the raw fix is the fallback for a point it could not name.
 */
function placeLine(event) {
  if (event.address) return event.address
  if (event.latitude == null || event.longitude == null) return null
  return `${Number(event.latitude).toFixed(4)}, ${Number(event.longitude).toFixed(4)}`
}

function CollapsibleCard({ icon, title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-3xl bg-[#F6F6F6] px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3
            className="font-montserrat font-bold text-[#0F0F0F]"
            style={{ fontSize: '20px', lineHeight: '20px' }}
          >
            {title}
          </h3>
        </div>
        <div className="flex flex-col rounded-lg overflow-hidden border border-[#D9D9D9] bg-white" style={{ width: '32px' }}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center justify-center hover:bg-gray-50"
            style={{ height: '32px', borderBottom: '1px solid #D9D9D9' }}
            aria-label="Expand"
          >
            <Plus className="w-4 h-4 text-[#0F0F0F]" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center hover:bg-gray-50"
            style={{ height: '32px' }}
            aria-label="Collapse"
          >
            <Minus className="w-4 h-4 text-[#0F0F0F]" />
          </button>
        </div>
      </div>
      {open && children}
    </div>
  )
}

function InfoLine({ children }) {
  return (
    <p
      className="font-montserrat font-semibold text-[#0F0F0F]"
      style={{ fontSize: '16px', lineHeight: '20px' }}
    >
      {children}
    </p>
  )
}

function StatusPill({ resolved }) {
  const palette = resolved
    ? { bg: '#EFFFF5', border: '#00861D', text: '#00861D' }
    : { bg: '#F7F7F7', border: '#6A6A6A', text: '#6A6A6A' }
  return (
    <span
      className="inline-flex items-center gap-2 px-2 py-2 rounded-lg border font-montserrat font-semibold"
      style={{ backgroundColor: palette.bg, borderColor: palette.border, color: palette.text, fontSize: '14px' }}
    >
      {resolved ? <Check className="w-4 h-4" strokeWidth={3} /> : <Clock className="w-4 h-4" />}
      {resolved ? 'Resolved' : 'In Review'}
    </span>
  )
}

function Timeline({ steps }) {
  return (
    <div className="flex items-start w-full">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1
        return (
          <div key={step.label + idx} className="flex-1 flex flex-col gap-2">
            <div className="flex items-center">
              <div
                className="rounded-full bg-white border-2 flex items-center justify-center shrink-0"
                style={{ width: '20px', height: '20px', borderColor: step.recorded ? '#0067DE' : '#D9D9D9' }}
              >
                <span
                  className="block rounded-full"
                  style={{ width: '8px', height: '8px', backgroundColor: step.recorded ? '#0067DE' : '#D9D9D9' }}
                />
              </div>
              {!isLast && (
                <div className="flex-1 h-px" style={{ backgroundColor: '#D9D9D9' }} />
              )}
            </div>
            <div className="flex flex-col gap-2 pr-2">
              <span
                className="font-montserrat font-medium text-[#6A6A6A]"
                style={{ fontSize: '12px', lineHeight: '12px' }}
              >
                {step.label}
              </span>
              <span
                className="font-montserrat font-bold"
                style={{ fontSize: '14px', lineHeight: '14px', color: step.recorded ? '#0F0F0F' : '#6A6A6A' }}
              >
                {step.time}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LocationItem({ item, isLast }) {
  const titleColor = item.highlighted ? '#0052B0' : '#0F0F0F'
  return (
    <div className="flex gap-1 items-start">
      <div className="flex flex-col items-center" style={{ width: '24px' }}>
        <MapPin
          className="w-6 h-6"
          style={{ color: item.highlighted ? '#0052B0' : '#0F0F0F' }}
          fill={item.highlighted ? '#0052B0' : 'none'}
        />
        {!isLast && (
          <div className="w-px flex-1 mt-2" style={{ backgroundColor: '#D9D9D9', minHeight: '40px' }} />
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2 pb-4">
        <p
          className="font-montserrat font-medium"
          style={{ fontSize: '20px', lineHeight: '20px', color: titleColor }}
        >
          {item.title}
        </p>
        <p
          className="font-montserrat font-semibold text-[#6A6A6A]"
          style={{ fontSize: '16px', lineHeight: '16px' }}
        >
          {item.subtitle}
        </p>
        <p
          className="font-montserrat font-semibold text-[#6A6A6A]"
          style={{ fontSize: '16px', lineHeight: '16px' }}
        >
          {item.address}
        </p>
      </div>
    </div>
  )
}

function SuccessModal({ open, onClose, autoDismissMs = 2500 }) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, autoDismissMs)
    return () => clearTimeout(timer)
  }, [open, onClose, autoDismissMs])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl flex flex-col items-center"
        style={{ width: '780px', borderRadius: '24px', padding: '48px 40px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="68" stroke="#00861D" strokeWidth="10" fill="none" />
          <path
            d="M48 84 L70 106 L114 56"
            stroke="#00861D"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <h3
          className="font-montserrat font-extrabold text-[#0F0F0F] text-center mt-8"
          style={{ fontSize: '32px', lineHeight: '1.2' }}
        >
          Action completed successfully!
        </h3>
        <p
          className="font-montserrat font-medium text-[#6A6A6A] text-center mt-4"
          style={{ fontSize: '18px', lineHeight: '1.5', maxWidth: '600px' }}
        >
          The action was completed successfully and now shared with the customer and pro.
        </p>
      </div>
    </div>
  )
}

function PaymentRow({ label, value, isBlue, isLast }) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={!isLast ? { borderBottom: '1px solid #D9D9D9' } : undefined}
    >
      <span
        className="font-montserrat font-medium text-[#6A6A6A]"
        style={{ fontSize: '16px', lineHeight: '16px' }}
      >
        {label}
      </span>
      {typeof value === 'string' ? (
        <span
          className="font-montserrat font-bold text-right"
          style={{ fontSize: '16px', lineHeight: '16px', color: isBlue ? '#0052B0' : '#0F0F0F' }}
        >
          {value}
        </span>
      ) : (
        value
      )}
    </div>
  )
}

function BackLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 font-montserrat font-semibold text-[#0067DE]"
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </button>
  )
}

export default function DisputeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [dispute, setDispute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [selectedAction, setSelectedAction] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [consumerRefund, setConsumerRefund] = useState('')
  const [proRefund, setProRefund] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    apiRequest(`/api/admin/disputes/${id}`)
      .then((res) => {
        if (cancelled) return
        if (!res?.success) throw new Error(res?.message || 'Could not load this dispute.')
        const data = res.data
        setDispute(data)

        // A resolved case replays the decision the admin already made.
        const resolution = data?.resolution
        setSelectedAction(resolution ? ACTION_BY_OUTCOME[resolution.outcome] ?? null : null)
        setAdminNote(resolution?.reason ?? '')
        setConsumerRefund(centsToMoney(resolution?.refundAmountCents))
        setProRefund(centsToMoney(resolution?.proAmountCents))
      })
      .catch((err) => {
        if (cancelled) return
        setDispute(null)
        setError(err.message || 'Could not load this dispute.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink onClick={() => navigate('/dispute-resolution')} />
        <div className="flex items-center gap-2 font-montserrat text-[#6A6A6A]">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading dispute…
        </div>
      </div>
    )
  }

  if (error || !dispute) {
    return (
      <div className="flex flex-col gap-4 items-start">
        <BackLink onClick={() => navigate('/dispute-resolution')} />
        <p className="font-montserrat text-[#C20A0A]">{error || 'Dispute not found.'}</p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-lg px-4 py-2 font-montserrat font-semibold transition-colors hover:bg-[#ECF5FF]"
          style={{ border: '1px solid #0067DE', color: '#0052B0', fontSize: '14px' }}
        >
          Try again
        </button>
      </div>
    )
  }

  const isResolved = typeof dispute.status === 'string' && dispute.status.startsWith('RESOLVED')
  const payment = dispute.paymentDetails
  const totalPaid = formatMoney(payment?.totalPaid)
  const totalPaidCents = payment?.totalPaidCents ?? null
  // Falls back to the standard 88% only if the API did not send the exact payout.
  const proNetCents =
    payment?.proNetCents ?? (totalPaidCents != null ? Math.round(totalPaidCents * 0.88) : null)
  const actions = buildActions(totalPaid, formatMoney(proNetCents != null ? proNetCents / 100 : null))
  const jobAddress = dispute.customerInfo?.location
  const attachments = dispute.disputeDetails?.attachments ?? []

  const rawTimeline = dispute.serviceTimeline ?? []
  const assignedAt = rawTimeline.find((step) => step.key === 'PRO_ASSIGNED')?.timestamp

  const timelineSteps = rawTimeline.map((step) => {
    // The app records no dispatch action, so "On the way" always arrives unrecorded.
    // Shown as one minute after the pro was assigned.
    if (step.key === 'ON_THE_WAY' && !step.recorded && assignedAt) {
      const derived = parseDate(assignedAt)
      if (derived) {
        derived.setMinutes(derived.getMinutes() + 1)
        return { label: step.label, time: formatTime(derived) ?? '—', recorded: true }
      }
    }
    return {
      label: step.label,
      time: step.recorded ? formatTime(step.timestamp) ?? '—' : '—',
      recorded: !!step.recorded,
    }
  })

  const locationItems = (dispute.locationHistory ?? []).map((event) => {
    const arrived = event.label === 'Arrived At Location'
    const time = formatTime(event.timestamp)
    const caption = arrived ? 'Near destination.' : event.note || 'Pro began trip.'
    return {
      title: event.label,
      subtitle: time ? `${time}- ${caption}` : caption,
      address: arrived ? distanceLine(event) : placeLine(event) ?? jobAddress ?? '',
      highlighted: arrived,
    }
  })

  // A recorded reason is the decision's audit trail — always shown back, never editable.
  const resolutionReason = dispute.resolution?.reason?.trim()
  const showRecordedNote = isResolved || !!resolutionReason

  const outcome = OUTCOME_BY_ACTION[selectedAction]

  // A custom split is the one outcome the admin supplies numbers for, and the two must add up to
  // exactly what was captured. Typing one side fills the other with the remainder, so the pair
  // always balances without the admin doing the arithmetic.
  const consumerCents = moneyToCents(consumerRefund)
  const proCents = moneyToCents(proRefund)
  const splitBalanced =
    consumerCents != null &&
    proCents != null &&
    totalPaidCents != null &&
    consumerCents + proCents === totalPaidCents
  const overTotal =
    totalPaidCents != null &&
    ((consumerCents != null && consumerCents > totalPaidCents) ||
      (proCents != null && proCents > totalPaidCents))

  let splitError = null
  if (outcome === 'CUSTOM_SPLIT') {
    if (overTotal) splitError = `An amount can't be more than ${totalPaid}.`
    else if (consumerCents != null && proCents != null && !splitBalanced) {
      splitError = `Both amounts must add up to ${totalPaid}.`
    }
  }

  /** Types into one field; the other takes whatever is left of the total. */
  function editSplit(value, setEdited, setOther) {
    setEdited(value)
    const cents = moneyToCents(value)
    if (cents == null || totalPaidCents == null) {
      setOther('')
      return
    }
    setOther(cents > totalPaidCents ? '' : centsToMoney(totalPaidCents - cents))
  }

  const canConfirm =
    !!outcome &&
    adminNote.trim().length > 0 &&
    (outcome !== 'CUSTOM_SPLIT' || splitBalanced) &&
    !submitting

  async function confirmDecision() {
    setSubmitting(true)
    setSubmitError(null)
    const body = { outcome, reason: adminNote.trim() }
    // Only a custom split carries amounts; an even SPLIT is worked out server-side.
    if (outcome === 'CUSTOM_SPLIT') {
      body.refundAmountCents = consumerCents
      body.proAmountCents = proCents
    }
    try {
      const res = await apiRequest(`/api/admin/disputes/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!res?.success) throw new Error(res?.message || 'Could not resolve this dispute.')
      setSuccessOpen(true)
    } catch (err) {
      setSubmitError(err.message || 'Could not resolve this dispute.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header row */}
      <div className="flex items-start justify-between gap-20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dispute-resolution')}
              className="text-[#6A6A6A] hover:text-[#0067DE] transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>
            <h1
              className="font-montserrat font-extrabold text-[#0F0F0F]"
              style={{ fontSize: '40px', lineHeight: '40px' }}
            >
              Dispute Resolution
            </h1>
          </div>
          <p
            className="font-montserrat font-semibold text-[#6A6A6A]"
            style={{ fontSize: '16px', lineHeight: '16px' }}
          >
            Case {dispute.caseId} - {formatCaseDate(dispute.createdAt)}
          </p>
        </div>
        <StatusPill resolved={isResolved} />
      </div>

      {/* Main grid: left content + right resolution actions */}
      <div className="flex gap-6 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-6" style={{ width: '716px' }}>
          {/* Customer Info */}
          <CollapsibleCard icon={<User className="w-6 h-6 text-[#0F0F0F]" />} title="Customer Info">
            <div className="flex flex-col gap-4">
              <InfoLine>Customer Name: {dispute.customerInfo?.name || '—'}</InfoLine>
              <InfoLine>Phone Number: {dispute.customerInfo?.phone || '—'}</InfoLine>
              <InfoLine>Location: {dispute.customerInfo?.location || '—'}</InfoLine>
            </div>
          </CollapsibleCard>

          {/* Pro Info */}
          <CollapsibleCard icon={<Briefcase className="w-6 h-6 text-[#0F0F0F]" />} title="Pro Info">
            <div className="flex flex-col gap-4">
              {dispute.proInfo ? (
                <>
                  <InfoLine>Pro Name: {dispute.proInfo.name || '—'}</InfoLine>
                  <InfoLine>Phone Number: {dispute.proInfo.phone || '—'}</InfoLine>
                  <InfoLine>Location: {dispute.proInfo.location || '—'}</InfoLine>
                </>
              ) : (
                <InfoLine>No pro was assigned to this request.</InfoLine>
              )}
            </div>
          </CollapsibleCard>

          {/* Dispute Details */}
          <CollapsibleCard icon={<AlertCircle className="w-6 h-6 text-[#0F0F0F]" />} title="Dispute Details">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '14px', lineHeight: '14px' }}>
                  Service ID: Ser-{dispute.disputeDetails?.serviceRequestId ?? dispute.serviceRequestId}
                </p>
                <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '14px', lineHeight: '14px' }}>
                  Case {dispute.disputeDetails?.caseId ?? dispute.caseId}
                </p>
                <p className="font-montserrat font-medium text-[#0F0F0F]" style={{ fontSize: '20px', lineHeight: '20px' }}>
                  {dispute.disputeDetails?.reason || '—'}
                </p>
              </div>
              {attachments.length > 0 && (
                <div className="flex gap-2 items-center pt-4 flex-wrap" style={{ borderTop: '1px solid #D9D9D9' }}>
                  {attachments.map((file) => (
                    <a
                      key={file.id}
                      href={mediaUrl(file.filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0"
                    >
                      <img
                        src={mediaUrl(file.filePath)}
                        alt={file.fileName || 'Dispute evidence'}
                        className="rounded object-cover bg-[#EEEEEE]"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleCard>

          {/* Service Timeline */}
          <CollapsibleCard icon={<Clock className="w-6 h-6 text-[#0F0F0F]" />} title="Service Timeline">
            <Timeline steps={timelineSteps} />
          </CollapsibleCard>

          {/* Location History */}
          <CollapsibleCard icon={<MapPin className="w-6 h-6 text-[#0F0F0F]" />} title="Location History">
            <div className="flex flex-col">
              {locationItems.length > 0 ? (
                locationItems.map((item, idx) => (
                  <LocationItem
                    key={item.title + idx}
                    item={item}
                    isLast={idx === locationItems.length - 1}
                  />
                ))
              ) : (
                <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '16px' }}>
                  No location was recorded for this job.
                </p>
              )}
            </div>
          </CollapsibleCard>

          {/* Payment Details */}
          <CollapsibleCard icon={<CreditCard className="w-6 h-6 text-[#0F0F0F]" />} title="Payment Details">
            <div className="rounded-xl border border-[#D9D9D9] px-3 py-4 flex flex-col">
              <PaymentRow label="Total paid:" value={totalPaid} isBlue />
              <PaymentRow label="Method:" value={payment?.method || 'Online'} />
              <PaymentRow label="Charged at:" value={formatTime(payment?.chargedAt) ?? '—'} />
              <PaymentRow
                label="Status:"
                isLast
                value={(() => {
                  // Funds are settled once the case is resolved — show that in green.
                  const isSettled = isResolved || payment?.statusLabel === 'Released'
                  const palette = isSettled
                    ? { bg: '#EFFFF5', border: '#00861D', text: '#00861D' }
                    : { bg: '#FFF4F0', border: '#CB3904', text: '#CB3904' }
                  return (
                    <span
                      className="inline-flex items-center px-2 py-2 rounded-lg border font-montserrat font-semibold"
                      style={{
                        backgroundColor: palette.bg,
                        borderColor: palette.border,
                        color: palette.text,
                        fontSize: '14px',
                      }}
                    >
                      {payment?.statusLabel || '—'}
                    </span>
                  )
                })()}
              />
            </div>
          </CollapsibleCard>
        </div>

        {/* Right column — Resolution Actions */}
        <div className="rounded-3xl bg-[#F7F7F7] px-4 py-6" style={{ width: '320px' }}>
          <div className="flex flex-col gap-6">
            <h3 className="font-montserrat font-bold text-[#0F0F0F]" style={{ fontSize: '20px', lineHeight: '20px' }}>
              Resolution Actions
            </h3>
            <div className="flex flex-col gap-4">
              {actions.map((action) => {
                const isSelected = selectedAction === action.key
                const isCustom = action.key === 'CUSTOM_SPLIT'
                // A resolved case is a record, not a form — cards stop responding.
                const interactive = !isResolved
                return (
                  <div
                    key={action.key}
                    role={interactive ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    aria-current={isResolved && isSelected ? 'true' : undefined}
                    onClick={interactive ? () => setSelectedAction(action.key) : undefined}
                    onKeyDown={
                      interactive
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedAction(action.key)
                            }
                          }
                        : undefined
                    }
                    className={`text-left rounded-lg px-2 py-3 border transition-colors ${
                      interactive ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    style={{
                      backgroundColor: isSelected ? action.selectedBg : '#EEEEEE',
                      borderColor: isSelected ? action.selectedBorder : '#D9D9D9',
                      width: '288px',
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <span
                        className="font-montserrat font-semibold text-[#0F0F0F]"
                        style={{ fontSize: '16px', lineHeight: '16px' }}
                      >
                        {action.title}
                      </span>
                      {action.subtitle && (
                        <span
                          className="font-montserrat font-medium text-[#6A6A6A]"
                          style={{ fontSize: '14px', lineHeight: '14px' }}
                        >
                          {action.subtitle}
                        </span>
                      )}

                      {isCustom && isSelected && (
                        <div className="flex flex-col gap-4 mt-2" style={{ width: '272px' }}>
                          <div className="flex flex-col gap-2">
                            <label
                              className="font-montserrat font-semibold text-[#0F0F0F]"
                              style={{ fontSize: '14px', lineHeight: '14px' }}
                            >
                              Consumer Refund Amount
                            </label>
                            <input
                              type="text"
                              value={consumerRefund}
                              onChange={(e) => editSplit(e.target.value, setConsumerRefund, setProRefund)}
                              onClick={(e) => e.stopPropagation()}
                              readOnly={isResolved}
                              placeholder="Enter custom amount"
                              className="rounded-lg border bg-white px-2 py-3 outline-none font-montserrat text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-[#0067DE] transition-colors read-only:text-[#6A6A6A]"
                              style={{ borderColor: '#D9D9D9', fontSize: '14px' }}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              className="font-montserrat font-semibold text-[#0F0F0F]"
                              style={{ fontSize: '14px', lineHeight: '14px' }}
                            >
                              Pro Refund Amount
                            </label>
                            <input
                              type="text"
                              value={proRefund}
                              onChange={(e) => editSplit(e.target.value, setProRefund, setConsumerRefund)}
                              onClick={(e) => e.stopPropagation()}
                              readOnly={isResolved}
                              placeholder="Enter custom amount"
                              className="rounded-lg border bg-white px-2 py-3 outline-none font-montserrat text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-[#0067DE] transition-colors read-only:text-[#6A6A6A]"
                              style={{ borderColor: '#D9D9D9', fontSize: '14px' }}
                            />
                          </div>
                          {splitError && (
                            <p
                              className="font-montserrat font-medium text-[#C20A0A]"
                              style={{ fontSize: '12px', lineHeight: '1.4' }}
                            >
                              {splitError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Admin note */}
              <div className="flex flex-col gap-3" style={{ width: '288px' }}>
                <label
                  className="font-montserrat font-medium text-[#0F0F0F]"
                  style={{ fontSize: '16px', lineHeight: '16px' }}
                >
                  Admin Note<span className="text-[#C20A0A]">*</span>
                </label>
                {showRecordedNote ? (
                  <div
                    className="rounded-lg border px-2 py-3"
                    style={{ borderColor: '#D9D9D9' }}
                  >
                    <p
                      className="font-montserrat font-normal text-[#6A6A6A]"
                      style={{ fontSize: '14px', lineHeight: '1.5' }}
                    >
                      {resolutionReason || adminNote || '—'}
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Document your reasoning for this action.."
                    className="rounded-lg border px-2 py-3 outline-none font-montserrat text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-[#0067DE] transition-colors"
                    style={{
                      height: '133px',
                      borderColor: '#D9D9D9',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      resize: 'none',
                    }}
                  />
                )}
              </div>

              {/* Confirm button — a resolved case has nothing left to confirm */}
              {!isResolved && (
                <>
                  {submitError && (
                    <p className="font-montserrat text-[#C20A0A]" style={{ fontSize: '14px', width: '288px' }}>
                      {submitError}
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={!canConfirm}
                    onClick={confirmDecision}
                    className="rounded-xl flex items-center justify-center gap-2 font-montserrat font-bold transition-colors"
                    style={{
                      height: '56px',
                      width: '288px',
                      fontSize: '18px',
                      backgroundColor: canConfirm ? '#0067DE' : '#D5D4D4',
                      color: canConfirm ? '#FEFEFE' : '#6A6A6A',
                      cursor: canConfirm ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    Confirm Decision
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          navigate('/dispute-resolution')
        }}
      />
    </div>
  )
}
