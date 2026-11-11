// Every Rushr API path the admin panel calls. Pages pass these to apiRequest / useApiResource.

const id = (value) => encodeURIComponent(value)

export const ENDPOINTS = {
  login: '/api/admin/login',

  verificationQueue: '/api/admin/verification-queue',
  contractorDocuments: (contractorId) => `/api/admin/contractors/${id(contractorId)}/documents`,
  contractorVerificationDecision: (contractorId) =>
    `/api/admin/contractors/${id(contractorId)}/verification/approve-reject`,

  /** One page of disputes; `page` is 1-based here and converted to the API's 0-based index. */
  disputesPage: ({ page, size, search }) => {
    const params = new URLSearchParams({ page: String(page - 1), size: String(size) })
    if (search) params.set('search', search)
    return `/api/admin/disputes/paged?${params}`
  },
  dispute: (disputeId) => `/api/admin/disputes/${id(disputeId)}`,
  resolveDispute: (disputeId) => `/api/admin/disputes/${id(disputeId)}/resolve`,

  categories: '/api/admin/categories',
  category: (categoryId) => `/api/admin/categories/${id(categoryId)}`,

  /** Protected file for a storage key such as "uploads/pro-documents/x.png". */
  file: (storageKey) => `/api/files/${storageKey.replace(/^uploads\//, '')}`,
}
