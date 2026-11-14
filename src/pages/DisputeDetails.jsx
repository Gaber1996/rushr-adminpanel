import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { User, Briefcase, AlertCircle, Clock, MapPin, CreditCard } from 'lucide-react'
import { apiRequest } from '../config/api'
import { getDocumentFileUrl } from '../utils/documentFile'
import { useApiResource } from '../hooks/useApiResource'
import { ROUTES } from '../config/routes'
import { ENDPOINTS } from '../config/endpoints'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import DisputeDetailsSkeleton, {
  DisputeStatusSkeleton,
} from '../features/disputes/DisputeDetailsSkeleton'
import PageHeader from '../components/ui/PageHeader'
import DisputeStatusBadge, { isResolvedStatus } from '../features/disputes/DisputeStatusBadge'
import {
  ACTION_BY_OUTCOME,
  OUTCOME_BY_ACTION,
  buildActions,
  CUSTOM_SPLIT,
} from '../features/disputes/disputeActions'
import { distanceLine, placeLine } from '../features/disputes/eventLines'
import CollapsibleCard, { InfoLine } from '../features/disputes/CollapsibleCard'
import Timeline from '../features/disputes/Timeline'
import LocationItem from '../features/disputes/LocationItem'
import PaymentRow from '../features/disputes/PaymentRow'
import SuccessModal from '../features/disputes/SuccessModal'
import BackLink from '../components/ui/BackLink'
import ResolutionPanel from '../features/disputes/ResolutionPanel'
import { formatDateTime, formatTime, parseDate } from '../utils/format'
import { centsToMoney, formatMoney, moneyToCents } from '../utils/money'
import { COMMON_TEXT, DISPUTES_TEXT } from '../texts'

const TEXT = DISPUTES_TEXT.details

