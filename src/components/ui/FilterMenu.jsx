import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { COMMON_TEXT } from '../../texts'
import { toggleItem } from '../../utils/list'

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
 * FilterMenu options for a pick-any-of list: one option per value, checked when it is in
 * `selected`. Toggling calls `onChange` with an updater (`list => newList`), so it can be a
 * state setter and quick clicks never work from a stale list.
 */
export function multiSelectOptions(values, selected, onChange, labelOf = (value) => value) {
  return values.map((value) => ({
    key: value,
    label: labelOf(value),
    checked: selected.includes(value),
    onToggle: () => onChange((list) => toggleItem(list, value)),
  }))
}

/** Gap between the button and the panel, in px. */
const PANEL_GAP = 8

/**
 * A Filter button with a drop-down of on/off options, grouped under headings, and a "Clear all"
 * entry while any option is on. The drop-down is a native popover: the browser closes it on Esc
 * (focus goes back to the button) or on a click outside. Here it is only placed under the button,
 * right edges lined up.
 *
 * - `renderTrigger(props)` draws the button; spread `props` onto it (ref, popover target, aria…).
 * - `sections`: [{ heading?, options: [{ key, label, checked, onToggle, tone?, separated? }] }]
 *   `tone: 'danger'` paints an option red; `separated` draws a rule above it.
 * - `onClear` turns every option off.
 */
export default function FilterMenu({ renderTrigger, sections, onClear }) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const anyChecked = sections.some((section) => section.options.some((option) => option.checked))

  // Puts the panel under the button, right edges lined up (the popover is position: fixed).
  const place = useCallback(() => {
    const button = triggerRef.current.getBoundingClientRect()
    panelRef.current.style.top = `${button.bottom + PANEL_GAP}px`
    panelRef.current.style.right = `${window.innerWidth - button.right}px`
  }, [])

  // Place it just before the browser shows it (so it never appears elsewhere first), and follow
  // the browser's open/closed state.
  useEffect(() => {
    const panel = panelRef.current
    const onBeforeToggle = (event) => {
      if (event.newState === 'open') place()
    }
    const onToggle = (event) => setOpen(event.newState === 'open')
    panel.addEventListener('beforetoggle', onBeforeToggle)
    panel.addEventListener('toggle', onToggle)
    return () => {
      panel.removeEventListener('beforetoggle', onBeforeToggle)
      panel.removeEventListener('toggle', onToggle)
    }
  }, [place])

  // While open, keep it under the button as the page scrolls or resizes.
  useEffect(() => {
    if (!open) return
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place])

  return (
    <div className="shrink-0">
      {renderTrigger({
        ref: triggerRef,
        type: 'button',
        popoverTarget: panelId,
        'aria-haspopup': 'true',
        'aria-expanded': open,
      })}

      {/* No display class on the popover itself: the browser hides it while closed. */}
      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        className="m-0 min-w-[240px] rounded-xl border border-line bg-white p-3 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] [inset:auto]"
      >
        {open && (
          <div className="flex flex-col gap-2">
            {sections.map((section, index) => (
              <div key={section.heading ?? index} className="contents">
                {section.heading && (
                  <span className="px-1 text-[12px] font-semibold text-muted">
                    {section.heading}
                  </span>
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
    </div>
  )
}
