import { clearSession, getToken, isLoggedIn } from '../lib/session'
import { ROUTES } from './routes'

export const BASE_URL = 'https://rusher-back-end-1.onrender.com'

/** Where the app sends the admin when the server rejects their session. */
const LOGIN_PATH = `${import.meta.env.BASE_URL}${ROUTES.login.slice(1)}`

/** Headers every authenticated request needs (none when signed out or the token has expired). */
export function authHeaders() {
  return isLoggedIn() ? { Authorization: `Bearer ${getToken()}` } : {}
}

/**
 * Calls the Rushr API and resolves to a `{ success, data, message }` body, so callers only ever
 * read `res.success` / `res.message`:
 *
 * - A non-2xx response resolves to its JSON body with `success: false`.
 * - A body that is not JSON (an HTML error page from a proxy, an empty 204…) resolves to
 *   `{ success: false, message: '' }`, so each caller shows its own fallback text.
 * - A 401 on a live session means the server has revoked it: the session is cleared, the page
 *   goes to login, and the returned promise never settles, so no caller renders the 401.
 *   (The login form has no live session, so its 401 resolves like any other failure.)
 * - Network failures and aborts reject.
 */
export async function apiRequest(endpoint, options = {}) {
  const hadSession = isLoggedIn()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  })

  if (response.status === 401 && hadSession) {
    clearSession()
    window.location.assign(LOGIN_PATH)
    return new Promise(() => {})
  }

  const body = await response.json().catch(() => null)
  if (body === null || typeof body !== 'object') return { success: false, message: '' }
  return response.ok ? body : { ...body, success: false }
}
