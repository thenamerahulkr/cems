// Manage Users - Admin page to manage all users
import { useState, useEffect } from "react"
import { Users, UserCheck, Activity, Shield, Trash2, AlertCircle, Mail, Calendar, Search } from "lucide-react"
import api from "../../api/api"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, student, organizer, admin
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/users")
      setUsers(response.data.users || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return
    
    try {
      await api.delete(`/admin/users/${userId}`)
      alert("User deleted successfully")
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user")
    }
  }

  const filteredUsers = users.filter(user => {
    // Filter by role
    const roleMatch = filter === "all" || user.role === filter
    
    // Filter by search term
    const searchMatch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return roleMatch && searchMatch
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchTerm])

  const getRoleBadge = (role) => {
    const badges = {
      student: { bg: "bg-blue-100", text: "text-blue-700", icon: UserCheck, label: "Student" },
      organizer: { bg: "bg-purple-100", text: "text-purple-700", icon: Activity, label: "Organizer" },
      admin: { bg: "bg-red-100", text: "text-red-700", icon: Shield, label: "Admin" },
    }
    const badge = badges[role] || badges.student
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
      approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
    }
    const badge = badges[status] || badges.approved
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === "student").length,
    organizers: users.filter(u => u.role === "organizer").length,
    admins: users.filter(u => u.role === "admin").length,
  }

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Manage Users 👤</h1>
            <p className="text-muted-foreground">View and manage all platform users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <UserCheck size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.students}</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Activity size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.organizers}</div>
                <div className="text-sm text-muted-foreground">Organizers</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Shield size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stats.admins}</div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter Section */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Search Bar */}
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

              {/* Filter Tabs */}
              <div className="flex gap-2 border-b border-border">
                {["all", "student", "organizer", "admin"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 font-medium capitalize transition-colors ${
                      filter === tab
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab} ({tab === "all" ? stats.total : stats[tab + "s"] || stats[tab]})
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users size={16} className="text-primary" />
                </div>
                {filter === "all" ? "All Users" : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Users Found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-background"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{user.name}</h3>
                            {getRoleBadge(user.role)}
                            {user.role === "organizer" && getStatusBadge(user.status)}
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              <span>{user.email}</span>
                            </div>
                            {user.department && (
                              <div className="flex items-center gap-1">
                                <span>•</span>
                                <span>{user.department}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        {user.role !== "admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(user._id, user.name)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        {user.role === "admin" && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                            <Shield size={14} />
                            <span>Protected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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
