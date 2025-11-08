// Event detail page
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, MapPin, Share2, ArrowLeft, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import Button from "../components/ui/Button"
import QRDisplay from "../components/QRDisplay"
import api from "../api/api"
import { useAuth } from "../context/AuthContext"
import { useRazorpay } from "../hooks/useRazorpay"

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
      // Initiate payment for paid events
      initiatePayment(
        id,
        event.title,
        event.price,
        (data) => {
          // Payment successful
          setQrCode(data.registration.qrCode)
          setIsRegistered(true)
          alert("Payment successful! You are now registered for the event.")
          checkRegistrationStatus() // Refresh registration status
        },
        (error) => {
          // Payment failed or cancelled
          alert(error)
        }
      )
    } else {
      // Free event - use regular registration
      setActionLoading(true)
      try {
        const response = await api.post(`/registrations/${id}/register`)
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
                  <div className="flex-1">
                    <CardTitle className="text-3xl">{event.title}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-sm text-muted-foreground">{event.category}</p>
                      {event.status && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === "approved" 
                            ? "bg-green-100 text-green-800" 
                            : event.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      )}
                    </div>
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
              <>
                {event.isPaid && event.price > 0 && !isRegistered && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Registration Fee</p>
                          <div className="flex items-center gap-1 mt-1">
                            <IndianRupee size={24} className="text-green-600" />
                            <span className="text-3xl font-bold text-green-600">{event.price}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Secure Payment</p>
                          <p className="text-xs text-green-600 font-medium">via Razorpay</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Button
                  className="w-full"
                  onClick={isRegistered ? handleUnregister : handleRegister}
                  disabled={actionLoading || paymentLoading}
                  variant={isRegistered ? "outline" : "primary"}
                >
                  {actionLoading || paymentLoading
                    ? "Processing..."
                    : isRegistered
                    ? "Unregister"
                    : event.isPaid && event.price > 0
                    ? `Pay ₹${event.price} & Register`
                    : "Register Now"}
                </Button>
              </>
            )}

            {user && user.role === "admin" && (
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleApprove} 
                  disabled={actionLoading || event.status === "approved"}
                >
                  {actionLoading ? "Processing..." : event.status === "approved" ? "Approved ✓" : "Approve Event"}
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
