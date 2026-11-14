import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useClientPagination } from './useClientPagination'

const items = Array.from({ length: 25 }, (_, i) => i + 1)

describe('useClientPagination', () => {
  it('slices the current page and counts pages', () => {
    const { result } = renderHook(() => useClientPagination(items, 10))
    expect(result.current.totalPages).toBe(3)
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    act(() => result.current.setPage(3))
    expect(result.current.pageItems).toEqual([21, 22, 23, 24, 25])
  })

  it('keeps the page inside 1..totalPages', () => {
    const { result } = renderHook(() => useClientPagination(items, 10))
    act(() => result.current.setPage(99))
    expect(result.current.page).toBe(3)
    act(() => result.current.setPage(0))
    expect(result.current.page).toBe(1)
  })

  it('returns to page 1 when the page size changes', () => {
    const { result } = renderHook(() => useClientPagination(items, 10))
    act(() => result.current.setPage(2))
    act(() => result.current.setPerPage(20))
    expect(result.current.page).toBe(1)
    expect(result.current.totalPages).toBe(2)
  })

  it('clamps when the list shrinks under the current page', () => {
    const { result, rerender } = renderHook(({ list }) => useClientPagination(list, 10), {
      initialProps: { list: items },
    })
    act(() => result.current.setPage(3))
    rerender({ list: items.slice(0, 5) })
    expect(result.current.page).toBe(1)
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5])
  })

  it('reports one page for an empty list', () => {
    const { result } = renderHook(() => useClientPagination([], 10))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.pageItems).toEqual([])
  })
})
