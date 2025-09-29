import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ('admin' | 'client')[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If user needs to complete registration (missing first_name or last_name)
  const needsRegistration = !user.first_name || !user.last_name

  if (needsRegistration) {
    // Allow access to register page to complete information
    if (location.pathname === '/register') {
      return <>{children}</>
    }
    // Redirect to register with replace to avoid navigation stack issues
    return <Navigate to="/register" replace />
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
