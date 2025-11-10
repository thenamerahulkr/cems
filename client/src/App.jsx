import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import ErrorBoundary from "./components/ErrorBoundary"

import LandingOrHome from "./components/LandingOrHome"

// Shared pages
import Events from "./pages/shared/Events"
import EventDetail from "./pages/shared/EventDetail"
import Login from "./pages/shared/Login"
import Register from "./pages/shared/Register"
import Notifications from "./pages/shared/Notifications"
import NotFound from "./pages/shared/NotFound"

// Student pages
import StudentDashboard from "./pages/student/Dashboard"
import MyEvents from "./pages/student/MyEvents"

// Organizer pages
import OrganizerDashboard from "./pages/organizer/Dashboard"
import OrganizerDashboardHome from "./pages/organizer/DashboardHome"
import CreateEvent from "./pages/organizer/CreateEvent"
import Participants from "./pages/organizer/Participants"

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard"
import ManageOrganizers from "./pages/admin/ManageOrganizers"
import ManageEvents from "./pages/admin/ManageEvents"
import ManageUsers from "./pages/admin/ManageUsers"

function AppContent() {
  const location = useLocation()
  const hideNavbarRoutes = ["/login", "/register"]
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
            <Route path="/" element={<LandingOrHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes - Require Login */}
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-event"
              element={
                <ProtectedRoute roles={["organizer", "admin"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer-dashboard"
              element={
                <ProtectedRoute roles={["organizer"]}>
                  <OrganizerDashboardHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-organizers"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageOrganizers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-events"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute roles={["organizer"]}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-registrations"
              element={
                <ProtectedRoute roles={["student"]}>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/participants/:eventId"
              element={
                <ProtectedRoute roles={["organizer", "admin"]}>
                  <Participants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            {/* 404 Catch-all route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
          <Toaster richColors closeButton />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
