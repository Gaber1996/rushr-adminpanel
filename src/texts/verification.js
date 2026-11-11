// Pro Verification queue, Verification Details, and the verification status badge.

export const VERIFICATION_TEXT = {
  // Status badge
  status: {
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
    pending: 'pending',
  },

  // Document types (queue columns and document list)
  docTypes: {
    governmentId: 'Government ID',
    license: 'Professional License',
    insurance: 'Business Insurance',
  },

  // Queue page (ProVerification)
  queue: {
    title: 'Pro Verification',
    subtitle: 'Review and approve pro verification documents.',
    exportReport: 'Export Report',
    loadError: 'Failed to load verification data.',
    nameColumn: 'Name',
    submittedColumn: 'Submitted',
  },

  // Details page (VerificationDetails)
  details: {
    // Header
    backToQueue: 'Back to Verification Queue',
    title: 'Verification Details',
    subtitle: 'Review pro information and documents',
    loadError: 'Failed to load documents.',

    // Pro Information card
    proInfoTitle: 'Pro Information',
    fullNameLabel: 'Full Name:',
    phoneLabel: 'Phone Number:',
    emailLabel: 'Email:',

    // Documents card
    documentsTitle: 'Documents',
    uploadedOn: (date) => `Uploaded ${date}`,
    reviewedBy: (name) => ` · Reviewed by ${name}`,

    // Document viewer
    viewerTitle: 'Document Viewer',
    viewerEmptyHint: 'Select Document To View.',
    documentAlt: 'Document',
    documentLoadError: 'Unable to load document',

    // Approve / Reject buttons
    approve: 'Approve',
    reject: 'Reject',
    alreadyApproved: 'Already Approved',
    alreadyRejected: 'Already Rejected',
    actionFailed: (action) => `Failed to ${action} document.`,

    // Approve / Reject dialog
    approveTitle: 'Approve Document',
    rejectTitle: 'Reject Document',
    close: 'Close',
    approving: 'Approving',
    rejecting: 'Rejecting',
    approveReasonPlaceholder: 'e.g. Document is clear and valid',
    rejectReasonPlaceholder: 'e.g. Document is blurry or expired',
    adminNotesLabel: 'Admin Notes',
    optionalHint: '(optional)',
    adminNotesPlaceholder: 'Additional notes for internal reference',
  },
}
