/** A copy of `list` with `item` removed if it was there, or added at the end if it wasn't. */
export function toggleItem(list, item) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}
