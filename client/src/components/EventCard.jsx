// Event card component
import { Link } from "react-router-dom"
import Badge from "./ui/Badge"
import { Calendar, MapPin, Users } from "lucide-react"

export default function EventCard({ event }) {
  const categoryColors = {
    Technical: "bg-blue-100 text-blue-900",
    Cultural: "bg-purple-100 text-purple-900",
    Sports: "bg-green-100 text-green-900",
  }

  // Use _id from MongoDB or id as fallback
  const eventId = event._id || event.id

  return (
    <Link to={`/events/${eventId}`}>
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary hover:shadow-md transition-all h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground text-lg line-clamp-2">{event.title}</h3>
          <Badge variant="secondary" className={categoryColors[event.category]}>
            {event.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{event.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-primary" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-primary" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-primary" />
            <span>{event.registrations || 0} registered</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
