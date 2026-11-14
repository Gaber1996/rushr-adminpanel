import { describe, expect, it } from 'vitest'
import { toDisputeDetails, toVerificationDetails } from './routes'
import { titleFor } from '../hooks/useDocumentTitle'

describe('routes', () => {
  it('builds detail links', () => {
    expect(toVerificationDetails('c1')).toBe('/pro-verification/c1')
    expect(toDisputeDetails('a b')).toBe('/dispute-resolution/a%20b')
  })

  it('titles each page, including parameterised ones', () => {
    expect(titleFor('/login')).toBe('Sign In | Rushr Admin')
    expect(titleFor('/pro-verification')).toBe('Pro Verification | Rushr Admin')
    expect(titleFor('/pro-verification/c1')).toBe('Verification Details | Rushr Admin')
    expect(titleFor('/dispute-resolution/42')).toBe('Dispute Details | Rushr Admin')
    expect(titleFor('/nowhere')).toBe('Rushr Admin')
  })
})
