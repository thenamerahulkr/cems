import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"
import Button from "../../components/ui/Button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <Home size={16} className="mr-2" />
              Go to Homepage
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? Contact support or visit our{" "}
            <Link to="/" className="text-primary hover:text-primary/90">
              homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}