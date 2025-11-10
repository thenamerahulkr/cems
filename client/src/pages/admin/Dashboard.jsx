import { useState, useEffect } from "react"
import { 
  Calendar, 
  Users, 
  TrendingUp,
  Activity,
  UserCheck,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../context/AuthContext"
import api from "../../api/api"
import Button from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"

export default function AdminDashboard() {
  const { user } = useAuth()
  
  // Data states
  const [events, setEvents] = useState([])
  const [pendingOrganizers, setPendingOrganizers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [eventsRes, pendingOrgsRes, statsRes] = await Promise.all([
        api.get("/events"),
        api.get("/admin/pending-organizers"),
        api.get("/admin/stats")
      ])
      
      setEvents(eventsRes.data.events || [])
      setPendingOrganizers(pendingOrgsRes.data.organizers || [])
      setStats(statsRes.data || {})
    } catch (error) {
      // Failed to fetch dashboard data
    } finally {
      setLoading(false)
    }
  }

  const handleApproveEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/approve`)
      toast.success("Event approved successfully")
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve event")
    }
  }

  const handleRejectEvent = async (eventId) => {
    if (!confirm("Are you sure you want to reject this event?")) return
    
    try {
      await api.post(`/events/${eventId}/reject`)
      toast.success("Event rejected")
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject event")
    }
  }

  const handleApproveOrganizer = async (organizerId) => {
    try {
      await api.post(`/admin/organizers/${organizerId}/approve`)
      toast.success("Organizer approved successfully")
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve organizer")
    }
  }

  const handleRejectOrganizer = async (organizerId) => {
    if (!confirm("Are you sure you want to reject this organizer?")) return
    
    try {
      await api.post(`/admin/organizers/${organizerId}/reject`)
      toast.success("Organizer rejected")
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject organizer")
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
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name || "Admin"}! 👋</h1>
            <p className="text-muted-foreground">Here's what's happening with your platform today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalUsers || 0}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Calendar size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <TrendingUp size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalRegistrations || 0}</div>
                <div className="text-sm text-muted-foreground">Registrations</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.pendingEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Pending Events</div>
              </CardContent>
            </Card>
          </div>

          {/* User Role Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <UserCheck size={28} className="text-primary mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stats.studentCount || 0}</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Activity size={28} className="text-primary mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stats.organizerCount || 0}</div>
                <div className="text-sm text-muted-foreground">Organizers</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock size={28} className="text-primary mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{pendingOrganizers.length}</div>
                <div className="text-sm text-muted-foreground">Pending Organizers</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <CheckCircle size={28} className="text-primary mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stats.approvedEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Approved Events</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Events */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Clock size={24} className="text-yellow-600" />
              Pending Events - Needs Approval
            </h2>
              {events.filter(e => e.status === "pending").length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">All events are reviewed!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.filter(e => e.status === "pending").slice(0, 5).map((event) => (
                    <div key={event._id} className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
                      <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {event.organizerId?.name} • {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveEvent(event._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleRejectEvent(event._id)}
                        >
                          <XCircle size={16} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Pending Organizers */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <UserCheck size={24} className="text-orange-600" />
              Pending Organizer Approvals ({pendingOrganizers.length})
            </h2>
            {pendingOrganizers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground">No pending organizer approvals!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrganizers.slice(0, 5).map((organizer) => (
                  <div key={organizer._id} className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                        {organizer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{organizer.name}</h3>
                        <p className="text-sm text-muted-foreground">{organizer.email}</p>
                        {organizer.department && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Department: {organizer.department}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveOrganizer(organizer._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleRejectOrganizer(organizer._id)}
                      >
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
