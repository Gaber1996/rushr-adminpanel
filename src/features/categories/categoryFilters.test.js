import { describe, expect, it } from 'vitest'
import { filterCategories, issueTypeOptions, NO_ISSUE_TYPES } from './categoryFilters'

const NOW = new Date('2026-11-14T12:00:00Z').getTime()
const daysAgo = (n) => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString()

const CATEGORIES = [
  { id: 1, name: 'Plumbing', active: true, issueTypes: ['Leak', 'Clog'], updatedAt: daysAgo(2) },
  { id: 2, name: 'Cleaning', active: true, issueTypes: [], updatedAt: daysAgo(20) },
  { id: 3, name: 'Electric', active: true, issueTypes: ['Outage'], updatedAt: daysAgo(90) },
  { id: 4, name: 'Old', active: false, issueTypes: ['Leak'], updatedAt: daysAgo(1) },
]
const ids = (list) => list.map((c) => c.id)

describe('issueTypeOptions', () => {
  it('lists every issue type of the active categories once, sorted', () => {
    const withInactive = [
      ...CATEGORIES,
      { id: 5, name: 'Gone', active: false, issueTypes: ['Mold'] },
    ]
    expect(issueTypeOptions(withInactive)).toEqual(['Clog', 'Leak', 'Outage'])
  })
})

describe('filterCategories', () => {
  it('shows only active categories, matched by name', () => {
    expect(ids(filterCategories(CATEGORIES, {}, NOW))).toEqual([1, 2, 3])
    expect(ids(filterCategories(CATEGORIES, { search: ' clean ' }, NOW))).toEqual([2])
  })

  it('keeps categories with any of the chosen issue types, or none for NO_ISSUE_TYPES', () => {
    expect(ids(filterCategories(CATEGORIES, { issueTypes: ['Leak', 'Outage'] }, NOW))).toEqual([
      1, 3,
    ])
    expect(ids(filterCategories(CATEGORIES, { issueTypes: [NO_ISSUE_TYPES] }, NOW))).toEqual([2])
  })

  it('keeps categories updated within the chosen number of days', () => {
    expect(ids(filterCategories(CATEGORIES, { updatedWithinDays: 7 }, NOW))).toEqual([1])
    expect(ids(filterCategories(CATEGORIES, { updatedWithinDays: 30 }, NOW))).toEqual([1, 2])
  })

  it('needs every filter that is on to match', () => {
    const result = filterCategories(
      CATEGORIES,
      { issueTypes: [NO_ISSUE_TYPES, 'Outage'], updatedWithinDays: 30 },
      NOW
    )
    expect(ids(result)).toEqual([2])
  })
})
