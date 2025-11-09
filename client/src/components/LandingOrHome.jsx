// Smart component that shows Landing page or redirects to dashboard
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import Landing from "../pages/shared/Landing"

export default function LandingOrHome() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is logged in, redirect to their dashboard
  if (user) {
    if (user.role === "student") {
      return <Navigate to="/student-dashboard" replace />
    }
    if (user.role === "organizer") {
      return <Navigate to="/organizer-dashboard" replace />
    }
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />
    }
    // Fallback to student dashboard if role is unknown
    return <Navigate to="/student-dashboard" replace />
  }
  
  // If not logged in, show Landing page
  return <Landing />
}
