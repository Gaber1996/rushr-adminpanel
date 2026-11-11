// Resolution action cards and their mapping to the API's outcome values.
import { DISPUTES_TEXT } from '../../texts'

const TEXT = DISPUTES_TEXT.details

// `total` is what the customer paid; `proNet` is what the pro would actually receive once the
// platform's cut is taken — 12%, or 7% for a Pro+ pro — so the copy states the real figures.
export function buildActions(total, proNet) {
  return [
    {
      key: 'FULL_REFUND',
      title: TEXT.fullRefundTitle,
      subtitle: TEXT.fullRefundSubtitle(total),
      selectedBg: '#FFF7F7',
      selectedBorder: '#C20A0A',
    },
    {
      key: 'PARTIAL_REFUND',
      title: TEXT.partialRefundTitle,
      subtitle: TEXT.partialRefundSubtitle,
      selectedBg: '#FFFAEC',
      selectedBorder: '#FFC107',
    },
    {
      key: 'RELEASE_PAYMENT',
      title: TEXT.releasePaymentTitle,
      subtitle: TEXT.releasePaymentSubtitle(proNet),
      selectedBg: '#EFFFF5',
      selectedBorder: '#00861D',
    },
    {
      key: 'CUSTOM_SPLIT',
      title: TEXT.customSplitTitle,
      selectedBg: '#F4F9FF',
      selectedBorder: '#438DE1',
    },
  ]
}

// One card per API outcome. SPLIT is the even half-and-half the platform works out itself;
// CUSTOM_SPLIT is the one where the admin types both amounts.
export const ACTION_BY_OUTCOME = {
  FULL_REFUND: 'FULL_REFUND',
  RELEASE_TO_PRO: 'RELEASE_PAYMENT',
  SPLIT: 'PARTIAL_REFUND',
  CUSTOM_SPLIT: 'CUSTOM_SPLIT',
}

/** The inverse: which backend outcome each resolution card submits. */
export const OUTCOME_BY_ACTION = Object.fromEntries(
  Object.entries(ACTION_BY_OUTCOME).map(([outcome, action]) => [action, outcome])
)

/** The card (and outcome) where the admin types both amounts. */
export const CUSTOM_SPLIT = 'CUSTOM_SPLIT'
