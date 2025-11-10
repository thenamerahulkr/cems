// Organizer Dashboard Home - Overview with recent activity
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, CheckCircle, Clock, TrendingUp, Bell, IndianRupee, UserPlus } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import api from "../../api/api"
import Button from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"

export default function OrganizerDashboardHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [eventsRes, notificationsRes] = await Promise.all([
        api.get("/events"),
        api.get("/notifications")
      ])
      
      const events = eventsRes.data.events || []
      const userEvents = events.filter(e => e.organizerId?._id === user._id || e.organizerId === user._id)
      
      // Calculate total revenue from paid events
      const totalRevenue = userEvents.reduce((sum, e) => {
        if (e.isPaid && e.participants) {
          return sum + (e.price * e.participants.length)
        }
        return sum
      }, 0)

      // Get today's registrations count from notifications
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const notifications = notificationsRes.data.notifications || []
      const todayRegistrations = notifications.filter(n => {
        const notifDate = new Date(n.createdAt)
        notifDate.setHours(0, 0, 0, 0)
        return notifDate.getTime() === today.getTime() && 
               (n.message.includes("registered for") || n.message.includes("paid"))
      }).length

      // Calculate stats
      setStats({
        totalEvents: userEvents.length,
        pendingEvents: userEvents.filter(e => e.status === "pending").length,
        approvedEvents: userEvents.filter(e => e.status === "approved").length,
        totalParticipants: userEvents.reduce((sum, e) => sum + (e.participants?.length || 0), 0),
        totalRevenue,
        todayRegistrations
      })

      // Get upcoming events (next 30 days, approved only)
      const now = new Date()
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const upcoming = userEvents
        .filter(e => {
          const eventDate = new Date(e.date)
          return e.status === "approved" && eventDate >= now && eventDate <= thirtyDaysLater
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
      
      setUpcomingEvents(upcoming)

      // Get recent activity (all notifications, latest 8)
      const activity = notifications.slice(0, 8).map(notif => ({
        id: notif._id,
        type: notif.type || "info",
        message: notif.message,
        time: notif.createdAt,
        read: notif.read
      }))
      
      setRecentActivity(activity)

      // Get recent registrations (filter registration notifications)
      const registrations = notifications
        .filter(n => n.message.includes("registered for") || n.message.includes("paid"))
        .slice(0, 5)
        .map(notif => ({
          id: notif._id,
          message: notif.message,
          time: notif.createdAt,
          isPaid: notif.message.includes("paid")
        }))
      
      setRecentRegistrations(registrations)

    } catch (error) {
      // Failed to fetch dashboard data
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
            <p className="text-muted-foreground">Here's what's happening with your events</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Calendar size={28} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock size={28} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.pendingEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Pending Approval</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users size={28} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalParticipants || 0}</div>
                <div className="text-sm text-muted-foreground">Total Participants</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <UserPlus size={28} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.todayRegistrations || 0}</div>
                <div className="text-sm text-muted-foreground">Today's Registrations</div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Card (if any paid events) */}
          {stats.totalRevenue > 0 && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <IndianRupee size={24} />
                      <span className="text-sm font-medium">Total Revenue</span>
                    </div>
                    <div className="text-4xl font-bold text-green-900">₹{stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-sm text-green-700 mt-1">From paid event registrations</p>
                  </div>
                  <div className="text-green-600">
                    <TrendingUp size={48} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Registrations */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <UserPlus size={24} className="text-primary" />
                    Recent Registrations
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/notifications")}>
                    View All
                  </Button>
                </div>
                
                {recentRegistrations.length > 0 ? (
                  <div className="space-y-2">
                    {recentRegistrations.map((reg) => (
                      <div
                        key={reg.id}
                        className={`flex items-start gap-3 p-3 border rounded-xl ${
                          reg.isPaid ? "border-green-200 bg-green-50" : "border-border"
                        }`}
                      >
                        <div className={reg.isPaid ? "text-green-600 mt-1" : "text-primary mt-1"}>
                          {reg.isPaid ? <IndianRupee size={20} /> : <UserPlus size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium">{reg.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(reg.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserPlus size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className="text-muted-foreground text-sm">No registrations yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    Upcoming
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/my-events")}>
                    View All
                  </Button>
                </div>
                
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event._id}
                        className="p-3 border border-border rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/events/${event._id}`)}
                      >
                        <h3 className="font-semibold text-sm text-foreground mb-2">{event.title}</h3>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            {event.participants?.length || 0}/{event.capacity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar size={40} className="mx-auto text-muted-foreground mb-2 opacity-50" />
                    <p className="text-muted-foreground text-xs">No upcoming events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Recent Activity */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Bell size={24} className="text-primary" />
                All Recent Activity
              </h2>
              
              {recentActivity.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 p-3 border rounded-xl ${
                        activity.read ? "opacity-60" : "border-primary/30 bg-primary/5"
                      }`}
                    >
                      <div className={`mt-1 ${
                        activity.type === "success" ? "text-green-600" :
                        activity.type === "error" ? "text-red-600" :
                        "text-primary"
                      }`}>
                        {activity.type === "success" ? <CheckCircle size={18} /> :
                         activity.type === "error" ? <Clock size={18} /> :
                         <Bell size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                  <p className="text-muted-foreground text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
