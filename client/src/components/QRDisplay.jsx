// QR display
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"

export default function QRDisplay({ qrValue, eventId }) {
  // Generate QR code using QR Server API
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue || "")}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Show this code at the event for check-in</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-xl border">
          {qrValue && <img src={qrImageUrl || "/placeholder.svg"} alt="Event QR Code" width={200} height={200} />}
        </div>
        <p className="text-sm text-muted-foreground mt-4">Event ID: {eventId}</p>
      </CardContent>
    </Card>
  )
}
