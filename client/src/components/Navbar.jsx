// Main navigation
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Menu, X, LogOut, Bell } from "lucide-react"
import { Sheet, SheetContent } from "./ui/Sheet"
import Button from "./ui/Button"
import { Avatar, AvatarFallback } from "./ui/Avatar"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Only show Home and Events if user is logged in
  const navLinks = user
    ? [
        { path: "/", label: "Home" },
        { path: "/events", label: "Events" },
      ]
    : []

  const roleLinks = {
    student: [{ path: "/my-events", label: "My Events" }],
    organizer: [{ path: "/create-event", label: "Create Event" }],
    admin: [
      { path: "/admin", label: "Admin" },
      { path: "/create-event", label: "Create Event" },
    ],
  }

  const userLinks = user ? roleLinks[user.role] || [] : []

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
              C
            </div>
            <span className="hidden sm:inline font-bold text-foreground">CEMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {userLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/notifications")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Bell size={20} />
                </button>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent onClose={() => setMobileOpen(false)}>
          <div className="space-y-6 pt-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {userLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border pt-6 space-y-3">
              {user ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full justify-center gap-2"
                    onClick={() => {
                      navigate("/notifications")
                      setMobileOpen(false)
                    }}
                  >
                    <Bell size={16} />
                    Notifications
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-center gap-2"
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      navigate("/login")
                      setMobileOpen(false)
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate("/register")
                      setMobileOpen(false)
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
