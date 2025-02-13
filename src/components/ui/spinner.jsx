import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ className, ...props }) {
  return (
    <div className="flex justify-center items-center w-full py-8" {...props}>
      <Loader2 className={cn("h-6 w-6 animate-spin text-muted-foreground", className)} />
    </div>
  )
} 