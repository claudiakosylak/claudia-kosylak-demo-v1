import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={
                !user.first_name || !user.last_name
                  ? '/register'
                  : user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/dashboard'
              }
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Register route - standalone, not within Layout */}
      <Route
        path="/register"
        element={
          <ProtectedRoute>
            <RegisterPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route
          index
          element={
            <Navigate
              to={
                user && (!user.first_name || !user.last_name)
                  ? '/register'
                  : user?.role === 'admin'
                    ? '/admin/dashboard'
                    : '/dashboard'
              }
              replace
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
