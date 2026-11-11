// Labels and verification-step values for each document type.
import { VERIFICATION_TEXT } from '../../texts'

export const DOC_TYPE_LABELS = {
  GOVERNMENT_ID: VERIFICATION_TEXT.docTypes.governmentId,
  LICENSE: VERIFICATION_TEXT.docTypes.license,
  INSURANCE: VERIFICATION_TEXT.docTypes.insurance,
}

// Map document types to verification step enum values
export const DOC_TYPE_TO_STEP = {
  GOVERNMENT_ID: 'GOV_ID',
  LICENSE: 'LICENSE',
  INSURANCE: 'INSURANCE',
}
