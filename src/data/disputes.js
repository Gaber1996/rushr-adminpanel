const DEFAULT_DETAILS = {
  customerPhone: '+1 512 123 123',
  customerLocation: '742 Evergreen Terrace, Austin, Texas, USA',
  proPhone: '+1 512 123 123',
  proLocation: '742 Evergreen Terrace, Austin, Texas, USA',
  caseTimestamp: 'Today, 11:30 AM',
  description: 'service was never completed.',
  attachments: [],
  timeline: [
    { label: 'Request', time: '02:00 PM' },
    { label: 'Pro Assigned', time: '02:01 PM' },
    { label: 'On the way', time: '02:05 PM' },
    { label: 'Arrived', time: '02:15 PM' },
    { label: 'PIN Entered', time: '02:16 PM' },
    { label: 'Service Completed', time: '02:45 PM' },
  ],
  locationHistory: [
    {
      title: 'Started Location',
      subtitle: '02:01 PM- Pro began trip.',
      address: '742 Evergreen Terrace, Austin, Texas, USA.',
    },
    {
      title: 'Arrived At Location',
      subtitle: '02:01 PM- Near destination.',
      address: '0.5 miles from customer location.',
      highlighted: true,
    },
  ],
  totalPaid: '$185.00',
  paymentMethod: 'Online',
  chargedAt: '4:37 PM',
  paymentBadge: 'Held — Dispute',
  // Set once a dispute is resolved: the action the admin picked and their note.
  resolutionAction: null,
  adminNote: '',
  consumerRefund: '',
  proRefund: '',
}

const RESOLVED_NOTE = 'The appropriate action has been taken, and the case is now considered “action”'

