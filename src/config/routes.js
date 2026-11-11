import { generatePath } from 'react-router-dom'

// Every in-app path lives here. Pages navigate with these helpers instead of writing URLs by hand.

export const ROUTES = {
  login: '/login',
  home: '/home',
  dashboard: '/dashboard',
  proVerification: '/pro-verification',
  verificationDetails: '/pro-verification/:contractorId',
  disputeResolution: '/dispute-resolution',
  disputeDetails: '/dispute-resolution/:id',
  userManagement: '/user-management',
  platformSettings: '/platform-settings',
  auditLog: '/audit-log',
}

/** Concrete links for the routes that take a parameter. */
export const toVerificationDetails = (contractorId) =>
  generatePath(ROUTES.verificationDetails, { contractorId: String(contractorId) })

export const toDisputeDetails = (id) => generatePath(ROUTES.disputeDetails, { id: String(id) })

/** Browser-tab title per route pattern, used by useDocumentTitle. */
export const ROUTE_TITLES = {
  [ROUTES.login]: 'Sign In',
  [ROUTES.dashboard]: 'Dashboard',
  [ROUTES.proVerification]: 'Pro Verification',
  [ROUTES.verificationDetails]: 'Verification Details',
  [ROUTES.disputeResolution]: 'Dispute Resolution',
  [ROUTES.disputeDetails]: 'Dispute Details',
  [ROUTES.userManagement]: 'User Management',
  [ROUTES.platformSettings]: 'Platform Settings',
  [ROUTES.auditLog]: 'Audit Log',
}
