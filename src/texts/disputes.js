// Dispute Resolution list, Dispute Details, and the dispute status badge.

export const DISPUTES_TEXT = {
  // Status badge
  status: {
    resolved: 'Resolved',
    inReview: 'In Review',
  },

  // List page (DisputeResolution)
  list: {
    title: 'Dispute Resolution',
    loadError: 'Could not load disputes.',
    searchPlaceholder: 'Search by dispute ID, customer or pro name',
    loading: 'Loading disputes…',

    // Empty state: "There is no <span>Dispute Resolution</span> yet."
    emptyAlt: 'No disputes',
    emptyBefore: 'There is no ',
    emptyHighlight: 'Dispute Resolution',
    emptyAfter: ' yet.',

    // Table column headings
    columns: {
      disputeId: 'Dispute ID',
      customerName: 'Customer Name',
      proName: 'Pro Name',
      service: 'Service',
      status: 'Status',
    },
  },

  // Details page (DisputeDetails)
  details: {
    // Header
    title: 'Dispute Resolution',
    caseSubtitle: (caseId, date) => `Case ${caseId} - ${date}`,
    loadError: 'Could not load this dispute.',
    loading: 'Loading dispute…',
    notFound: 'Dispute not found.',

    // Collapsible cards
    expand: 'Expand',
    collapse: 'Collapse',

    // Customer Info card
    customerInfoTitle: 'Customer Info',
    customerNameLabel: 'Customer Name: ',
    phoneLabel: 'Phone Number: ',
    locationLabel: 'Location: ',

    // Pro Info card
    proInfoTitle: 'Pro Info',
    proNameLabel: 'Pro Name: ',
    noPro: 'No pro was assigned to this request.',

    // Dispute Details card
    disputeDetailsTitle: 'Dispute Details',
    serviceIdPrefix: 'Service ID: Ser-',
    casePrefix: 'Case ',
    evidenceAlt: 'Dispute evidence',

    // Service Timeline card
    serviceTimelineTitle: 'Service Timeline',

    // Location History card
    locationHistoryTitle: 'Location History',
    noLocation: 'No location was recorded for this job.',
    nearDestination: 'Near destination.',
    tripStarted: 'Pro began trip.',
    locationSubtitle: (time, caption) => `${time}- ${caption}`,
    milesFromCustomer: (miles) => `${miles} miles from customer location.`,
    defaultDistance: '0.5 miles from customer location.',

    // Payment Details card
    paymentDetailsTitle: 'Payment Details',
    totalPaidLabel: 'Total paid:',
    methodLabel: 'Method:',
    defaultMethod: 'Online',
    chargedAtLabel: 'Charged at:',
    statusLabel: 'Status:',

    // Resolution Actions panel
    resolutionActionsTitle: 'Resolution Actions',
    fullRefundTitle: 'Full Refund',
    fullRefundSubtitle: (total) => `Return ${total} to customer`,
    partialRefundTitle: 'Partial Refund',
    partialRefundSubtitle: 'Split payment between parties',
    releasePaymentTitle: 'Release Payment',
    releasePaymentSubtitle: (proNet) => `Pay ${proNet} to pro`,
    customSplitTitle: 'Custom Split',
    consumerRefundLabel: 'Consumer Refund Amount',
    proRefundLabel: 'Pro Refund Amount',
    customAmountPlaceholder: 'Enter custom amount',
    splitOverTotal: (total) => `An amount can't be more than ${total}.`,
    splitUnbalanced: (total) => `Both amounts must add up to ${total}.`,

    // Admin note and confirm
    adminNoteLabel: 'Admin Note',
    adminNotePlaceholder: 'Document your reasoning for this action..',
    confirmDecision: 'Confirm Decision',
    resolveError: 'Could not resolve this dispute.',

    // Success dialog
    successTitle: 'Action completed successfully!',
    successMessage:
      'The action was completed successfully and now shared with the customer and pro.',
  },
}
