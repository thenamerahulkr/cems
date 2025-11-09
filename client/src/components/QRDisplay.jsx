// QR display
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"

export default function QRDisplay({ qrValue, eventId }) {
  // Check if qrValue is already a data URL (starts with data:image)
  const isDataUrl = qrValue && qrValue.startsWith('data:image')
  
  // If it's already a data URL, use it directly; otherwise use QR Server API
  const qrImageUrl = isDataUrl 
    ? qrValue 
    : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue || "")}`

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Your QR Code</CardTitle>
        <p className="text-sm text-muted-foreground">Show this code at the event for check-in</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-xl border-2 border-border shadow-sm">
            {qrValue ? (
              <img 
                src={qrImageUrl} 
                alt="Event QR Code" 
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-secondary rounded">
                <p className="text-sm text-muted-foreground">No QR Code</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Event ID: {eventId}</p>
        </div>
      </CardContent>
    </Card>
  )
}