export const DISPUTES = [
  { id: 'DIS-1023', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'HVAC Repair', reason: 'The service was not completed as described..', status: 'IN_REVIEW' },
  { id: 'DIS-1024', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'HVAC Repair', reason: 'The service was not completed as described..', status: 'IN_REVIEW' },
  { id: 'DIS-1025', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'IN_REVIEW' },
  { id: 'DIS-1026', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'RESOLVED',
    resolutionAction: 'FULL_REFUND', adminNote: RESOLVED_NOTE, paymentBadge: 'Refunded' },
  { id: 'DIS-1027', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'RESOLVED',
    resolutionAction: 'RELEASE_PAYMENT', adminNote: RESOLVED_NOTE, paymentBadge: 'Released' },
  { id: 'DIS-1028', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'RESOLVED',
    resolutionAction: 'PARTIAL_REFUND', adminNote: RESOLVED_NOTE, paymentBadge: 'Refunded' },
  { id: 'DIS-1029', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'RESOLVED',
    resolutionAction: 'RELEASE_PAYMENT', adminNote: RESOLVED_NOTE, paymentBadge: 'Released' },
  { id: 'DIS-1030', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'RESOLVED',
    resolutionAction: 'CUSTOM_SPLIT', adminNote: RESOLVED_NOTE, paymentBadge: 'Refunded',
    consumerRefund: '$120.00', proRefund: '$65.00' },
  { id: 'DIS-1031', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'RESOLVED',
    resolutionAction: 'FULL_REFUND', adminNote: RESOLVED_NOTE, paymentBadge: 'Refunded' },
  { id: 'DIS-1032', customer: 'Jakob Septimus', pro: 'Daniel Johnson', service: 'Plumbing', reason: 'The service was not completed as described..', status: 'RESOLVED',
    resolutionAction: 'RELEASE_PAYMENT', adminNote: RESOLVED_NOTE, paymentBadge: 'Released' },
  { id: 'DIS-1033', customer: 'Maria Hernandez', pro: 'Steve Carter', service: 'Electrical', reason: 'Pro arrived late and rushed the job..', status: 'IN_REVIEW',
    customerPhone: '+1 737 555 0188', customerLocation: '1100 Congress Ave, Austin, Texas, USA',
    proPhone: '+1 512 555 0143', proLocation: '500 W 6th St, Austin, Texas, USA',
    description: 'Pro arrived late and the work was rushed; outlet still sparks.' },
  { id: 'DIS-1034', customer: 'Liam OConnor', pro: 'Aisha Rahman', service: 'Cleaning', reason: 'Some areas were skipped during cleaning..', status: 'IN_REVIEW',
    description: 'Customer reports kitchen and master bathroom were skipped.', totalPaid: '$120.00' },
  { id: 'DIS-1035', customer: 'Yuki Tanaka', pro: 'Mark Wilson', service: 'Painting', reason: 'Paint color did not match the agreement..', status: 'RESOLVED',
    description: 'Color mismatch — repaint scheduled at no cost.', totalPaid: '$640.00', paymentBadge: 'Refunded',
    resolutionAction: 'FULL_REFUND', adminNote: 'Color did not match the approved sample. Full refund issued and a repaint scheduled at no cost.' },
  { id: 'DIS-1036', customer: 'Sofia Rossi', pro: 'James Brown', service: 'Plumbing', reason: 'Leak appeared again the next day..', status: 'IN_REVIEW',
    description: 'Leak under sink reappeared within 24 hours of service.', totalPaid: '$210.00' },
  { id: 'DIS-1037', customer: 'Noah Williams', pro: 'Linda Park', service: 'HVAC Repair', reason: 'Unit still not cooling properly..', status: 'RESOLVED',
    description: 'AC unit not cooling — return visit completed.', totalPaid: '$320.00', paymentBadge: 'Released',
    resolutionAction: 'RELEASE_PAYMENT', adminNote: 'Pro returned and completed the repair. Work verified with the customer, payment released in full.' },
  { id: 'DIS-1038', customer: 'Aaliyah Smith', pro: 'Carlos Mendez', service: 'Carpentry', reason: 'Cabinet doors were misaligned..', status: 'RESOLVED',
    description: 'Cabinet doors hung crookedly — fixed on second visit.', totalPaid: '$285.00', paymentBadge: 'Released',
    resolutionAction: 'RELEASE_PAYMENT', adminNote: 'Alignment corrected on the second visit and confirmed by the customer. Payment released.' },
  { id: 'DIS-1039', customer: 'Ethan Davis', pro: 'Priya Patel', service: 'Cleaning', reason: 'Damaged a glass shelf during cleaning..', status: 'IN_REVIEW',
    description: 'Glass shelf cracked during cleaning. Replacement requested.', totalPaid: '$95.00' },
  { id: 'DIS-1040', customer: 'Mia Anderson', pro: 'George Lee', service: 'Electrical', reason: 'Lights flickering after installation..', status: 'RESOLVED',
    description: 'Flickering ceiling lights — wiring corrected.', totalPaid: '$175.00', paymentBadge: 'Released',
    resolutionAction: 'RELEASE_PAYMENT', adminNote: 'Wiring fault corrected at no extra charge. Customer confirmed the lights are stable, payment released.' },
  { id: 'DIS-1041', customer: 'Lucas Garcia', pro: 'Hannah Cohen', service: 'Painting', reason: 'Paint dripped on flooring..', status: 'IN_REVIEW',
    description: 'Floor splatter — clean-up cost in dispute.', totalPaid: '$430.00' },
  { id: 'DIS-1042', customer: 'Zara Khan', pro: 'Tomas Novak', service: 'Plumbing', reason: 'Drain clogged again within hours..', status: 'RESOLVED',
    description: 'Drain re-clogged — full re-snake performed.', totalPaid: '$155.00', paymentBadge: 'Refunded',
    resolutionAction: 'PARTIAL_REFUND', adminNote: 'Original clearing was incomplete. Re-snake performed at our cost and the labour portion refunded to the customer.' },
  { id: 'DIS-1043', customer: 'Henry Clark', pro: 'Olivia Green', service: 'HVAC Repair', reason: 'Filter wasnt replaced as agreed..', status: 'IN_REVIEW',
    description: 'Filter swap was part of the package but was skipped.', totalPaid: '$240.00' },
  { id: 'DIS-1044', customer: 'Amelia Baker', pro: 'Ravi Sharma', service: 'Carpentry', reason: 'Wood finish does not match sample..', status: 'RESOLVED',
    description: 'Stain finish off-tone — re-finished to spec.', totalPaid: '$510.00', paymentBadge: 'Released',
    resolutionAction: 'CUSTOM_SPLIT', adminNote: 'Piece was re-finished to spec. Materials cost split between the customer and the pro.',
    consumerRefund: '$90.00', proRefund: '$420.00' },
  { id: 'DIS-1045', customer: 'Oliver Wright', pro: 'Sara Ahmed', service: 'Cleaning', reason: 'Strong chemical smell after service..', status: 'IN_REVIEW',
    description: 'Lingering chemical odor — ventilation requested.', totalPaid: '$110.00' },
]

export function mergeDefaults(dispute) {
  return { ...DEFAULT_DETAILS, ...dispute }
}

export function getDisputeById(id) {
  const base = DISPUTES.find((d) => d.id === id)
  return base ? mergeDefaults(base) : null
}
