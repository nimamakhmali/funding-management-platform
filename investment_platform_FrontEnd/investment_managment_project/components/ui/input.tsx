import { cn } from "@/lib/utils"
import * as React from "react"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-muted-foreground hover:border-gray-200 focus:border-primary focus:bg-white focus:ring-0 focus-visible:ring-0 focus-visible:border-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:bg-red-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }