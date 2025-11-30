import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-indigo-600 selection:text-white bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 w-full min-w-0 text-base transition-all outline-none",
        "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
