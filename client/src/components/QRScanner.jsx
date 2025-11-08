// QR scanner
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import Button from "./ui/Button"
import { Input } from "./ui/Input"
import api from "../api/api"

export default function QRScanner({ eventId }) {
  const [scanning, setScanning] = useState(true)
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [manualInput, setManualInput] = useState("")

  const handleScan = async (qrValue) => {
    if (qrValue) {
      setScanning(false)
      setLoading(true)
      try {
        // Mock API call to verify QR
        const response = await api.post("/qr/verify", {
          eventId,
          qrValue: qrValue,
        })
        // Sample response: { success: true, message: 'Participant checked in' }
        setMessage(response.data.message || "Verified successfully")
        setResult(qrValue)
      } catch (error) {
        setMessage(error.response?.data?.message || "Verification failed")
      } finally {
        setLoading(false)
        setTimeout(() => {
          setScanning(true)
          setResult(null)
          setMessage("")
          setManualInput("")
        }, 3000)
      }
    }
  }

  const handleManualScan = () => {
    if (manualInput.trim()) {
      handleScan(manualInput)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        {scanning && (
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-primary/30 bg-secondary/20 p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-4 border-2 border-primary/50 rounded-lg flex items-center justify-center">
                <div className="animate-pulse text-primary text-sm font-medium">📱 Camera</div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">QR Scanner would show camera feed here</p>
              <p className="text-xs text-muted-foreground">Enter QR value manually below to test:</p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Paste QR value here (e.g., event-123-user-456)"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleManualScan()}
                disabled={loading}
              />
              <Button onClick={handleManualScan} disabled={loading || !manualInput.trim()}>
                {loading ? "..." : "Verify"}
              </Button>
            </div>
          </div>
        )}
        {message && (
          <div className={`mt-4 p-4 rounded-xl ${result ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>
            {message}
          </div>
        )}
        <Button variant="secondary" className="w-full mt-4" onClick={() => setScanning(!scanning)} disabled={loading}>
          {loading ? "Processing..." : scanning ? "Stop Scanning" : "Resume Scanning"}
        </Button>
      </CardContent>
    </Card>
  )
}
