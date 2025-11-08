// Dialog component
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4 relative">{children}</div>
        </div>
      )}
    </>
  )
}

const DialogTrigger = ({ asChild, children, onClick }) => {
  return <div onClick={onClick}>{children}</div>
}

const DialogContent = ({ className, children, onClose, ...props }) => (
  <div className={cn("p-6 relative", className)} {...props}>
    <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
      <X size={20} />
    </button>
    {children}
  </div>
)

const DialogHeader = ({ className, ...props }) => <div className={cn("mb-4", className)} {...props} />

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-bold text-foreground", className)} {...props} />
)

const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }
