// Input component
import React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
      className,
    )}
    {...props}
  />
))
Input.displayName = "Input"

export default Input
export { Input }
