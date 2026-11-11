import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useApiResource } from './useApiResource'
import { apiRequest } from '../config/api'

vi.mock('../config/api', () => ({ apiRequest: vi.fn() }))

describe('useApiResource', () => {
  beforeEach(() => {
    apiRequest.mockReset()
  })

  it('starts loading, then exposes the data', async () => {
    apiRequest.mockResolvedValue({ success: true, data: ['a'] })
    const { result } = renderHook(() => useApiResource('/api/items'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual(['a'])
    expect(result.current.error).toBe('')
  })

  it("shows the server's message, falling back to errorMessage", async () => {
    apiRequest.mockResolvedValueOnce({ success: false, message: 'Nope' })
    const first = renderHook(() => useApiResource('/a', { errorMessage: 'Failed.' }))
    await waitFor(() => expect(first.result.current.error).toBe('Nope'))

    apiRequest.mockResolvedValueOnce({ success: false })
    const second = renderHook(() => useApiResource('/b', { errorMessage: 'Failed.' }))
    await waitFor(() => expect(second.result.current.error).toBe('Failed.'))
  })

  it('uses networkErrorMessage when the request itself fails', async () => {
    apiRequest.mockImplementation(async () => {
      throw new TypeError('Failed to fetch')
    })
    const { result } = renderHook(() =>
      useApiResource('/a', { errorMessage: 'Failed.', networkErrorMessage: 'Offline.' })
    )
    await waitFor(() => expect(result.current.error).toBe('Offline.'))
    expect(result.current.data).toBeNull()
  })

  it('refetches on reload()', async () => {
    apiRequest.mockResolvedValue({ success: true, data: 1 })
    const { result } = renderHook(() => useApiResource('/a'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    apiRequest.mockResolvedValue({ success: true, data: 2 })
    act(() => result.current.reload())
    await waitFor(() => expect(result.current.data).toBe(2))
    expect(apiRequest).toHaveBeenCalledTimes(2)
  })

  it('ignores a response that arrives after the endpoint changed', async () => {
    let resolveOld
    apiRequest
      .mockReturnValueOnce(new Promise((r) => (resolveOld = r)))
      .mockResolvedValueOnce({ success: true, data: 'new' })

    const { result, rerender } = renderHook(({ url }) => useApiResource(url), {
      initialProps: { url: '/old' },
    })
    rerender({ url: '/new' })
    await waitFor(() => expect(result.current.data).toBe('new'))

    await act(async () => resolveOld({ success: true, data: 'old' }))
    expect(result.current.data).toBe('new')
    expect(apiRequest.mock.calls[0][1].signal.aborted).toBe(true)
  })
})
