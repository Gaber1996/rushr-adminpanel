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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  useDocumentTitle()
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<div className="font-montserrat text-2xl font-bold text-gray-400">Dashboard - Coming Soon</div>} />
        <Route path="/pro-verification" element={<ProVerification />} />
        <Route path="/pro-verification/:contractorId" element={<VerificationDetails />} />
        <Route path="/dispute-resolution" element={<DisputeResolution />} />
        <Route path="/dispute-resolution/:id" element={<DisputeDetails />} />
        <Route path="/user-management" element={<div className="font-montserrat text-2xl font-bold text-gray-400">User Management - Coming Soon</div>} />
        <Route path="/platform-settings" element={<PlatformSettings />} />
        <Route path="/audit-log" element={<AuditLog />} />
        <Route path="/home" element={<Navigate to="/pro-verification" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
