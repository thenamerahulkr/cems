// Landing page
import { useNavigate } from "react-router-dom"
import { ArrowRight, Calendar, Users, Zap, CheckCircle, Star, TrendingUp } from "lucide-react"
import Button from "../../components/ui/Button"
import Footer from "../../components/Footer"

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Calendar,
      title: "Discover Events",
      description: "Browse hundreds of campus events across all categories",
    },
    {
      icon: Zap,
      title: "Instant Registration",
      description: "Register with one click and get your QR code instantly",
    },
    {
      icon: Users,
      title: "Connect & Network",
      description: "Meet like-minded students and build your campus network",
    },
  ]

  const stats = [
    { number: "1,200+", label: "Active Students" },
    { number: "89", label: "Events/Month" },
    { number: "12K+", label: "Registrations" },
    { number: "98%", label: "Satisfaction" },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "CEMS made it so easy to find and register for tech events. I've attended 5 workshops this semester!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Event Organizer",
      content: "Managing events has never been easier. The QR code system is brilliant for tracking attendance.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Cultural Club President",
      content: "Our event registrations increased by 200% after using CEMS. Highly recommend!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Star size={16} className="fill-current" />
              <span>Trusted by 1,200+ students</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your Campus Events,
              <br />
              <span className="text-primary">All in One Place</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover, create, and manage college events effortlessly. Join thousands of students making the most of
              their campus experience.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Button size="lg" onClick={() => navigate("/register")} className="text-base px-8">
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/events")} className="text-base px-8">
                Browse Events
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Students Love CEMS</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make the most of your college experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Get started in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Create Account</h3>
              <p className="text-muted-foreground">Sign up for free in less than a minute</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Find Events</h3>
              <p className="text-muted-foreground">Browse events by category, date, or venue</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Register & Attend</h3>
              <p className="text-muted-foreground">Get your QR code and check in at events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Students Say</h2>
            <p className="text-lg text-muted-foreground">Don't just take our word for it</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <TrendingUp size={48} className="mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
                Join 1,200+ students already using CEMS to discover amazing campus events
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="text-base font-semibold px-8"
                >
                  Sign Up Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="text-base font-semibold px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Already have an account?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">For Event Organizers</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Easy Event Creation</h3>
                    <p className="text-muted-foreground">Create and publish events in minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">QR Code Check-in</h3>
                    <p className="text-muted-foreground">Track attendance with QR codes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Automated Reminders</h3>
                    <p className="text-muted-foreground">Email reminders sent automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">Track registrations and attendance</p>
                  </div>
                </div>
              </div>
              <Button size="lg" onClick={() => navigate("/register")} className="mt-8">
                Start Organizing
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-2xl p-6">
                <Calendar size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">89</div>
                <div className="text-sm text-muted-foreground">Events Created</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <Users size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">12K+</div>
                <div className="text-sm text-muted-foreground">Total Attendees</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <Zap size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">2 min</div>
                <div className="text-sm text-muted-foreground">Avg. Setup Time</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <TrendingUp size={32} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
