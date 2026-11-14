import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../config/api'

/** The server answered but said no (`success: false`); its message is meant for the admin. */
class ApiRejection extends Error {}

/**
 * Loads one GET endpoint and tracks it: `{ data, loading, error, reload, update }`.
 *
 * - A failed reload of the same endpoint keeps its data alongside the error; a failure on a new
 *   endpoint clears the data, so another endpoint's data is never shown with it.
 * - `update(fn)` patches the loaded data in place (`data => newData`), e.g. after a successful
 *   write, so the screen reflects it at once without a refetch.
 * - Changing `endpoint` or calling `reload()` refetches; a request that is superseded or whose
 *   component unmounts is aborted and never touches state.
 * - Error text: the server's `message`, else `errorMessage`. A network failure shows
 *   `networkErrorMessage` when given, else the thrown message, else `errorMessage`.
 */
export function useApiResource(endpoint, { errorMessage = '', networkErrorMessage } = {}) {
  // `source` is the endpoint `data` came from, so a failure never shows another endpoint's data.
  const [state, setState] = useState({ data: null, source: null, loading: true, error: '' })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: '' }))

    apiRequest(endpoint, { signal: controller.signal })
      .then((res) => {
        if (!res?.success) throw new ApiRejection(res?.message || errorMessage)
        if (!controller.signal.aborted)
          setState({ data: res.data, source: endpoint, loading: false, error: '' })
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        const error =
          err instanceof ApiRejection
            ? err.message
            : (networkErrorMessage ?? (err?.message || errorMessage))
        // A failed reload keeps what is on screen; the page decides whether the error replaces it.
        setState((prev) =>
          prev.source === endpoint
            ? { ...prev, loading: false, error }
            : { data: null, source: null, loading: false, error }
        )
      })

    return () => controller.abort()
  }, [endpoint, reloadKey, errorMessage, networkErrorMessage])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  const update = useCallback(
    (fn) => setState((prev) => (prev.data == null ? prev : { ...prev, data: fn(prev.data) })),
    []
  )

  const { data, loading, error } = state
  return { data, loading, error, reload, update }
}
