import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { COMMON_TEXT } from '../../texts'

/**
 * "Filter" / "Filter (3)" for the button. It always takes the room of its longest form, so the
 * button (and the search box beside it) keeps its size as filters are switched on and off.
 */
export function FilterLabel({ count }) {
  return (
    <span className="inline-grid justify-items-center">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {COMMON_TEXT.filterWithCount(99)}
      </span>
      <span className="col-start-1 row-start-1">{COMMON_TEXT.filterWithCount(count)}</span>
    </span>
  )
}

/**
 * A Filter button with a drop-down of on/off options, grouped under headings, and a "Clear all"
 * entry while any option is on. It closes on Esc (focus goes back to the button) or on a click
 * outside.
 *
 * - `renderTrigger(props)` draws the button; spread `props` onto it (click, aria-expanded…).
 * - `sections`: [{ heading?, options: [{ key, label, checked, onToggle, tone?, separated? }] }]
 *   `tone: 'danger'` paints an option red; `separated` draws a rule above it.
 * - `onClear` turns every option off.
 */
export default function FilterMenu({ renderTrigger, sections, onClear }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const anyChecked = sections.some((section) => section.options.some((option) => option.checked))

  useEffect(() => {
    if (!open) return
    function onKeyDown(event) {
      if (event.key !== 'Escape') return
      setOpen(false)
      rootRef.current?.querySelector('button')?.focus()
    }
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      {renderTrigger({
        type: 'button',
        onClick: () => setOpen((v) => !v),
        'aria-expanded': open,
        'aria-haspopup': 'true',
      })}

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 flex min-w-[240px] flex-col gap-2 rounded-xl border border-line bg-white p-3 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
          {sections.map((section, index) => (
            <div key={section.heading ?? index} className="contents">
              {section.heading && (
                <span className="px-1 text-[12px] font-semibold text-muted">{section.heading}</span>
              )}
              {section.options.map((option) => {
                const danger = option.tone === 'danger'
                return (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={option.checked}
                    onClick={option.onToggle}
                    className={`flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-gray-50 ${
                      option.separated ? 'border-t border-line' : ''
                    }`}
                  >
                    <span
                      className={`text-[14px] ${option.checked ? 'font-semibold' : 'font-medium'} ${
                        danger ? 'text-danger' : option.checked ? 'text-primary' : 'text-ink'
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.checked && (
                      <Check
                        className={`h-4 w-4 ${danger ? 'text-danger' : 'text-primary'}`}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          ))}

          {anyChecked && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-2 py-2 text-left text-[14px] font-semibold text-muted hover:bg-gray-50"
            >
              {COMMON_TEXT.clearAll}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
