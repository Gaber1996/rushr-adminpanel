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
} from 'lucide-react'
import { useDisputes } from '../context/DisputesContext'

// `total` is the dispute's total paid amount, so the copy matches the case on screen.
function buildActions(total) {
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
      subtitle: `Pay ${total} to pro`,
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

// The payment badge the case ends up with, based on how the admin resolved it.
const BADGE_FOR_ACTION = {
  FULL_REFUND: 'Refunded',
  PARTIAL_REFUND: 'Refunded',
  CUSTOM_SPLIT: 'Refunded',
  RELEASE_PAYMENT: 'Released',
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
                style={{ width: '20px', height: '20px', borderColor: '#0067DE' }}
              >
                <span className="block rounded-full" style={{ width: '8px', height: '8px', backgroundColor: '#0067DE' }} />
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
                className="font-montserrat font-bold text-[#0F0F0F]"
                style={{ fontSize: '14px', lineHeight: '14px' }}
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

export default function DisputeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDisputeById, updateDispute } = useDisputes()
  const dispute = getDisputeById(id)

  const isResolved = dispute?.status === 'RESOLVED'

  // A resolved case replays what the admin decided; an open one starts blank.
  const [selectedAction, setSelectedAction] = useState(dispute?.resolutionAction ?? null)
  const [adminNote, setAdminNote] = useState(dispute?.adminNote ?? '')
  const [consumerRefund, setConsumerRefund] = useState(dispute?.consumerRefund ?? '')
  const [proRefund, setProRefund] = useState(dispute?.proRefund ?? '')
  const [successOpen, setSuccessOpen] = useState(false)

  // Switching cases without remounting (e.g. editing the URL) must reload the decision.
  useEffect(() => {
    const next = getDisputeById(id)
    if (next?.status !== 'RESOLVED') return
    setSelectedAction(next.resolutionAction ?? null)
    setAdminNote(next.adminNote ?? '')
    setConsumerRefund(next.consumerRefund ?? '')
    setProRefund(next.proRefund ?? '')
  }, [id, getDisputeById])

  if (!dispute) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/dispute-resolution')}
          className="inline-flex items-center gap-2 font-montserrat font-semibold text-[#0067DE]"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <p className="font-montserrat text-[#6A6A6A]">Dispute not found.</p>
      </div>
    )
  }

  const actions = buildActions(dispute.totalPaid)
  const canConfirm = !!selectedAction && adminNote.trim().length > 0

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
            Case {dispute.id} - {dispute.caseTimestamp}
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
              <InfoLine>Customer Name: {dispute.customer}</InfoLine>
              <InfoLine>Phone Number: {dispute.customerPhone}</InfoLine>
              <InfoLine>Location: {dispute.customerLocation}</InfoLine>
            </div>
          </CollapsibleCard>

          {/* Pro Info */}
          <CollapsibleCard icon={<Briefcase className="w-6 h-6 text-[#0F0F0F]" />} title="Pro Info">
            <div className="flex flex-col gap-4">
              <InfoLine>Pro Name: {dispute.pro}</InfoLine>
              <InfoLine>Phone Number: {dispute.proPhone}</InfoLine>
              <InfoLine>Location: {dispute.proLocation}</InfoLine>
            </div>
          </CollapsibleCard>

          {/* Dispute Details */}
          <CollapsibleCard icon={<AlertCircle className="w-6 h-6 text-[#0F0F0F]" />} title="Dispute Details">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '14px', lineHeight: '14px' }}>
                  Service ID: Ser-{dispute.id.replace('DIS-', '')}
                </p>
                <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '14px', lineHeight: '14px' }}>
                  Case {dispute.id}
                </p>
                <p className="font-montserrat font-medium text-[#0F0F0F]" style={{ fontSize: '20px', lineHeight: '20px' }}>
                  {dispute.description}
                </p>
              </div>
              <div className="flex gap-2 items-center pt-4" style={{ borderTop: '1px solid #D9D9D9' }}>
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="rounded shrink-0 bg-gradient-to-br from-[#9CA3AF] to-[#4B5563] flex items-center justify-center text-white font-montserrat font-semibold"
                    style={{ width: '80px', height: '80px', fontSize: '12px' }}
                  >
                    Photo {n}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleCard>

          {/* Service Timeline */}
          <CollapsibleCard icon={<Clock className="w-6 h-6 text-[#0F0F0F]" />} title="Service Timeline">
            <Timeline steps={dispute.timeline} />
          </CollapsibleCard>

          {/* Location History */}
          <CollapsibleCard icon={<MapPin className="w-6 h-6 text-[#0F0F0F]" />} title="Location History">
            <div className="flex flex-col">
              {dispute.locationHistory.map((item, idx) => (
                <LocationItem
                  key={item.title + idx}
                  item={item}
                  isLast={idx === dispute.locationHistory.length - 1}
                />
              ))}
            </div>
          </CollapsibleCard>

          {/* Payment Details */}
          <CollapsibleCard icon={<CreditCard className="w-6 h-6 text-[#0F0F0F]" />} title="Payment Details">
            <div className="rounded-xl border border-[#D9D9D9] px-3 py-4 flex flex-col">
              <PaymentRow label="Total paid:" value={dispute.totalPaid} isBlue />
              <PaymentRow label="Method:" value={dispute.paymentMethod} />
              <PaymentRow label="Charged at:" value={dispute.chargedAt} />
              <PaymentRow
                label="Status:"
                isLast
                value={(() => {
                  // Funds are settled once the case is resolved — show that in green.
                  const isSettled = isResolved || dispute.paymentBadge === 'Released'
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
                      {dispute.paymentBadge}
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
                              onChange={(e) => setConsumerRefund(e.target.value)}
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
                              onChange={(e) => setProRefund(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              readOnly={isResolved}
                              placeholder="Enter custom amount"
                              className="rounded-lg border bg-white px-2 py-3 outline-none font-montserrat text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-[#0067DE] transition-colors read-only:text-[#6A6A6A]"
                              style={{ borderColor: '#D9D9D9', fontSize: '14px' }}
                            />
                          </div>
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
                {isResolved ? (
                  <div
                    className="rounded-lg border px-2 py-3"
                    style={{ borderColor: '#D9D9D9' }}
                  >
                    <p
                      className="font-montserrat font-normal text-[#6A6A6A]"
                      style={{ fontSize: '14px', lineHeight: '1.5' }}
                    >
                      {adminNote}
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
                <button
                  type="button"
                  disabled={!canConfirm}
                  onClick={() => {
                    updateDispute(dispute.id, {
                      status: 'RESOLVED',
                      paymentBadge: BADGE_FOR_ACTION[selectedAction] ?? 'Released',
                      resolutionAction: selectedAction,
                      adminNote,
                      consumerRefund,
                      proRefund,
                    })
                    setSuccessOpen(true)
                  }}
                  className="rounded-xl flex items-center justify-center font-montserrat font-bold transition-colors"
                  style={{
                    height: '56px',
                    width: '288px',
                    fontSize: '18px',
                    backgroundColor: canConfirm ? '#0067DE' : '#D5D4D4',
                    color: canConfirm ? '#FEFEFE' : '#6A6A6A',
                    cursor: canConfirm ? 'pointer' : 'not-allowed',
                  }}
                >
                  Confirm Decision
                </button>
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
