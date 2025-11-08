// My events page
import { useState, useEffect } from "react"
import { Card, CardContent } from "../components/ui/Card"
import EventCard from "../components/EventCard"
import api from "../api/api"

export default function MyEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    try {
      const response = await api.get("/my-events")
      // Mock response
      setEvents(
        response.data.events || [
          {
            id: 1,
            title: "Tech Summit 2024",
            description: "Join industry leaders for talks on AI and web development",
            category: "Technical",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            venue: "Main Auditorium",
            registrations: 245,
          },
        ],
      )
    } catch (error) {
      console.error("Failed to fetch my events:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Registered Events</h1>
        <p className="text-muted-foreground mb-8">Events you've registered for</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">You haven't registered for any events yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
