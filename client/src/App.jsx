// Main router setup
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import LandingOrHome from "./components/LandingOrHome"
import Events from "./pages/Events"
import EventDetail from "./pages/EventDetail"
import CreateEvent from "./pages/CreateEvent"
import Participants from "./pages/Participants"
import MyEvents from "./pages/MyEvents"
import Notifications from "./pages/Notifications"
import AdminPanel from "./pages/AdminPanel"
import Login from "./pages/Login"
import Register from "./pages/Register"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<LandingOrHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />

            <Route
              path="/create-event"
              element={
                <ProtectedRoute roles={["organizer", "admin"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
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
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
