// My Registered Events page
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, MapPin, Users, Ticket, QrCode } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import QRDisplay from "../../components/QRDisplay"
import api from "../../api/api"

export default function MyEvents() {
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyRegistrations()
  }, [])

  const fetchMyRegistrations = async () => {
    try {
      const response = await api.get("/registrations/my-events")
      console.log("My registrations:", response.data)
      setRegistrations(response.data.events || [])
    } catch (error) {
      console.error("Failed to fetch my registrations:", error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your registrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Registered Events 🎫</h1>
            <p className="text-muted-foreground">Events you've registered for with QR codes</p>
          </div>

          {/* Registrations List */}
          {registrations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {registrations.map((event) => (
                <Card key={event._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Event Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h2 className="text-2xl font-bold text-foreground">{event.title}</h2>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Registered
                            </span>
                          </div>
                          <p className="text-muted-foreground">{event.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar size={20} className="text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Date & Time</p>
                              <p className="font-medium">{new Date(event.date).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-foreground">
                            <MapPin size={20} className="text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Venue</p>
                              <p className="font-medium">{event.venue}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-foreground">
                            <Users size={20} className="text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Participants</p>
                              <p className="font-medium">{event.participants?.length || 0} registered</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-foreground">
                            <Ticket size={20} className="text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Category</p>
                              <p className="font-medium">{event.category}</p>
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/events/${event._id}`)}
                          className="w-full md:w-auto"
                        >
                          View Event Details
                        </Button>
                      </div>

                      {/* QR Code */}
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <QrCode size={20} className="text-primary" />
                            <h3 className="font-semibold text-foreground">Your QR Code</h3>
                          </div>
                          {event.qrCode ? (
                            <QRDisplay qrValue={event.qrCode} eventId={event._id} />
                          ) : (
                            <div className="p-8 border border-border rounded-xl bg-secondary/50">
                              <p className="text-sm text-muted-foreground">QR code not available</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-3">
                            Show this at the event entrance
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Ticket size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Registrations Yet</h3>
                <p className="text-muted-foreground mb-6">You haven't registered for any events yet.</p>
                <Button onClick={() => navigate("/events")}>
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
