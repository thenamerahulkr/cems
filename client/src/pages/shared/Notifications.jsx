// Notifications page
import { useState, useEffect } from "react"
import { Bell, Check, AlertCircle } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import api from "../../api/api"

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications")
      // Only show unread notifications
      const unreadNotifications = (response.data.notifications || []).filter(n => !n.read)
      setNotifications(unreadNotifications)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      // Remove from list after marking as read
      setNotifications((prev) => prev.filter((notif) => notif._id !== id))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  return (
    <div className="bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications 🔔</h1>
            <p className="text-muted-foreground">New alerts and updates</p>
          </div>
        
          {/* Notifications List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground mt-4">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <Card key={notif._id} className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <AlertCircle size={24} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        </div>
                        <p className="text-foreground font-medium">{notif.message}</p>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => markAsRead(notif._id)} 
                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                      >
                        <Check size={16} className="mr-1" />
                        Mark Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Bell size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium text-foreground mb-2">All caught up!</p>
                <p className="text-muted-foreground">No new notifications</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
