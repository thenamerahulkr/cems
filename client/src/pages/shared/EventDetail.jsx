// Event detail page
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, MapPin, Share2, ArrowLeft, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import QRDisplay from "../../components/QRDisplay"
import api from "../../api/api"
import { useAuth } from "../../context/AuthContext"
import { useRazorpay } from "../../hooks/useRazorpay"

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const { initiatePayment, loading: paymentLoading } = useRazorpay()

  useEffect(() => {
    fetchEventDetail()
    if (user?.role === "student") {
      checkRegistrationStatus()
    }
  }, [id, user])

  const fetchEventDetail = async () => {
    try {
      const response = await api.get(`/events/${id}`)
      setEvent(response.data)
    } catch (error) {
      console.error("Failed to fetch event:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkRegistrationStatus = async () => {
    try {
      // Check if user is registered by fetching their registrations
      const response = await api.get("/registrations/my-events")
      const registeredEvents = response.data.events || []
      
      // Find if this event is in the registered events
      const registration = registeredEvents.find(event => 
        (event._id === id || event.id === id)
      )
      
      if (registration) {
        setIsRegistered(true)
        // Set the QR code if it exists
        if (registration.qrCode) {
          setQrCode(registration.qrCode)
        }
      } else {
        setIsRegistered(false)
        setQrCode(null)
      }
    } catch (error) {
      console.error("Failed to check registration:", error)
    }
  }

  const handleRegister = async () => {
    // Check if event is paid
    if (event.isPaid && event.price > 0) {
      console.log("Initiating payment for event:", event.title, "Amount:", event.price)
      // Initiate payment for paid events
      initiatePayment(
        id,
        event.title,
        event.price,
        (data) => {
          // Payment successful
          console.log("Payment successful:", data)
          setQrCode(data.registration.qrCode)
          setIsRegistered(true)
          alert("Payment successful! You are now registered for the event.")
          checkRegistrationStatus() // Refresh registration status
        },
        (error) => {
          // Payment failed or cancelled
          console.error("Payment error:", error)
          alert(error)
        }
      )
    } else {
      // Free event - use regular registration
      console.log("Registering for free event:", event.title)
      setActionLoading(true)
      try {
        const response = await api.post(`/registrations/${id}/register`)
        console.log("Registration successful:", response.data)
        setQrCode(response.data.qrCode)
        setIsRegistered(true)
        alert("Successfully registered for the event!")
        checkRegistrationStatus() // Refresh registration status
      } catch (error) {
        console.error("Failed to register:", error)
        alert(error.response?.data?.message || "Failed to register for event")
      } finally {
        setActionLoading(false)
      }
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
      const response = await api.post(`/events/${id}/approve`)
      setEvent({ ...event, status: "approved" })
      alert("Event approved successfully!")
    } catch (error) {
      console.error("Failed to approve:", error)
      alert(error.response?.data?.message || "Failed to approve event")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    setActionLoading(true)
    try {
      const response = await api.post(`/events/${id}/reject`)
      setEvent({ ...event, status: "rejected" })
      alert("Event rejected")
    } catch (error) {
      console.error("Failed to reject:", error)
      alert(error.response?.data?.message || "Failed to reject event")
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
    <div className="bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-foreground mb-3">{event.title}</h1>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                        {event.category}
                      </span>
                      {event.status && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === "approved" 
                            ? "bg-green-100 text-green-700" 
                            : event.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      )}
                      {isRegistered && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          ✓ Registered
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background/80 backdrop-blur">
                    <Calendar size={24} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="font-semibold text-foreground">{new Date(event.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background/80 backdrop-blur">
                    <MapPin size={24} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Venue</p>
                      <p className="font-semibold text-foreground">{event.venue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{event.fullDescription || event.description}</p>
              </CardContent>
            </Card>

            {/* Registration Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Participants</span>
                    <span className="text-2xl font-bold text-foreground">
                      {event.participants?.length || 0} / {event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${((event.participants?.length || 0) / event.capacity) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {event.capacity - (event.participants?.length || 0)} spots remaining
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* QR Code for registered students - Moved to sidebar */}
            {isRegistered && qrCode && user?.role === "student" && (
              <QRDisplay qrValue={qrCode} eventId={id} />
            )}
            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organized By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {event.organizerId?.name?.charAt(0) || event.organizer?.charAt(0) || "O"}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{event.organizerId?.name || event.organizer || "Event Organizer"}</p>
                    <p className="text-xs text-muted-foreground">Event Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Card for Paid Events */}
            {event.isPaid && event.price > 0 && !isRegistered && user?.role === "student" && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Registration Fee</p>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <IndianRupee size={32} className="text-green-600" />
                      <span className="text-4xl font-bold text-green-600">{event.price}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-green-700">
                      <span className="w-2 h-2 rounded-full bg-green-600"></span>
                      <span>Secure payment via Razorpay</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons for Students */}
            {user && user.role === "student" && (
              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={isRegistered ? handleUnregister : handleRegister}
                disabled={actionLoading || paymentLoading || (event.participants?.length >= event.capacity && !isRegistered)}
                variant={isRegistered ? "outline" : "default"}
              >
                {actionLoading || paymentLoading
                  ? "Processing..."
                  : isRegistered
                  ? "Unregister from Event"
                  : event.participants?.length >= event.capacity
                  ? "Event Full"
                  : event.isPaid && event.price > 0
                  ? `Pay ₹${event.price} & Register`
                  : "Register for Free"}
              </Button>
            )}

            {/* Admin Actions */}
            {user && user.role === "admin" && (
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleApprove} 
                  disabled={actionLoading || event.status === "approved"}
                >
                  {actionLoading ? "Processing..." : event.status === "approved" ? "✓ Approved" : "Approve Event"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleReject}
                  disabled={actionLoading || event.status === "rejected"}
                >
                  {actionLoading ? "Processing..." : event.status === "rejected" ? "Rejected" : "Reject Event"}
                </Button>
              </div>
            )}

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{event.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{event.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{event.status || "Active"}</span>
                </div>
                {event.isPaid && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-green-600">Paid Event</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
