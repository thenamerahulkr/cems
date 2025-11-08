// Smart component that shows Landing or Home based on auth status
import { useAuth } from "../context/AuthContext"
import Landing from "../pages/Landing"
import Home from "../pages/Home"

export default function LandingOrHome() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is logged in, show Home page
  if (user) {
    return <Home />
  }
  // If not logged in, show Landing page
  return <Landing />
}
