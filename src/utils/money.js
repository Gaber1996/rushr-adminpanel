// Money display and input. The API sends payment totals in dollars and resolutions in cents.

/** "$120.00" from a dollar amount; '—' when missing. */
export function formatMoney(amount) {
  if (amount == null) return '—'
  return `$${Number(amount).toFixed(2)}`
}

/** "$120.00" from cents, for pre-filling an input; '' when missing. */
export function centsToMoney(cents) {
  if (cents == null) return ''
  return `$${(cents / 100).toFixed(2)}`
}

/** Cents from what an admin typed: "$120.00", "120", "120.5". Null when blank or unparseable. */
export function moneyToCents(input) {
  const cleaned = String(input ?? '')
    .replace(/[^0-9.]/g, '')
    .trim()
  if (!cleaned) return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? Math.round(value * 100) : null
}
