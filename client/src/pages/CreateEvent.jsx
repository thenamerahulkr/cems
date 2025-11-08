// Create event page
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import Select from "../components/ui/Select"
import api from "../api/api"

export default function CreateEvent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    time: "",
    venue: "",
    capacity: "",
    isPaid: false,
    price: "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Prepare event data
      const eventData = {
        ...formData,
        price: formData.isPaid ? Number(formData.price) : 0,
      }
      
      const response = await api.post("/events", eventData)
      alert("Event created successfully! It will be visible after admin approval.")
      navigate("/events")
    } catch (error) {
      console.error("Failed to create event:", error)
      alert(error.response?.data?.message || "Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Tech Summit 2024"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent min-h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select id="category" name="category" value={formData.category} onChange={handleChange}>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    name="capacity"
                    placeholder="Maximum participants"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input id="time" type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  name="venue"
                  placeholder="Event location"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Payment Section */}
              <div className="border-t border-border pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPaid" className="text-base font-semibold">
                        Paid Event
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enable this if you want to charge a registration fee
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="isPaid"
                        name="isPaid"
                        checked={formData.isPaid}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {formData.isPaid && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <Label htmlFor="price" className="flex items-center gap-2">
                        <IndianRupee size={16} />
                        Registration Fee *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        name="price"
                        placeholder="Enter amount in INR"
                        value={formData.price}
                        onChange={handleChange}
                        required={formData.isPaid}
                        min="1"
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Students will pay this amount via Razorpay during registration
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Event"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
