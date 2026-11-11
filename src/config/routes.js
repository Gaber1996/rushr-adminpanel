import { generatePath } from 'react-router-dom'
import { NAVIGATION_TEXT } from '../texts'

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
  [ROUTES.login]: NAVIGATION_TEXT.pages.signIn,
  [ROUTES.dashboard]: NAVIGATION_TEXT.pages.dashboard,
  [ROUTES.proVerification]: NAVIGATION_TEXT.pages.proVerification,
  [ROUTES.verificationDetails]: NAVIGATION_TEXT.pages.verificationDetails,
  [ROUTES.disputeResolution]: NAVIGATION_TEXT.pages.disputeResolution,
  [ROUTES.disputeDetails]: NAVIGATION_TEXT.pages.disputeDetails,
  [ROUTES.userManagement]: NAVIGATION_TEXT.pages.userManagement,
  [ROUTES.platformSettings]: NAVIGATION_TEXT.pages.platformSettings,
  [ROUTES.auditLog]: NAVIGATION_TEXT.pages.auditLog,
}
