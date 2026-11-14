/**
 * True when the search box text appears in any of the fields (case-insensitive, surrounding
 * spaces ignored). An empty search matches everything; null or missing fields never match.
 */
export function matchesSearch(search, fields) {
  const query = search.trim().toLowerCase()
  if (!query) return true
  return fields.some((field) => field != null && String(field).toLowerCase().includes(query))
}
