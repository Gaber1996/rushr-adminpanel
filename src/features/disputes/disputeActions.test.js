import { describe, expect, it } from 'vitest'
import { ACTION_BY_OUTCOME, OUTCOME_BY_ACTION, buildActions } from './disputeActions'
import { DISPUTES_TEXT } from '../../texts'

const TEXT = DISPUTES_TEXT.details

describe('buildActions', () => {
  const actions = buildActions('$100.00', '$88.00')

  it('returns the four action cards in display order', () => {
    expect(actions.map((a) => a.key)).toEqual([
      'FULL_REFUND',
      'PARTIAL_REFUND',
      'RELEASE_PAYMENT',
      'CUSTOM_SPLIT',
    ])
  })

  it('gives every card a title and selected colours', () => {
    for (const action of actions) {
      expect(action.title).toEqual(expect.any(String))
      expect(action.selectedBg).toMatch(/^#[0-9A-F]{6}$/)
      expect(action.selectedBorder).toMatch(/^#[0-9A-F]{6}$/)
    }
  })

  it('puts the total in the refund copy and the pro net in the release copy', () => {
    const byKey = Object.fromEntries(actions.map((a) => [a.key, a]))
    expect(byKey.FULL_REFUND.subtitle).toBe(TEXT.fullRefundSubtitle('$100.00'))
    expect(byKey.FULL_REFUND.subtitle).toContain('$100.00')
    expect(byKey.RELEASE_PAYMENT.subtitle).toBe(TEXT.releasePaymentSubtitle('$88.00'))
    expect(byKey.RELEASE_PAYMENT.subtitle).toContain('$88.00')
    expect(byKey.PARTIAL_REFUND.subtitle).toBe(TEXT.partialRefundSubtitle)
    expect(byKey.CUSTOM_SPLIT.subtitle).toBeUndefined()
  })
})

describe('outcome / action maps', () => {
  it('maps every action card to an outcome', () => {
    const keys = buildActions('', '').map((a) => a.key)
    expect(Object.keys(OUTCOME_BY_ACTION).sort()).toEqual([...keys].sort())
  })

  it('are exact inverses of each other', () => {
    for (const [outcome, action] of Object.entries(ACTION_BY_OUTCOME)) {
      expect(OUTCOME_BY_ACTION[action]).toBe(outcome)
    }
    for (const [action, outcome] of Object.entries(OUTCOME_BY_ACTION)) {
      expect(ACTION_BY_OUTCOME[outcome]).toBe(action)
    }
  })
})