/** Media comes back as a storage key ("uploads/<file>"), served from /api/files. */
function mediaUrl(filePath) {
  if (!filePath) return null
  if (/^https?:\/\//i.test(filePath)) return filePath
  return getDocumentFileUrl(filePath)
}

export default function DisputeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: dispute,
    loading,
    error,
    reload,
  } = useApiResource(ENDPOINTS.dispute(id), {
    errorMessage: TEXT.loadError,
  })

  const [selectedAction, setSelectedAction] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [consumerRefund, setConsumerRefund] = useState('')
  const [proRefund, setProRefund] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // A resolved case replays the decision the admin already made.
  useEffect(() => {
    if (!dispute) return
    const resolution = dispute.resolution
    setSelectedAction(resolution ? (ACTION_BY_OUTCOME[resolution.outcome] ?? null) : null)
    setAdminNote(resolution?.reason ?? '')
    setConsumerRefund(centsToMoney(resolution?.refundAmountCents))
    setProRefund(centsToMoney(resolution?.proAmountCents))
  }, [dispute])

  // Title and back arrow; the case line and status badge fill in once the case arrives.
  const header = (subtitle, status) => (
    <PageHeader
      title={TEXT.title}
      titleTone="ink"
      onBack={() => navigate(ROUTES.disputeResolution)}
      textGapClassName="gap-3"
      subtitleClassName="text-base font-semibold leading-4 text-muted"
      subtitle={subtitle}
      actions={status}
    />
  )

  // First load only — a reload keeps the case on screen.
  if (loading && !dispute) {
    return (
      <div className="flex flex-col gap-8">
        {header(<Skeleton className="h-4 w-64" />, <DisputeStatusSkeleton />)}
        <DisputeDetailsSkeleton />
      </div>
    )
  }

  if (error || !dispute) {
    return (
      <div className="flex flex-col items-start gap-4">
        <BackLink onClick={() => navigate(ROUTES.disputeResolution)} />
        <p className="text-danger">{error || TEXT.notFound}</p>
        <Button variant="secondary" size="sm" onClick={reload}>
          {COMMON_TEXT.tryAgain}
        </Button>
      </div>
    )
  }

  const isResolved = isResolvedStatus(dispute.status)
  const payment = dispute.paymentDetails
  const totalPaid = formatMoney(payment?.totalPaid)
  const totalPaidCents = payment?.totalPaidCents ?? null
  // Falls back to the standard 88% only if the API did not send the exact payout.
  const proNetCents =
    payment?.proNetCents ?? (totalPaidCents != null ? Math.round(totalPaidCents * 0.88) : null)
  const actions = buildActions(
    totalPaid,
    formatMoney(proNetCents != null ? proNetCents / 100 : null)
  )
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
        return {
          label: step.label,
          time: formatTime(derived) ?? COMMON_TEXT.emptyValue,
          recorded: true,
        }
      }
    }
    return {
      label: step.label,
      time: step.recorded
        ? (formatTime(step.timestamp) ?? COMMON_TEXT.emptyValue)
        : COMMON_TEXT.emptyValue,
      recorded: !!step.recorded,
    }
  })

  const locationItems = (dispute.locationHistory ?? []).map((event) => {
    const arrived = event.label === 'Arrived At Location'
    const time = formatTime(event.timestamp)
    const caption = arrived ? TEXT.nearDestination : event.note || TEXT.tripStarted
    return {
      title: event.label,
      subtitle: time ? TEXT.locationSubtitle(time, caption) : caption,
      address: arrived ? distanceLine(event) : (placeLine(event) ?? jobAddress ?? ''),
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
  if (outcome === CUSTOM_SPLIT) {
    if (overTotal) splitError = TEXT.splitOverTotal(totalPaid)
    else if (consumerCents != null && proCents != null && !splitBalanced) {
      splitError = TEXT.splitUnbalanced(totalPaid)
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
    (outcome !== CUSTOM_SPLIT || splitBalanced) &&
    !submitting

  async function confirmDecision() {
    setSubmitting(true)
    setSubmitError(null)
    const body = { outcome, reason: adminNote.trim() }
    // Only a custom split carries amounts; an even SPLIT is worked out server-side.
    if (outcome === CUSTOM_SPLIT) {
      body.refundAmountCents = consumerCents
      body.proAmountCents = proCents
    }
    try {
      const res = await apiRequest(ENDPOINTS.resolveDispute(id), {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!res?.success) throw new Error(res?.message || TEXT.resolveError)
      setSuccessOpen(true)
    } catch (err) {
      setSubmitError(err.message || TEXT.resolveError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header row */}
      {header(
        TEXT.caseSubtitle(dispute.caseId, formatDateTime(dispute.createdAt)),
        <DisputeStatusBadge status={dispute.status} />
      )}

      {/* Main grid: left content + right resolution actions */}
      <div className="flex flex-col items-start gap-6 wide:flex-row">
        {/* Left column */}
        <div className="flex w-full flex-col gap-6 wide:w-[716px]">
          {/* Customer Info */}
          <CollapsibleCard
            icon={<User className="h-6 w-6 text-ink" />}
            title={TEXT.customerInfoTitle}
          >
            <div className="flex flex-col gap-4">
              <InfoLine>
                {TEXT.customerNameLabel}
                {dispute.customerInfo?.name || COMMON_TEXT.emptyValue}
              </InfoLine>
              <InfoLine>
                {TEXT.phoneLabel}
                {dispute.customerInfo?.phone || COMMON_TEXT.emptyValue}
              </InfoLine>
              <InfoLine>
                {TEXT.locationLabel}
                {dispute.customerInfo?.location || COMMON_TEXT.emptyValue}
              </InfoLine>
            </div>
          </CollapsibleCard>

          {/* Pro Info */}
          <CollapsibleCard
            icon={<Briefcase className="h-6 w-6 text-ink" />}
            title={TEXT.proInfoTitle}
          >
            <div className="flex flex-col gap-4">
              {dispute.proInfo ? (
                <>
                  <InfoLine>
                    {TEXT.proNameLabel}
                    {dispute.proInfo.name || COMMON_TEXT.emptyValue}
                  </InfoLine>
                  <InfoLine>
                    {TEXT.phoneLabel}
                    {dispute.proInfo.phone || COMMON_TEXT.emptyValue}
                  </InfoLine>
                  <InfoLine>
                    {TEXT.locationLabel}
                    {dispute.proInfo.location || COMMON_TEXT.emptyValue}
                  </InfoLine>
                </>
              ) : (
                <InfoLine>{TEXT.noPro}</InfoLine>
              )}
            </div>
          </CollapsibleCard>

          {/* Dispute Details */}
          <CollapsibleCard
            icon={<AlertCircle className="h-6 w-6 text-ink" />}
            title={TEXT.disputeDetailsTitle}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p
                  className="font-semibold text-muted"
                  style={{ fontSize: '14px', lineHeight: '14px' }}
                >
                  {TEXT.serviceIdPrefix}
                  {dispute.disputeDetails?.serviceRequestId ?? dispute.serviceRequestId}
                </p>
                <p
                  className="font-semibold text-muted"
                  style={{ fontSize: '14px', lineHeight: '14px' }}
                >
                  {TEXT.casePrefix}
                  {dispute.disputeDetails?.caseId ?? dispute.caseId}
                </p>
                <p
                  className="font-medium text-ink"
                  style={{ fontSize: '20px', lineHeight: '20px' }}
                >
                  {dispute.disputeDetails?.reason || COMMON_TEXT.emptyValue}
                </p>
              </div>
              {attachments.length > 0 && (
                <div
                  className="flex flex-wrap items-center gap-2 pt-4"
                  style={{ borderTop: '1px solid #D9D9D9' }}
                >
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
                        alt={file.fileName || TEXT.evidenceAlt}
                        className="rounded bg-[#EEEEEE] object-cover"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleCard>

          {/* Service Timeline */}
          <CollapsibleCard
            icon={<Clock className="h-6 w-6 text-ink" />}
            title={TEXT.serviceTimelineTitle}
          >
            <Timeline steps={timelineSteps} />
          </CollapsibleCard>

          {/* Location History */}
          <CollapsibleCard
            icon={<MapPin className="h-6 w-6 text-ink" />}
            title={TEXT.locationHistoryTitle}
          >
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
                <p className="font-semibold text-muted" style={{ fontSize: '16px' }}>
                  {TEXT.noLocation}
                </p>
              )}
            </div>
          </CollapsibleCard>

          {/* Payment Details */}
          <CollapsibleCard
            icon={<CreditCard className="h-6 w-6 text-ink" />}
            title={TEXT.paymentDetailsTitle}
          >
            <div className="flex flex-col rounded-xl border border-line px-3 py-4">
              <PaymentRow label={TEXT.totalPaidLabel} value={totalPaid} isBlue />
              <PaymentRow label={TEXT.methodLabel} value={payment?.method || TEXT.defaultMethod} />
              <PaymentRow
                label={TEXT.chargedAtLabel}
                value={formatTime(payment?.chargedAt) ?? COMMON_TEXT.emptyValue}
              />
              <PaymentRow
                label={TEXT.statusLabel}
                isLast
                value={(() => {
                  // Funds are settled once the case is resolved — show that in green.
                  const isSettled = isResolved || payment?.statusLabel === 'Released'
                  const palette = isSettled
                    ? { bg: '#EFFFF5', border: '#00861D', text: '#00861D' }
                    : { bg: '#FFF4F0', border: '#CB3904', text: '#CB3904' }
                  return (
                    <span
                      className="inline-flex items-center rounded-lg border px-2 py-2 font-semibold"
                      style={{
                        backgroundColor: palette.bg,
                        borderColor: palette.border,
                        color: palette.text,
                        fontSize: '14px',
                      }}
                    >
                      {payment?.statusLabel || COMMON_TEXT.emptyValue}
                    </span>
                  )
                })()}
              />
            </div>
          </CollapsibleCard>
        </div>

        {/* Right column — Resolution Actions */}
        <ResolutionPanel
          actions={actions}
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          isResolved={isResolved}
          consumerRefund={consumerRefund}
          proRefund={proRefund}
          onConsumerRefundChange={(value) => editSplit(value, setConsumerRefund, setProRefund)}
          onProRefundChange={(value) => editSplit(value, setProRefund, setConsumerRefund)}
          splitError={splitError}
          showRecordedNote={showRecordedNote}
          resolutionReason={resolutionReason}
          adminNote={adminNote}
          setAdminNote={setAdminNote}
          submitError={submitError}
          canConfirm={canConfirm}
          submitting={submitting}
          confirmDecision={confirmDecision}
        />
      </div>

      <SuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          navigate(ROUTES.disputeResolution)
        }}
      />
    </div>
  )
}
