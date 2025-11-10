// Organizer Dashboard - Home page for organizers
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, CheckCircle, Clock, XCircle, Eye, Trash2, IndianRupee, Search } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import api from "../../api/api"
import Button from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"
import Input from "../../components/ui/Input"

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Data states
  const [myEvents, setMyEvents] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const eventsRes = await api.get("/events")
      
      const events = eventsRes.data.events || []
      const userEvents = events.filter(e => e.organizerId?._id === user._id || e.organizerId === user._id)
      
      setMyEvents(userEvents)
      
      // Calculate stats
      setStats({
        totalEvents: userEvents.length,
        pendingEvents: userEvents.filter(e => e.status === "pending").length,
        approvedEvents: userEvents.filter(e => e.status === "approved").length,
        totalParticipants: userEvents.reduce((sum, e) => sum + (e.participants?.length || 0), 0)
      })
    } catch (error) {
      // Failed to fetch dashboard data
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    
    try {
      await api.delete(`/events/${eventId}`)
      // Event deleted successfully
      fetchDashboardData()
    } catch (error) {
      // Failed to delete event
    }
  }

  // Filter events
  const filteredEvents = myEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": return CheckCircle
      case "pending": return Clock
      case "rejected": return XCircle
      default: return Clock
    }
  }

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Calendar size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.pendingEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <CheckCircle size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.approvedEvents || 0}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalParticipants || 0}</div>
                <div className="text-sm text-muted-foreground">Participants</div>
              </CardContent>
            </Card>
          </div>

          {/* My Events */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">My Events</h2>
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-border bg-background"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

              {/* Events List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No events found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredEvents.map((event) => {
                    const StatusIcon = getStatusIcon(event.status)
                    return (
                      <div key={event._id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                  <StatusIcon size={14} />
                                  {event.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar size={16} />
                                  {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users size={16} />
                                  {event.participants?.length || 0} / {event.capacity}
                                </div>
                                {event.isPaid && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <IndianRupee size={16} />
                                    ₹{event.price}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate(`/events/${event._id}`)}
                              >
                                <Eye size={16} className="mr-2" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/participants/${event._id}`)}
                              >
                                <Users size={16} className="mr-2" />
                                Participants
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteEvent(event._id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                      </div>
                    )
                  })}
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  )
}
