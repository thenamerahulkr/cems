// Notifications page
import { useState, useEffect } from "react"
import { Bell, Trash2, Check } from "lucide-react"
import { Card, CardContent } from "../components/ui/Card"
import Button from "../components/ui/Button"
import api from "../api/api"

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications")
      // Mock response
      setNotifications(
        response.data.notifications || [
          {
            id: 1,
            title: "Event Registration Confirmed",
            message: "Your registration for Tech Summit 2024 has been confirmed.",
            type: "info",
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: 2,
            title: "Event Starting Soon",
            message: "Tech Summit 2024 starts in 2 hours.",
            type: "warning",
            read: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
        ],
      )
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`, {})
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const deleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
        <p className="text-muted-foreground mb-8">Stay updated with event information</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <Card key={notif.id} className={notif.read ? "opacity-75" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{notif.title}</h3>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      {!notif.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)} title="Mark as read">
                          <Check size={16} />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notif.id)} title="Delete">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell size={40} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No notifications yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
