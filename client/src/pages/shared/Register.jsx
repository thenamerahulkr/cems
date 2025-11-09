// Register page
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { User, Mail, Lock, Loader, Calendar, Zap, Users, ArrowRight, CheckCircle } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Label from "../../components/ui/Label"

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await register(formData.name, formData.email, formData.password, formData.role)
      
      // If organizer registration requires approval, redirect to login with message
      if (response.requiresApproval) {
        navigate("/login", { 
          state: { 
            message: "Registration successful! Your account is pending admin approval. You will receive an email once approved." 
          } 
        })
      } else {
        // Student registration - auto-login and go to home
        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding & Benefits */}
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
              Join CEMS Today! 🎉
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Create your account and start discovering amazing campus events in seconds.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Free to Join</h3>
                  <p className="text-sm text-muted-foreground">No credit card required, start exploring immediately</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Access All Events</h3>
                  <p className="text-sm text-muted-foreground">Browse and register for hundreds of campus events</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Instant QR Codes</h3>
                  <p className="text-sm text-muted-foreground">Get your event QR code immediately after registration</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Build Your Network</h3>
                  <p className="text-sm text-muted-foreground">Connect with students and expand your campus network</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground italic mb-3">
                "CEMS made it so easy to find and register for events. I've attended 5 workshops this semester!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Sarah Johnson</div>
                  <div className="text-xs text-muted-foreground">Computer Science Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
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
                  <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
                  <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-1">
                      <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

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
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
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

                  <div>
                    <Label>Register as</Label>
                    <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={formData.role === "organizer"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">Event Organizer</span>
                </label>
              </div>
              {formData.role === "organizer" && (
                <p className="text-xs text-muted-foreground mt-2">
                  ⏳ Your account will need admin approval before you can login
                </p>
              )}
            </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
                    </div>
                  </div>

                  <Link to="/login">
                    <Button type="button" variant="outline" className="w-full" size="lg">
                      Sign In Instead
                    </Button>
                  </Link>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By creating an account, you agree to our{" "}
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
