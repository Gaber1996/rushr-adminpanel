import { useEffect, useRef } from 'react'

/**
 * A modal on the native <dialog>: the browser traps focus, Esc closes it, focus returns to the
 * opener on close, and the page behind is inert. With `dismissOnBackdrop`, a click that both starts
 * and ends on the dimmed backdrop (outside the panel) also closes it — a text selection dragged out
 * of a field does not.
 *
 * The <dialog> stays mounted so the browser can close it properly; `children` mount only while
 * open, so forms inside start fresh each time. `className` sizes and colours the panel.
 * (`m-auto` restores the dialog's centring, which the global `* { margin: 0 }` reset removes.)
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  dismissOnBackdrop = true,
  backdropClassName = 'backdrop:bg-black/40',
  className = '',
  children,
}) {
  const ref = useRef(null)
  const pressStartedOutside = useRef(false)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const isOutsidePanel = (e) => {
    const r = ref.current.getBoundingClientRect()
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom
  }

  return (
    // Pointer handlers only detect backdrop clicks; the keyboard close is the native Esc (onCancel).
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // Closed by anything else (e.g. a form with method="dialog"): tell the parent.
      onClose={() => {
        if (open) onClose()
      }}
      onPointerDown={(e) => {
        pressStartedOutside.current = isOutsidePanel(e)
      }}
      onPointerUp={(e) => {
        if (dismissOnBackdrop && pressStartedOutside.current && isOutsidePanel(e)) onClose()
        pressStartedOutside.current = false
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto p-0 shadow-xl ${backdropClassName} ${className}`}
    >
      {open && children}
    </dialog>
  )
}
