// App shell: browser-tab titles, sidebar, and placeholder pages.

export const NAVIGATION_TEXT = {
  // Browser tab ("<Page> | Rushr Admin")
  baseTitle: 'Rushr Admin',

  // Page names (sidebar labels and tab titles)
  pages: {
    signIn: 'Sign In',
    dashboard: 'Dashboard',
    proVerification: 'Pro Verification',
    verificationDetails: 'Verification Details',
    disputeResolution: 'Dispute Resolution',
    disputeDetails: 'Dispute Details',
    userManagement: 'User Management',
    platformSettings: 'Platform Settings',
    auditLog: 'Audit Log',
  },

  // Sidebar
  logOut: 'Log Out',
  // Screen readers only: the menu button and the drawer below the lg breakpoint.
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mainNavigation: 'Main navigation',

  // Placeholder pages
  dashboardComingSoon: 'Dashboard - Coming Soon',
  userManagementComingSoon: 'User Management - Coming Soon',
}
