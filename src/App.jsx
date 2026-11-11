import { Fragment } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import SignIn from './pages/SignIn'
import AdminLayout from './layouts/AdminLayout'
import ProVerification from './pages/ProVerification'
import VerificationDetails from './pages/VerificationDetails'
import PlatformSettings from './pages/PlatformSettings'
import DisputeResolution from './pages/DisputeResolution'
import DisputeDetails from './pages/DisputeDetails'
import AuditLog from './pages/AuditLog'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { clearSession, isLoggedIn } from './lib/session'
import { ROUTES } from './config/routes'
import { NAVIGATION_TEXT } from './texts'

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    // Drop an expired token so it is not sent with the next sign-in.
    clearSession()
    return <Navigate to={ROUTES.login} replace />
  }
  return children
}

/** Remounts the page when the route param changes, so no state carries over to the next record. */
function KeyedByParam({ param, children }) {
  const params = useParams()
  return <Fragment key={params[param]}>{children}</Fragment>
}

function App() {
  useDocumentTitle()
  return (
    <Routes>
      <Route path={ROUTES.login} element={<SignIn />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path={ROUTES.dashboard}
          element={
            <div className="text-2xl font-bold text-gray-400">
              {NAVIGATION_TEXT.dashboardComingSoon}
            </div>
          }
        />
        <Route path={ROUTES.proVerification} element={<ProVerification />} />
        <Route
          path={ROUTES.verificationDetails}
          element={
            <KeyedByParam param="contractorId">
              <VerificationDetails />
            </KeyedByParam>
          }
        />
        <Route path={ROUTES.disputeResolution} element={<DisputeResolution />} />
        <Route
          path={ROUTES.disputeDetails}
          element={
            <KeyedByParam param="id">
              <DisputeDetails />
            </KeyedByParam>
          }
        />
        <Route
          path={ROUTES.userManagement}
          element={
            <div className="text-2xl font-bold text-gray-400">
              {NAVIGATION_TEXT.userManagementComingSoon}
            </div>
          }
        />
        <Route path={ROUTES.platformSettings} element={<PlatformSettings />} />
        <Route path={ROUTES.auditLog} element={<AuditLog />} />
        <Route path={ROUTES.home} element={<Navigate to={ROUTES.proVerification} replace />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  )
}

export default App
