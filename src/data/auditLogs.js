// Audit trail rows. `highImpact` flags an entry that changed money, access, or
// account standing — those are called out in red in the table.
export const AUDIT_LOGS = [
  { id: 'AL-2001', timestamp: 'Jul 7, 2024 14:32', actor: 'Zaire Stanton', module: 'Platform Settings', action: 'Add New Category', reason: 'New service category requested by operations to cover seasonal HVAC work.' },
  { id: 'AL-2002', timestamp: 'Jul 7, 2024 14:28', actor: 'Zaire Stanton', module: 'User Management', action: 'Suspended a customer', reason: 'Repeated chargebacks on completed jobs. Account held pending review.' },
  { id: 'AL-2003', timestamp: 'Jul 7, 2024 14:16', actor: 'Zaire Stanton', module: 'Dispute Resolution', action: 'Split the refund on order #or-123', reason: 'Work was partially completed. Refund split between the customer and the pro.', highImpact: true },
  { id: 'AL-2004', timestamp: 'Jul 7, 2024 13:52', actor: 'Zaire Stanton', module: 'Pro Verification', action: 'Accept a pro “Daniel Johnson”', reason: 'License and insurance documents verified against the state registry.' },
  { id: 'AL-2005', timestamp: 'Jul 7, 2024 13:40', actor: 'Amina Farouk', module: 'Platform Settings', action: 'Add New Category', reason: 'Split “Handyman” into separate carpentry and general repair categories.' },
  { id: 'AL-2006', timestamp: 'Jul 7, 2024 13:11', actor: 'Amina Farouk', module: 'Platform Settings', action: 'Updated commission rate', reason: 'Platform commission moved from 12% to 14% per the Q3 pricing review.', highImpact: true },
  { id: 'AL-2007', timestamp: 'Jul 7, 2024 12:47', actor: 'Marcus Reid', module: 'Pro Verification', action: 'Rejected a pro “Steve Carter”', reason: 'Submitted insurance certificate had expired more than 90 days ago.' },
  { id: 'AL-2008', timestamp: 'Jul 7, 2024 12:20', actor: 'Marcus Reid', module: 'User Management', action: 'Reinstated a customer', reason: 'Chargebacks were resolved with the payment provider in the customer’s favour.' },
  { id: 'AL-2009', timestamp: 'Jul 7, 2024 11:58', actor: 'Zaire Stanton', module: 'Dispute Resolution', action: 'Full refund on order #or-118', reason: 'Service was never delivered. Full amount returned to the customer.', highImpact: true },
  { id: 'AL-2010', timestamp: 'Jul 7, 2024 11:35', actor: 'Amina Farouk', module: 'Platform Settings', action: 'Edited category “Plumbing”', reason: 'Added drain cleaning and leak detection to the issue type list.' },
  { id: 'AL-2011', timestamp: 'Jul 7, 2024 11:02', actor: 'Priya Nair', module: 'Pro Verification', action: 'Accept a pro “Aisha Rahman”', reason: 'Background check cleared and onboarding call completed.' },
  { id: 'AL-2012', timestamp: 'Jul 7, 2024 10:44', actor: 'Priya Nair', module: 'Platform Settings', action: 'Add New Category', reason: 'Added “Appliance Install” ahead of the summer campaign launch.' },
  { id: 'AL-2013', timestamp: 'Jul 7, 2024 10:19', actor: 'Marcus Reid', module: 'User Management', action: 'Deleted an admin account', reason: 'Offboarding for a team member who left the company on Jul 5.', highImpact: true },
  { id: 'AL-2014', timestamp: 'Jul 7, 2024 09:56', actor: 'Zaire Stanton', module: 'Dispute Resolution', action: 'Released payment on order #or-109', reason: 'Return visit confirmed by the customer. Payment released to the pro.' },
  { id: 'AL-2015', timestamp: 'Jul 7, 2024 09:31', actor: 'Amina Farouk', module: 'Platform Settings', action: 'Updated cancellation window', reason: 'Free cancellation window shortened from 24 hours to 12 hours.' },
  { id: 'AL-2016', timestamp: 'Jul 6, 2024 17:48', actor: 'Priya Nair', module: 'Pro Verification', action: 'Requested new documents', reason: 'Uploaded license photo was unreadable; the pro was asked to resubmit.' },
  { id: 'AL-2017', timestamp: 'Jul 6, 2024 17:12', actor: 'Marcus Reid', module: 'User Management', action: 'Changed admin permissions', reason: 'Granted dispute resolution access to the new operations lead.', highImpact: true },
  { id: 'AL-2018', timestamp: 'Jul 6, 2024 16:40', actor: 'Zaire Stanton', module: 'Platform Settings', action: 'Add New Category', reason: 'Added “Pest Control” following the vendor partnership agreement.' },
  { id: 'AL-2019', timestamp: 'Jul 6, 2024 16:05', actor: 'Amina Farouk', module: 'Dispute Resolution', action: 'Partial refund on order #or-097', reason: 'Cleaning skipped two rooms. Proportional amount refunded.' },
  { id: 'AL-2020', timestamp: 'Jul 6, 2024 15:22', actor: 'Priya Nair', module: 'Pro Verification', action: 'Accept a pro “Carlos Mendez”', reason: 'Trade certification confirmed with the issuing body.' },
  { id: 'AL-2021', timestamp: 'Jul 6, 2024 14:50', actor: 'Marcus Reid', module: 'Platform Settings', action: 'Deleted category “Misc”', reason: 'Category was unused for six months and duplicated “General Repair”.', highImpact: true },
  { id: 'AL-2022', timestamp: 'Jul 6, 2024 14:18', actor: 'Zaire Stanton', module: 'User Management', action: 'Suspended a pro', reason: 'Three no-shows within a single week reported by customers.' },
  { id: 'AL-2023', timestamp: 'Jul 6, 2024 13:44', actor: 'Amina Farouk', module: 'Platform Settings', action: 'Edited category “Electrical”', reason: 'Updated the description and search keywords for better matching.' },
  { id: 'AL-2024', timestamp: 'Jul 6, 2024 13:07', actor: 'Priya Nair', module: 'Dispute Resolution', action: 'Opened a case on order #or-088', reason: 'Customer reported a damaged glass shelf during a cleaning visit.' },
]

export const AUDIT_MODULES = [
  'Platform Settings',
  'Pro Verification',
  'Dispute Resolution',
  'User Management',
]
