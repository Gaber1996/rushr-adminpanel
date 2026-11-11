import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../config/api'

/** The server answered but said no (`success: false`); its message is meant for the admin. */
class ApiRejection extends Error {}

/**
 * Loads one GET endpoint and tracks it: `{ data, loading, error, reload }`.
 *
 * - Changing `endpoint` or calling `reload()` refetches; a request that is superseded or whose
 *   component unmounts is aborted and never touches state.
 * - Error text: the server's `message`, else `errorMessage`. A network failure shows
 *   `networkErrorMessage` when given, else the thrown message, else `errorMessage`.
 */
export function useApiResource(endpoint, { errorMessage = '', networkErrorMessage } = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: '' }))

    apiRequest(endpoint, { signal: controller.signal })
      .then((res) => {
        if (!res?.success) throw new ApiRejection(res?.message || errorMessage)
        if (!controller.signal.aborted) setState({ data: res.data, loading: false, error: '' })
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        const error =
          err instanceof ApiRejection
            ? err.message
            : (networkErrorMessage ?? (err?.message || errorMessage))
        setState({ data: null, loading: false, error })
      })

    return () => controller.abort()
  }, [endpoint, reloadKey, errorMessage, networkErrorMessage])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, reload }
}
