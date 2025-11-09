// Participants page
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Download, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import api from "../../api/api"

export default function Participants() {
  const { eventId } = useParams()
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParticipants()
  }, [eventId])

  const fetchParticipants = async () => {
    try {
      const response = await api.get(`/events/${eventId}/participants`)
      // Mock response
      setParticipants(
        response.data.participants || [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            registeredAt: "2024-01-15",
            status: "confirmed",
            checkedIn: true,
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            registeredAt: "2024-01-16",
            status: "confirmed",
            checkedIn: false,
          },
        ],
      )
    } catch (error) {
      console.error("Failed to fetch participants:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Registered At", "Status", "Checked In"]
    const rows = participants.map((p) => [p.name, p.email, p.registeredAt, p.status, p.checkedIn ? "Yes" : "No"])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `participants-${eventId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Event Participants</h1>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Participants ({participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>{participant.registeredAt}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{participant.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {participant.checkedIn ? (
                            <Badge variant="default">
                              <Check size={14} className="mr-1 inline" />
                              Checked In
                            </Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Check size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <X size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
