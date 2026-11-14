// jsdom has no Popover API. This stand-in copies the parts of the browser's behaviour the app
// relies on (FilterMenu): a [popovertarget] button toggles its popover, `beforetoggle` and
// `toggle` events with `newState` fire, and an open "auto" popover closes on Esc (focus goes
// back to its button) or on a press outside it.

const openPopovers = new Map() // popover element -> the button that opened it

function fire(popover, type, open) {
  const event = new Event(type)
  event.newState = open ? 'open' : 'closed'
  popover.dispatchEvent(event)
}

function setState(popover, open, invoker) {
  if (open === openPopovers.has(popover)) return
  fire(popover, 'beforetoggle', open)
  if (open) openPopovers.set(popover, invoker)
  else openPopovers.delete(popover)
  // jsdom's built-in styles hide every [popover] (it has no :popover-open), so show it by hand.
  popover.style.display = open ? 'block' : ''
  fire(popover, 'toggle', open)
}

export function installPopoverStandIn() {
  if (HTMLElement.prototype.showPopover) return
  HTMLElement.prototype.showPopover = function () {
    setState(this, true, null)
  }
  HTMLElement.prototype.hidePopover = function () {
    setState(this, false)
  }
  HTMLElement.prototype.togglePopover = function () {
    setState(this, !openPopovers.has(this), null)
  }

  document.addEventListener('click', (event) => {
    const invoker = event.target.closest?.('[popovertarget]')
    if (!invoker) return
    const popover = document.getElementById(invoker.getAttribute('popovertarget'))
    if (popover) setState(popover, !openPopovers.has(popover), invoker)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    for (const [popover, invoker] of openPopovers) {
      setState(popover, false)
      invoker?.focus()
    }
  })
  document.addEventListener('pointerdown', (event) => {
    for (const [popover, invoker] of openPopovers) {
      if (!popover.contains(event.target) && !invoker?.contains(event.target)) {
        setState(popover, false)
      }
    }
  })
}

/** Closes anything left open, between tests. */
export function resetPopovers() {
  for (const popover of openPopovers.keys()) popover.style.display = ''
  openPopovers.clear()
}
