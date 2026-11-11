// Words shared by two or more screens.

export const COMMON_TEXT = {
  // Brand
  brandName: 'Rushr',

  // Buttons
  back: 'Back',
  cancel: 'Cancel',
  filter: 'Filter',
  review: 'Review',
  tryAgain: 'Try again',

  // Search box (default placeholder)
  search: 'Search',

  // Table column headings
  action: 'Action',
  reason: 'Reason',

  // Pagination
  perPage: 'Per page',
  prev: 'Prev',
  next: 'Next',
  pageOf: (page, total) => `Page ${page} of ${total}`,

  // Form marks
  requiredMark: '*',

  // States and fallbacks
  comingSoon: 'Coming Soon',
  noResults: 'No results found.',
  networkError: 'Unable to connect to server.',
  emptyValue: '—',
  today: (time) => `Today, ${time}`,
}
