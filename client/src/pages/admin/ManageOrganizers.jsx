import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, Trash2, UserCheck, AlertCircle, Search } from "lucide-react"
import { toast } from "sonner"
import api from "../../api/api"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"

export default function ManageOrganizers() {
  const [organizers, setOrganizers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchOrganizers()
  }, [])

  const fetchOrganizers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/users")
      const allOrganizers = response.data.users.filter(u => u.role === "organizer")
      setOrganizers(allOrganizers)
    } catch (error) {
      // Failed to fetch organizers
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (organizerId) => {
    try {
      await api.post(`/admin/organizers/${organizerId}/approve`)
      toast.success("Organizer approved successfully! Email sent to organizer.")
      fetchOrganizers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve organizer")
    }
  }

  const handleReject = async (organizerId) => {
    if (!confirm("Are you sure you want to reject this organizer?")) return
    
    try {
      await api.post(`/admin/organizers/${organizerId}/reject`)
      toast.success("Organizer rejected")
      fetchOrganizers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject organizer")
    }
  }

  const handleDelete = async (organizerId) => {
    if (!confirm("Are you sure you want to delete this organizer? This action cannot be undone.")) return
    
    try {
      await api.delete(`/admin/users/${organizerId}`)
      toast.success("Organizer deleted successfully")
      fetchOrganizers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete organizer")
    }
  }

  const filteredOrganizers = organizers.filter(org => {
    // Filter by status
    const statusMatch = filter === "all" || org.status === filter
    
    // Filter by search term
    const searchMatch = !searchTerm || 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.department && org.department.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return statusMatch && searchMatch
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrganizers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOrganizers = filteredOrganizers.slice(startIndex, endIndex)

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchTerm])

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
      approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Rejected" },
    }
    const badge = badges[status] || badges.pending
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading organizers...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: organizers.length,
    pending: organizers.filter(o => o.status === "pending").length,
    approved: organizers.filter(o => o.status === "approved").length,
    rejected: organizers.filter(o => o.status === "rejected").length,
  }

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Manage Organizers</h1>
            <p className="text-muted-foreground">Approve, reject, or manage event organizers</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <UserCheck size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <CheckCircle size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.approved}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <XCircle size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.rejected}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 border-b border-border">
                {["all", "pending", "approved", "rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 font-medium capitalize transition-colors ${
                      filter === tab
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab} ({tab === "all" ? stats.total : stats[tab]})
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organizers List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserCheck size={16} className="text-primary" />
                </div>
                {filter === "all" ? "All Organizers" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Organizers`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrganizers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Organizers Found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedOrganizers.map((organizer) => (
                    <div
                      key={organizer._id}
                      className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-background"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                          {organizer.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{organizer.name}</h3>
                            {getStatusBadge(organizer.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{organizer.email}</p>
                          {organizer.department && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Department: {organizer.department}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Registered: {new Date(organizer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {organizer.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(organizer._id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(organizer._id)}
                            >
                              <XCircle size={14} className="mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {organizer.status === "rejected" && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(organizer._id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Approve
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(organizer._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredOrganizers.length)} of {filteredOrganizers.length} organizers
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        
                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-foreground hover:bg-secondary/80"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
