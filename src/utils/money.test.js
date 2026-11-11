import { describe, expect, it } from 'vitest'
import { centsToMoney, formatMoney, moneyToCents } from './money'

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
