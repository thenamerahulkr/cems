// Events page
import { useEffect, useState } from "react"
import { Search, Filter } from "lucide-react"
import EventCard from "../components/EventCard"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import api from "../api/api"

export default function Events() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, category])

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events")
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
          {
            id: 2,
            title: "Annual Sports Day",
            description: "Football, Basketball, and Track & Field competitions",
            category: "Sports",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            venue: "Sports Ground",
            registrations: 180,
          },
          {
            id: 3,
            title: "Cultural Festival",
            description: "Music, Dance, and Drama performances",
            category: "Cultural",
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            venue: "Amphitheater",
            registrations: 312,
          },
          {
            id: 4,
            title: "Coding Competition",
            description: "Compete with peers in a 4-hour coding challenge",
            category: "Technical",
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            venue: "CS Lab",
            registrations: 89,
          },
        ],
      )
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let result = events

    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (category !== "all") {
      result = result.filter((event) => event.category === category)
    }

    setFilteredEvents(result)
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">All Events</h1>
          <p className="text-muted-foreground">Discover all upcoming events and activities</p>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Search size={16} className="inline mr-2" />
                Search Events
              </label>
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Filter size={16} className="inline mr-2" />
                Filter by Category
              </label>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground mb-4">No events found matching your criteria</p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm("")
                setCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>
    </div>
  )
}
