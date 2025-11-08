// Event detail page
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, MapPin, Share2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import Button from "../components/ui/Button"
import QRDisplay from "../components/QRDisplay"
import api from "../api/api"
import { useAuth } from "../context/AuthContext"

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [qrCode, setQrCode] = useState(null)

  useEffect(() => {
    fetchEventDetail()
  }, [id])

  const fetchEventDetail = async () => {
    try {
      const response = await api.get(`/events/${id}`)
      // Mock response
      setEvent(
        response.data || {
          id,
          title: "Tech Summit 2024",
          description: "Join industry leaders for talks on AI and web development",
          fullDescription:
            "This is a full-day event featuring keynote presentations, workshops, and networking opportunities with tech industry professionals.",
          category: "Technical",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          venue: "Main Auditorium",
          registrations: 245,
          capacity: 500,
          organizer: "Tech Club",
        },
      )
      setIsRegistered(Math.random() > 0.5)
    } catch (error) {
      console.error("Failed to fetch event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setActionLoading(true)
    try {
      const response = await api.post(`/registrations/${id}/register`)
      setQrCode(response.data.qrCode)
      setIsRegistered(true)
      alert("Successfully registered for the event!")
    } catch (error) {
      console.error("Failed to register:", error)
      alert(error.response?.data?.message || "Failed to register for event")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnregister = async () => {
    setActionLoading(true)
    try {
      await api.delete(`/registrations/${id}/unregister`)
      setIsRegistered(false)
      setQrCode(null)
      alert("Successfully unregistered from the event")
    } catch (error) {
      console.error("Failed to unregister:", error)
      alert(error.response?.data?.message || "Failed to unregister from event")
    } finally {
      setActionLoading(false)
    }
  }
  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await api.post(`/events/${id}/approve`, {})
      // Handle success
    } catch (error) {
      console.error("Failed to approve:", error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/events")} className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Events
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Event not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/events")} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{event.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/50">
                      <Calendar size={20} className="text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/50">
                      <MapPin size={20} className="text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Venue</p>
                        <p className="font-medium text-foreground">{event.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">About</h3>
                    <p className="text-muted-foreground">{event.fullDescription || event.description}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Registrations</p>
                      <p className="text-xl font-bold text-foreground">
                        {event.registrations}/{event.capacity}
                      </p>
                    </div>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isRegistered && qrCode && user?.role === "student" && (
              <div className="mt-6">
                <QRDisplay qrValue={qrCode} eventId={id} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground">{event.organizer}</p>
                <p className="text-sm text-muted-foreground mt-2">Tech enthusiasts & innovators</p>
              </CardContent>
            </Card>

            {user && user.role === "student" && (
              <Button
                className="w-full"
                onClick={isRegistered ? handleUnregister : handleRegister}
                disabled={actionLoading}
                variant={isRegistered ? "destructive" : "primary"}
              >
                {actionLoading ? "Processing..." : isRegistered ? "Unregister" : "Register Now"}
              </Button>
            )}

            {user && (user.role === "organizer" || user.role === "admin") && (
              <div className="space-y-2">
                <Button className="w-full" onClick={handleApprove} disabled={actionLoading}>
                  Approve Event
                </Button>
                <Button variant="destructive" className="w-full">
                  Reject Event
                </Button>
              </div>
            )}

            <Button variant="secondary" className="w-full gap-2">
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
