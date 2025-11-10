// Main navigation
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Menu, X, LogOut } from "lucide-react"
import { Sheet, SheetContent } from "./ui/Sheet"
import Button from "./ui/Button"
import { Avatar, AvatarFallback } from "./ui/Avatar"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Role-specific navigation links
  const roleLinks = {
    student: [
      { path: "/", label: "Home", icon: "" },
      { path: "/events", label: "Browse Events", icon: "" },
      { path: "/my-registrations", label: "My Registrations", icon: "" },
      { path: "/notifications", label: "Notifications", icon: "" },
    ],
    organizer: [
      { path: "/my-events", label: "My Events", icon: "" },
      { path: "/create-event", label: "Create Event", icon: "" },
      { path: "/notifications", label: "Notifications", icon: "" },
    ],
    admin: [
      { path: "/manage-events", label: "Manage Events", icon: "" },
      { path: "/manage-organizers", label: "Manage Organizers", icon: "" },
      { path: "/users", label: "Manage Users", icon: "" },
      { path: "/notifications", label: "Notifications", icon: "" },
    ],
  }

  const navLinks = user ? roleLinks[user.role] || [] : []

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
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <Avatar>
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setProfileOpen(false)}
                      />
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20 py-2">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-1">Role: {user.role}</p>
                        </div>
                        <button
                          onClick={() => {
                            handleLogout()
                            setProfileOpen(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 font-medium"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 font-medium"
                >
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
          <div className="space-y-2 pt-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="border-t border-border pt-6 space-y-3">
              {user ? (
                <>
                  <div className="px-4 py-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
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
