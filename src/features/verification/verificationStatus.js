// The verification statuses the backend sends for a document or a verification step.

export const VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
}

const FINAL = [
  VERIFICATION_STATUS.APPROVED,
  VERIFICATION_STATUS.REJECTED,
  VERIFICATION_STATUS.EXPIRED,
]

/** Folds "submitted", unknown and missing statuses into PENDING, as the status badge shows them. */
export function normalizeStatus(status) {
  return FINAL.includes(status) ? status : VERIFICATION_STATUS.PENDING
}

/** The status of one verification step (GOV_ID, LICENSE, INSURANCE) of a queue item. */
export function stepStatus(item, step) {
  return normalizeStatus(item.stepStatuses?.[step]?.status)
}
