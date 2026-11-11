// Right-hand "Resolution Actions" panel: outcome cards, custom split fields, admin note and confirm button.
import { CUSTOM_SPLIT } from './disputeActions'
import { Loader2 } from 'lucide-react'
import { COMMON_TEXT, DISPUTES_TEXT } from '../../texts'

const TEXT = DISPUTES_TEXT.details

export default function ResolutionPanel({
  actions,
  selectedAction,
  setSelectedAction,
  isResolved,
  consumerRefund,
  proRefund,
  onConsumerRefundChange,
  onProRefundChange,
  splitError,
  showRecordedNote,
  resolutionReason,
  adminNote,
  setAdminNote,
  submitError,
  canConfirm,
  submitting,
  confirmDecision,
}) {
  return (
    <div className="w-full rounded-3xl bg-surface-muted px-4 py-6 wide:w-[320px]">
      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-ink" style={{ fontSize: '20px', lineHeight: '20px' }}>
          {TEXT.resolutionActionsTitle}
        </h3>
        <div className="flex flex-col gap-4">
          {actions.map((action) => {
            const isSelected = selectedAction === action.key
            const isCustom = action.key === CUSTOM_SPLIT
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
                className={`w-full rounded-lg border px-2 py-3 text-left transition-colors wide:w-[288px] ${
                  interactive ? 'cursor-pointer' : 'cursor-default'
                }`}
                style={{
                  backgroundColor: isSelected ? action.selectedBg : '#EEEEEE',
                  borderColor: isSelected ? action.selectedBorder : '#D9D9D9',
                }}
              >
                <div className="flex flex-col gap-2">
                  <span
                    className="font-semibold text-ink"
                    style={{ fontSize: '16px', lineHeight: '16px' }}
                  >
                    {action.title}
                  </span>
                  {action.subtitle && (
                    <span
                      className="font-medium text-muted"
                      style={{ fontSize: '14px', lineHeight: '14px' }}
                    >
                      {action.subtitle}
                    </span>
                  )}

                  {isCustom && isSelected && (
                    <div className="mt-2 flex w-full flex-col gap-4 wide:w-[272px]">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="consumer-refund"
                          className="font-semibold text-ink"
                          style={{ fontSize: '14px', lineHeight: '14px' }}
                        >
                          {TEXT.consumerRefundLabel}
                        </label>
                        <input
                          id="consumer-refund"
                          type="text"
                          value={consumerRefund}
                          onChange={(e) => onConsumerRefundChange(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          readOnly={isResolved}
                          placeholder={TEXT.customAmountPlaceholder}
                          className="rounded-lg border bg-white px-2 py-3 text-ink outline-none transition-colors placeholder:text-muted read-only:text-muted focus:border-primary"
                          style={{ borderColor: '#D9D9D9', fontSize: '14px' }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="pro-refund"
                          className="font-semibold text-ink"
                          style={{ fontSize: '14px', lineHeight: '14px' }}
                        >
                          {TEXT.proRefundLabel}
                        </label>
                        <input
                          id="pro-refund"
                          type="text"
                          value={proRefund}
                          onChange={(e) => onProRefundChange(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          readOnly={isResolved}
                          placeholder={TEXT.customAmountPlaceholder}
                          className="rounded-lg border bg-white px-2 py-3 text-ink outline-none transition-colors placeholder:text-muted read-only:text-muted focus:border-primary"
                          style={{ borderColor: '#D9D9D9', fontSize: '14px' }}
                        />
                      </div>
                      {splitError && (
                        <p
                          className="font-medium text-danger"
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
          <div className="flex w-full flex-col gap-3 wide:w-[288px]">
            <label
              htmlFor="admin-note"
              className="font-medium text-ink"
              style={{ fontSize: '16px', lineHeight: '16px' }}
            >
              {TEXT.adminNoteLabel}
              <span className="text-danger">{COMMON_TEXT.requiredMark}</span>
            </label>
            {showRecordedNote ? (
              <div className="rounded-lg border px-2 py-3" style={{ borderColor: '#D9D9D9' }}>
                <p
                  className="font-normal text-muted"
                  style={{ fontSize: '14px', lineHeight: '1.5' }}
                >
                  {resolutionReason || adminNote || COMMON_TEXT.emptyValue}
                </p>
              </div>
            ) : (
              <textarea
                id="admin-note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={TEXT.adminNotePlaceholder}
                className="rounded-lg border px-2 py-3 text-ink outline-none transition-colors placeholder:text-muted focus:border-primary"
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
                <p className="w-full text-danger wide:w-[288px]" style={{ fontSize: '14px' }}>
                  {submitError}
                </p>
              )}
              <button
                type="button"
                disabled={!canConfirm}
                onClick={confirmDecision}
                className="flex w-full items-center justify-center gap-2 rounded-xl font-bold transition-colors wide:w-[288px]"
                style={{
                  height: '56px',
                  fontSize: '18px',
                  backgroundColor: canConfirm ? '#0067DE' : '#D5D4D4',
                  color: canConfirm ? '#FEFEFE' : '#6A6A6A',
                  cursor: canConfirm ? 'pointer' : 'not-allowed',
                }}
              >
                {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                {TEXT.confirmDecision}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
