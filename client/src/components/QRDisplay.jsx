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
    <Card>
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Show this code at the event for check-in</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          {qrValue ? (
            <img 
              src={qrImageUrl} 
              alt="Event QR Code" 
              width={200} 
              height={200}
              className="w-[200px] h-[200px]"
            />
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded">
              <p className="text-sm text-muted-foreground">No QR Code</p>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-4">Event ID: {eventId}</p>
      </CardContent>
    </Card>
  )
}
