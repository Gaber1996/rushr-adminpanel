// The one place that knows how the admin session is stored. Everything else asks this module.

/** localStorage key of the admin's JWT. The start-up skeleton script reads it too. */
export const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/** The signed-in admin as returned by /api/admin/login, or {} when there is none or it is corrupt. */
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) ?? {}
  } catch {
    return {}
  }
}

// tokenExpiry and isTokenLive use nothing outside their own bodies: the build copies their source
// into the start-up skeleton script (build/bootSkeletons.js), which runs before the app loads.

/** Reads the JWT `exp` claim (seconds) as ms. Null when the token is not a JWT or has no expiry. */
export function tokenExpiry(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

/**
 * True for a token that exists and, if it carries an expiry, has not reached it yet.
 * `expiryOf` is tokenExpiry, passed in rather than called directly so this function still works
 * when the start-up script runs a copy of it on its own.
 */
export function isTokenLive(token, now, expiryOf) {
  if (!token) return false
  const expiry = expiryOf(token)
  return expiry === null || expiry > now
}

/** True when a token is stored and, if it carries an expiry, that expiry is still in the future. */
export function isLoggedIn(now = Date.now()) {
  return isTokenLive(getToken(), now, tokenExpiry)
}

export function saveSession(user) {
  localStorage.setItem(TOKEN_KEY, user.token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
