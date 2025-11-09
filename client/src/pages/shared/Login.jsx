// Login page
import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Mail, Lock, Loader, Calendar, Users, Zap, ArrowRight } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Label from "../../components/ui/Label"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Check for success message from registration redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Clear the message from location state
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 border-r border-border">
          <div className="max-w-md">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                C
              </div>
              <span className="font-bold text-foreground text-2xl">CEMS</span>
            </Link>

            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome Back! 👋
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sign in to access your dashboard and manage your campus events seamlessly.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Discover Events</h3>
                  <p className="text-sm text-muted-foreground">Browse and register for amazing campus events</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Instant Registration</h3>
                  <p className="text-sm text-muted-foreground">Get your QR code instantly after registration</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Connect & Network</h3>
                  <p className="text-sm text-muted-foreground">Meet like-minded students and build connections</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-foreground">1.2K+</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">89</div>
                <div className="text-xs text-muted-foreground">Events/Month</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">98%</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link to="/" className="flex lg:hidden items-center justify-center space-x-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                C
              </div>
              <span className="font-bold text-foreground text-xl">CEMS</span>
            </Link>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
                  <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {successMessage && (
                    <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                      {successMessage}
                    </div>
                  )}
                  {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label htmlFor="password">Password</Label>
                      <a href="#forgot" className="text-xs text-primary hover:text-primary/90">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">New to CEMS?</span>
                    </div>
                  </div>

                  <Link to="/register">
                    <Button type="button" variant="outline" className="w-full" size="lg">
                      Create an Account
                    </Button>
                  </Link>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By signing in, you agree to our{" "}
              <a href="#terms" className="text-primary hover:text-primary/90">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#privacy" className="text-primary hover:text-primary/90">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
