import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest, BASE_URL } from './api'
import { getToken, saveSession } from '../lib/session'
import { fakeJwt } from '../test/jwt'

const LIVE_TOKEN = fakeJwt({ exp: Date.now() / 1000 + 3600 })
const EXPIRED_TOKEN = fakeJwt({ exp: Date.now() / 1000 - 3600 })

function respond(status, body, contentType = 'application/json') {
  const text = typeof body === 'string' ? body : JSON.stringify(body)
  return Promise.resolve(new Response(text, { status, headers: { 'Content-Type': contentType } }))
}

describe('apiRequest', () => {
  let assign

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, assign })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the bearer token and JSON content type', async () => {
    saveSession({ token: LIVE_TOKEN })
    fetch.mockReturnValue(respond(200, { success: true, data: 1 }))

    await expect(apiRequest('/api/x', { method: 'POST' })).resolves.toEqual({
      success: true,
      data: 1,
    })

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(`${BASE_URL}/api/x`)
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      Authorization: `Bearer ${LIVE_TOKEN}`,
      'Content-Type': 'application/json',
    })
  })

  it('marks a non-2xx JSON body as failed and keeps its message', async () => {
    fetch.mockReturnValue(respond(400, { message: 'Name is required' }))
    await expect(apiRequest('/api/x')).resolves.toEqual({
      success: false,
      message: 'Name is required',
    })
  })

  it('turns a body that is not JSON into a failure with no message', async () => {
    fetch.mockReturnValue(respond(502, '<html>Bad Gateway</html>', 'text/html'))
    await expect(apiRequest('/api/x')).resolves.toEqual({ success: false, message: '' })
  })

  it('clears a live session and goes to login on a 401, never settling', async () => {
    saveSession({ token: LIVE_TOKEN })
    fetch.mockReturnValue(respond(401, { success: false, message: 'Unauthorized' }))

    const settled = vi.fn()
    apiRequest('/api/x').then(settled, settled)
    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith(expect.stringMatching(/login$/)))

    expect(getToken()).toBeNull()
    await Promise.resolve()
    expect(settled).not.toHaveBeenCalled()
  })

  it('does not redirect on a 401 from the login form (no session yet)', async () => {
    fetch.mockReturnValue(respond(401, { success: false, message: 'Bad credentials' }))
    await expect(apiRequest('/api/admin/login')).resolves.toMatchObject({
      success: false,
      message: 'Bad credentials',
    })
    expect(assign).not.toHaveBeenCalled()
  })

  it('neither sends nor redirects on an expired token left in storage', async () => {
    saveSession({ token: EXPIRED_TOKEN })
    fetch.mockReturnValue(respond(401, { success: false, message: 'Bad credentials' }))

    await expect(apiRequest('/api/admin/login')).resolves.toMatchObject({
      message: 'Bad credentials',
    })
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined()
    expect(assign).not.toHaveBeenCalled()
  })

  it('rejects when the network fails', async () => {
    fetch.mockImplementation(async () => {
      throw new TypeError('Failed to fetch')
    })
    await expect(apiRequest('/api/x')).rejects.toThrow('Failed to fetch')
  })
})
