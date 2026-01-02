import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified Sheet implementation for Scaffolding purposes.
// Real Shadcn Sheet requires Radix Dialog, which requires installing dependencies.
// This is a placeholder to allow compilation until full install.

const Sheet = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "fixed inset-y-0 right-0 z-50 w-3/4 gap-4 border-l bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
            className
        )}
        {...props}
    />
))
Sheet.displayName = "Sheet"

export { Sheet }
