import { Routes, Route, Navigate } from 'react-router-dom'
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

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    // Drop an expired token so it is not sent with the next sign-in.
    clearSession()
    return <Navigate to={ROUTES.login} replace />
  }
  return children
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
          element={<div className="text-2xl font-bold text-gray-400">Dashboard - Coming Soon</div>}
        />
        <Route path={ROUTES.proVerification} element={<ProVerification />} />
        <Route path={ROUTES.verificationDetails} element={<VerificationDetails />} />
        <Route path={ROUTES.disputeResolution} element={<DisputeResolution />} />
        <Route path={ROUTES.disputeDetails} element={<DisputeDetails />} />
        <Route
          path={ROUTES.userManagement}
          element={
            <div className="text-2xl font-bold text-gray-400">User Management - Coming Soon</div>
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
