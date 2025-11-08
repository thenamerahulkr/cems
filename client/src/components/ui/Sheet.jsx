// Sheet component
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => onOpenChange(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-card shadow-lg">{children}</div>
        </>
      )}
    </>
  )
}

const SheetContent = ({ className, onClose, children, ...props }) => (
  <div className={cn("p-6 h-full overflow-y-auto relative", className)} {...props}>
    <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
      <X size={20} />
    </button>
    {children}
  </div>
)

export { Sheet, SheetContent }
