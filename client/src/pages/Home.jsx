// Home page - Dashboard for logged-in users
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  Plus, 
  Clock, 
  CheckCircle, 
  Bell,
  TrendingUp,
  BarChart3,
  Ticket
} from "lucide-react"
import Button from "../components/ui/Button"
import EventCard from "../components/EventCard"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import api from "../api/api"
import { useAuth } from "../context/AuthContext"

export default function Home() {
  const [events, setEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch upcoming events
      const eventsRes = await api.get("/events?limit=4")
      setEvents(eventsRes.data.events || [])

      // Fetch user-specific data based on role
      if (user?.role === "student") {
        const myEventsRes = await api.get("/registrations/my-events")
        setMyEvents(myEventsRes.data.events || [])
      } else if (user?.role === "admin") {
        const statsRes = await api.get("/admin/stats")
        setStats(statsRes.data || {})
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Role-specific quick actions
  const getQuickActions = () => {
    if (user?.role === "student") {
      return [
        { icon: Calendar, label: "Browse Events", action: () => navigate("/events"), color: "bg-blue-500" },
        { icon: Ticket, label: "My Events", action: () => navigate("/my-events"), color: "bg-purple-500" },
        { icon: Bell, label: "Notifications", action: () => navigate("/notifications"), color: "bg-green-500" },
      ]
    } else if (user?.role === "organizer") {
      return [
        { icon: Plus, label: "Create Event", action: () => navigate("/create-event"), color: "bg-blue-500" },
        { icon: Calendar, label: "Browse Events", action: () => navigate("/events"), color: "bg-purple-500" },
        { icon: Users, label: "My Events", action: () => navigate("/my-events"), color: "bg-green-500" },
      ]
    } else if (user?.role === "admin") {
      return [
        { icon: BarChart3, label: "Dashboard", action: () => navigate("/admin"), color: "bg-blue-500" },
        { icon: Plus, label: "Create Event", action: () => navigate("/create-event"), color: "bg-purple-500" },
        { icon: CheckCircle, label: "Approve Events", action: () => navigate("/events"), color: "bg-green-500" },
      ]
    }
    return []
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Split Design */}
      <section className="relative min-h-[600px] px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary">
                College Event Management
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Campus,
                <br />
                <span className="text-primary">Your Events</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of students discovering and creating amazing campus experiences. From tech talks to sports tournaments.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate("/events")} className="text-base">
                  Browse Events
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                {!user && (
                  <Button variant="outline" size="lg" onClick={() => navigate("/register")} className="text-base">
                    Sign Up Free
                  </Button>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">1.2K+</div>
                  <div className="text-sm text-muted-foreground">Active Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">89</div>
                  <div className="text-sm text-muted-foreground">Events/Month</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col h-full">
                      <Icon size={36} className={`${stat.color} mb-4`} />
                      <div className="mt-auto">
                        <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything you need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you discover, create, and manage campus events effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group">
                  <div className="bg-card border border-border rounded-xl p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon size={26} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-3">Happening Soon</h2>
              <p className="text-lg text-muted-foreground">
                Don't miss these upcoming events
              </p>
            </div>
            <Link
              to="/events"
              className="hidden md:inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
            >
              See all events
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <div className="text-center mt-10 md:hidden">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
                >
                  See all events
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      CTA Section
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to create something amazing?
              </h2>
              <p className="text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
                Start organizing your own events and bring your campus community together
              </p>
              {user?.role === "organizer" || user?.role === "admin" ? (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/create-event")}
                  className="text-base font-semibold"
                >
                  Create Your Event
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="text-base font-semibold"
                >
                  Get Started Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
