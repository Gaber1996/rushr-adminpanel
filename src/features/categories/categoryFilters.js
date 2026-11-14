// The Platform Settings category filters: by issue type and by how recently a category changed.
import { parseDate } from '../../utils/format'
import { matchesSearch } from '../../utils/search'

/** Picks for "categories without any issue type" in the issue-type filter. */
export const NO_ISSUE_TYPES = '__none__'

/** "Last update" choices, in days. */
export const UPDATED_WITHIN_DAYS = [7, 30]

const DAY_MS = 24 * 60 * 60 * 1000

/** Every issue type used by the active categories (the ones listed), sorted, without repeats. */
export function issueTypeOptions(categories) {
  const listed = categories.filter((cat) => cat.active)
  const types = new Set(listed.flatMap((cat) => cat.issueTypes ?? []))
  return [...types].sort((a, b) => a.localeCompare(b))
}

/**
 * The active categories that match the search (by name) and every filter that is on:
 * - `issueTypes`: has any of the chosen types (or none at all, for NO_ISSUE_TYPES);
 * - `updatedWithinDays`: last updated no longer ago than that (null = any time).
 */
export function filterCategories(
  categories,
  { search = '', issueTypes = [], updatedWithinDays = null },
  now = Date.now()
) {
  return categories.filter((cat) => {
    if (!cat.active || !matchesSearch(search, [cat.name])) return false

    if (issueTypes.length > 0) {
      const own = cat.issueTypes ?? []
      const hit =
        (issueTypes.includes(NO_ISSUE_TYPES) && own.length === 0) ||
        own.some((type) => issueTypes.includes(type))
      if (!hit) return false
    }

    if (updatedWithinDays !== null) {
      const updated = parseDate(cat.updatedAt)
      if (!updated || now - updated.getTime() > updatedWithinDays * DAY_MS) return false
    }

    return true
  })
}
