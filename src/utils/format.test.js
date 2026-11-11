import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime, formatTime, parseDate } from './format'
import { centsToMoney, formatMoney, moneyToCents } from './money'

describe('format', () => {
  it('parses only real dates', () => {
    expect(parseDate('2026-11-01T10:00:00')).toBeInstanceOf(Date)
    expect(parseDate('nonsense')).toBeNull()
    expect(parseDate(null)).toBeNull()
  })

  it('formats dates and falls back to a dash', () => {
    expect(formatDate('2026-11-01T10:00:00')).toBe('Nov 1, 2026')
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('nonsense')).toBe('—')
  })

  it('formats times, or null when missing', () => {
    expect(formatTime('2026-11-01T14:45:00')).toBe('02:45 PM')
    expect(formatTime(null)).toBeNull()
  })

  it('says "Today" for a time on the same day', () => {
    const now = new Date('2026-11-01T18:00:00')
    expect(formatDateTime('2026-11-01T11:30:00', now)).toBe('Today, 11:30 AM')
    expect(formatDateTime('2024-07-07T11:30:00', now)).toBe('Jul 7, 2024, 11:30 AM')
    expect(formatDateTime(null, now)).toBe('—')
  })
})

describe('money', () => {
  it('formats dollars and cents', () => {
    expect(formatMoney(120)).toBe('$120.00')
    expect(formatMoney(null)).toBe('—')
    expect(centsToMoney(12050)).toBe('$120.50')
    expect(centsToMoney(undefined)).toBe('')
  })

  it('reads what an admin typed', () => {
    expect(moneyToCents('$120.00')).toBe(12000)
    expect(moneyToCents('120.5')).toBe(12050)
    expect(moneyToCents('0.1')).toBe(10)
    expect(moneyToCents('')).toBeNull()
    expect(moneyToCents('abc')).toBeNull()
  })
})
