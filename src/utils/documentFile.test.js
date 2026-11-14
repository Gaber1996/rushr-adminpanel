import { describe, expect, it } from 'vitest'
import { getDocumentFileUrl, isPdfDocument } from './documentFile'
import { BASE_URL } from '../config/api'

describe('documentFile', () => {
  it('maps a storage key to the protected file endpoint', () => {
    expect(getDocumentFileUrl('uploads/pro-documents/x.png')).toBe(
      `${BASE_URL}/api/files/pro-documents/x.png`
    )
  })

  it('recognises only the PDF mime type', () => {
    expect(isPdfDocument('application/pdf')).toBe(true)
    expect(isPdfDocument('image/png')).toBe(false)
    expect(isPdfDocument(undefined)).toBe(false)
  })
})
