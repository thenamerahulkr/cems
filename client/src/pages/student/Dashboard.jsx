// Student Dashboard - Home page for students
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, Bell, Ticket, TrendingUp, ArrowRight } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import api from "../../api/api"
import Button from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Data states
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [recommendedEvents, setRecommendedEvents] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [eventsRes, registrationsRes, notificationsRes] = await Promise.all([
        api.get("/events"),
        api.get("/registrations/my-events"),
        api.get("/notifications")
      ])
      
      const allEvents = eventsRes.data.events || []
      const myRegs = registrationsRes.data.events || []
      const notifs = notificationsRes.data.notifications || []

      // Get upcoming registered events (next 30 days)
      const now = new Date()
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const upcoming = myRegs
        .filter(e => {
          const eventDate = new Date(e.date)
          return eventDate >= now && eventDate <= thirtyDaysLater
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
      
      setUpcomingEvents(upcoming)

      // Get recommended events (approved, not registered, upcoming)
      const myRegIds = myRegs.map(r => r._id)
      const recommended = allEvents
        .filter(e => {
          const eventDate = new Date(e.date)
          return e.status === "approved" && 
                 !myRegIds.includes(e._id) && 
                 eventDate >= now
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6)
      
      setRecommendedEvents(recommended)

      // Calculate stats
      setStats({
        myRegistrations: myRegs.length,
        availableEvents: allEvents.filter(e => e.status === "approved").length,
        unreadNotifications: notifs.filter(n => !n.read).length
      })

    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-2xl p-8 border border-border">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-muted-foreground">Discover and register for amazing campus events</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/my-registrations")}>
              <CardContent className="pt-6">
                <Ticket size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.myRegistrations || 0}</div>
                <div className="text-sm text-muted-foreground">My Registrations</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/events")}>
              <CardContent className="pt-6">
                <Calendar size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.availableEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Available Events</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/notifications")}>
              <CardContent className="pt-6">
                <Bell size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.unreadNotifications || 0}</div>
                <div className="text-sm text-muted-foreground">Unread Notifications</div>
              </CardContent>
            </Card>
          </div>

          {/* My Upcoming Events */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Calendar size={24} className="text-primary" />
                  My Upcoming Events
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/my-registrations")}>
                  View All
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="p-4 border border-border rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={14} />
                              {event.venue}
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Registered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm">No upcoming events</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/events")}>
                    Browse Events
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Events */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp size={24} className="text-primary" />
                  Recommended for You
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
                  View All
                  <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
              
              {recommendedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedEvents.map((event) => (
                    <div
                      key={event._id}
                      className="border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {event.category}
                        </span>
                        {event.isPaid && (
                          <span className="text-xs font-medium text-green-600">₹{event.price}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          {event.participants?.length || 0}/{event.capacity}
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm">No events available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
