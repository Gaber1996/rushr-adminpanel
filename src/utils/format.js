// Date and time display shared by every page. All return '—' (or null for times) on missing input.

import { COMMON_TEXT } from '../texts/common'

const LOCALE = 'en-US'

/** A Date for any value the API sends, or null when it is missing or unparseable. */
export function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** "Nov 1, 2026" */
export function formatDate(value) {
  const date = parseDate(value)
  if (!date) return COMMON_TEXT.emptyValue
  return date.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' })
}

/** "02:45 PM", or null when there is no time to show. */
export function formatTime(value) {
  const date = parseDate(value)
  if (!date) return null
  return date.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit', hour12: true })
}

/** "Today, 11:30 AM" for today, otherwise "Jul 7, 2024, 11:30 AM". */
export function formatDateTime(value, now = new Date()) {
  const date = parseDate(value)
  if (!date) return COMMON_TEXT.emptyValue
  const time = formatTime(date)
  if (date.toDateString() === now.toDateString()) return COMMON_TEXT.today(time)
  return `${formatDate(date)}, ${time}`
}
