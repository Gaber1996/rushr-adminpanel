import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import VerificationStatusBadge, { verificationStatus } from './VerificationStatusBadge'
import DisputeStatusBadge, { isResolvedStatus } from '../disputes/DisputeStatusBadge'

describe('VerificationStatusBadge', () => {
  it.each([
    ['APPROVED', 'Approved', 'success'],
    ['REJECTED', 'Rejected', 'danger'],
    ['EXPIRED', 'Expired', 'danger'],
    ['SUBMITTED', 'pending', 'neutral'],
    [undefined, 'pending', 'neutral'],
    ['SOMETHING_NEW', 'pending', 'neutral'],
  ])('%s reads as %s', (status, label, tone) => {
    expect(verificationStatus(status)).toMatchObject({ label, tone })
    render(<VerificationStatusBadge status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})

describe('DisputeStatusBadge', () => {
  it('shows Resolved for every RESOLVED_* status and In Review otherwise', () => {
    expect(isResolvedStatus('RESOLVED_SPLIT')).toBe(true)
    expect(isResolvedStatus('OPEN')).toBe(false)
    expect(isResolvedStatus(null)).toBe(false)

    const { rerender } = render(<DisputeStatusBadge status="RESOLVED_REFUNDED" />)
    expect(screen.getByText('Resolved')).toBeInTheDocument()
    rerender(<DisputeStatusBadge status="OPEN" />)
    expect(screen.getByText('In Review')).toBeInTheDocument()
  })
})
