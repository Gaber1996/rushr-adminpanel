import { BASE_URL } from '../config/api'

const PDF_MIME_TYPE = 'application/pdf'

/** The protected file endpoint for a document's storage key ("uploads/pro-documents/x.png"). */
export function getDocumentFileUrl(fileUrl) {
  return `${BASE_URL}/api/files/${fileUrl.replace('uploads/', '')}`
}

export function isPdfDocument(mimeType) {
  return mimeType === PDF_MIME_TYPE
}

/**
 * Downloads a verification document and returns a local object URL to show it.
 *
 * /api/files rejects requests without the admin token, and an <img src> can't send one, so the
 * file is fetched with the token. A PDF is re-typed as application/pdf so the browser renders it
 * in its PDF viewer instead of downloading it. The caller must URL.revokeObjectURL(url) when done.
 *
 * @param {string} fileUrl document storage key from the API
 * @param {string} [mimeType] document mimeType from the API, e.g. "application/pdf"
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ url: string, isPdf: boolean }>}
 */
export async function loadDocumentFile(fileUrl, mimeType, signal) {
  const res = await fetch(getDocumentFileUrl(fileUrl), {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    signal,
  })
  if (!res.ok) throw new Error(`File request failed (${res.status})`)
  const blob = await res.blob()
  const isPdf = isPdfDocument(mimeType) || isPdfDocument(blob.type)
  const file = isPdf ? new Blob([blob], { type: PDF_MIME_TYPE }) : blob
  return { url: URL.createObjectURL(file), isPdf }
}
