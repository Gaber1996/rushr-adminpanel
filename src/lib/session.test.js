import { describe, expect, it } from 'vitest'
import { clearSession, getToken, getUser, isLoggedIn, saveSession } from './session'
import { fakeJwt } from '../test/jwt'

const NOW = Date.UTC(2026, 10, 11)

describe('session', () => {
  it('stores and clears the token and user together', () => {
    saveSession({ token: 'abc', firstName: 'Mona', role: 'ADMIN' })
    expect(getToken()).toBe('abc')
    expect(getUser()).toMatchObject({ firstName: 'Mona', role: 'ADMIN' })

    clearSession()
    expect(getToken()).toBeNull()
    expect(getUser()).toEqual({})
  })

  it('treats a corrupt stored user as no user', () => {
    localStorage.setItem('user', '{not json')
    expect(getUser()).toEqual({})
  })

  it('is logged out with no token', () => {
    expect(isLoggedIn(NOW)).toBe(false)
  })

  it('is logged in with a token that has not expired', () => {
    localStorage.setItem('token', fakeJwt({ exp: NOW / 1000 + 60 }))
    expect(isLoggedIn(NOW)).toBe(true)
  })

  it('is logged out once the token has expired', () => {
    localStorage.setItem('token', fakeJwt({ exp: NOW / 1000 - 60 }))
    expect(isLoggedIn(NOW)).toBe(false)
  })

  it('trusts an opaque token it cannot read an expiry from', () => {
    localStorage.setItem('token', 'opaque-token')
    expect(isLoggedIn(NOW)).toBe(true)
  })
})
