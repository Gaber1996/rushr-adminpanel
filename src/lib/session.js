// The one place that knows how the admin session is stored. Everything else asks this module.

const TOKEN_KEY = 'token'
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

/** Reads the JWT `exp` claim (seconds). Null when the token is not a JWT or has no expiry. */
function tokenExpiry(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

/** True when a token is stored and, if it carries an expiry, that expiry is still in the future. */
export function isLoggedIn(now = Date.now()) {
  const token = getToken()
  if (!token) return false
  const expiry = tokenExpiry(token)
  return expiry === null || expiry > now
}

export function saveSession(user) {
  localStorage.setItem(TOKEN_KEY, user.token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
