// "Decision recorded" confirmation modal.
import { useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import { DISPUTES_TEXT } from '../../texts'

const TEXT = DISPUTES_TEXT.details

const SUCCESS_TITLE_ID = 'dispute-success-title'

/** "Decision recorded" confirmation; closes itself after `autoDismissMs`. */
export default function SuccessModal({ open, onClose, autoDismissMs = 2500 }) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, autoDismissMs)
    return () => clearTimeout(timer)
  }, [open, onClose, autoDismissMs])

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={SUCCESS_TITLE_ID}
      backdropClassName="backdrop:bg-black/50"
      className="w-[780px] rounded-[24px] bg-white"
    >
      <div className="flex flex-col items-center px-6 py-10 sm:px-10 sm:py-12">
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="h-28 w-28 sm:h-40 sm:w-40"
        >
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
          id={SUCCESS_TITLE_ID}
          className="mt-8 text-center text-2xl font-extrabold leading-[1.2] text-ink sm:text-[32px]"
        >
          {TEXT.successTitle}
        </h3>
        <p
          className="mt-4 max-w-[600px] text-center font-medium text-muted"
          style={{ fontSize: '18px', lineHeight: '1.5' }}
        >
          {TEXT.successMessage}
        </p>
      </div>
    </Modal>
  )
}
