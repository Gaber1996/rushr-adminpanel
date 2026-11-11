// Audit Logs page.

export const AUDIT_LOG_TEXT = {
  // Header
  title: 'Audit Logs',
  subtitle: 'Stay informed about every action and change made across the platform.',

  // Legend
  legend: 'Red-highlighted fields represent high-impact actions.',

  // Filter menu
  filterLabel: (count) => (count > 0 ? `Filter (${count})` : 'Filter'),
  moduleHeading: 'Module',
  highImpactOnly: 'High-impact only',
  clearAll: 'Clear all',

  // Table column headings
  columns: {
    timestamp: 'Date & Time',
    actor: 'Actor',
    module: 'Module',
    action: 'Actions',
  },
}
