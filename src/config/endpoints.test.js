import { describe, expect, it } from 'vitest'
import { ENDPOINTS } from './endpoints'

describe('endpoints', () => {
  it('converts the 1-based page to the API 0-based index and adds search only when set', () => {
    expect(ENDPOINTS.disputesPage({ page: 1, size: 10 })).toBe(
      '/api/admin/disputes/paged?page=0&size=10'
    )
    expect(ENDPOINTS.disputesPage({ page: 3, size: 20, search: 'Sara Ali' })).toBe(
      '/api/admin/disputes/paged?page=2&size=20&search=Sara+Ali'
    )
  })

  it('maps a storage key to the file endpoint', () => {
    expect(ENDPOINTS.file('uploads/pro-documents/x.png')).toBe('/api/files/pro-documents/x.png')
    expect(ENDPOINTS.file('other/uploads/x.png')).toBe('/api/files/other/uploads/x.png')
  })
})
