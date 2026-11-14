import { describe, expect, it } from 'vitest'
import { matchesSearch } from './search'

describe('matchesSearch', () => {
  it('matches everything when the search is empty or only spaces', () => {
    expect(matchesSearch('', ['Sara'])).toBe(true)
    expect(matchesSearch('   ', [])).toBe(true)
  })

  it('ignores case and surrounding spaces', () => {
    expect(matchesSearch('  SARA ', ['Sara Ahmed'])).toBe(true)
  })

  it('matches any of the fields', () => {
    expect(matchesSearch('plumb', ['Ali', 'Plumbing'])).toBe(true)
    expect(matchesSearch('xyz', ['Ali', 'Plumbing'])).toBe(false)
  })

  it('never matches a missing field, so "null" finds nothing', () => {
    expect(matchesSearch('null', [null, undefined])).toBe(false)
  })
})
