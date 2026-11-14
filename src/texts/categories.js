// Platform Settings page and the category dialogs.

export const CATEGORIES_TEXT = {
  // Header
  title: 'Platform Settings',
  subtitle: 'Manage all your platform setting',
  addCategory: 'Add New Category',
  loadError: 'Failed to load categories.',
  // Screen readers only, while the skeleton rows show.
  loading: 'Loading categories…',

  // Tabs
  tabs: {
    categories: 'Service Categories',
    fees: 'Platform Fee Configuration',
    cancellation: 'Cancellation Fee Settings',
  },

  // Table
  nameColumn: 'Category Name',
  issueTypesColumn: 'Issue Types',
  lastUpdateColumn: 'Last Update',
  actionsColumn: 'Actions',
  edit: 'Edit',
  delete: 'Delete',
  empty: 'No categories found.',

  // Filter menu
  filter: {
    issueTypesHeading: 'Issue types',
    noIssueTypes: 'No issue types',
    updatedHeading: 'Last update',
    updatedWithin: (days) => `Last ${days} days`,
  },

  // Request errors
  addError: 'Failed to add category.',
  updateError: 'Failed to update category.',
  deleteError: 'Failed to delete category.',

  // Add / Edit dialog
  dialog: {
    addTitle: 'Add New Category',
    editTitle: 'Edit New Category',
    nameLabel: 'Category Name',
    namePlaceholder: 'e.g. Plumbing',
    iconLabel: 'Category Icon',
    iconPlaceholder: 'Upload Category Icon',
    issueTypesLabel: 'Issue Types (comma separated)',
    issueTypesPlaceholder: 'e.g. Leaking pipe, Running toilet, Clogged drain, Broken faucet',
    saveAndAddAnother: 'Save , Add Another',
    saveChanges: 'Save Changes',
    saveCategory: 'Save Category',
  },

  // Delete dialog
  deleteDialog: {
    title: 'Delete This Category ?',
    message: 'Are you sure you want to delete this category? This action cannot be undone.',
    confirm: 'Delete Category',
  },
}
