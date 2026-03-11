import * as React from 'react'
import { cn } from '../../lib/utils'

interface DrawerContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextValue>({
  open: false,
  onOpenChange: () => {},
})

interface DrawerProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Drawer = ({ open, defaultOpen = false, onOpenChange, children }: DrawerProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const controlled = open !== undefined
  const isOpen = controlled ? open : internalOpen

  const handleChange = (v: boolean) => {
    if (!controlled) setInternalOpen(v)
    onOpenChange?.(v)
  }

  return (
    <DrawerContext.Provider value={{ open: isOpen, onOpenChange: handleChange }}>
      {children}
    </DrawerContext.Provider>
  )
}

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DrawerContext)

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
        {
          onClick: (e: React.MouseEvent) => {
            onOpenChange(true)
            ;(
              children as React.ReactElement<{ onClick?: React.MouseEventHandler }>
            ).props.onClick?.(e)
          },
        }
      )
    }

    return (
      <button
        ref={ref}
        onClick={e => {
          onOpenChange(true)
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DrawerTrigger.displayName = 'DrawerTrigger'

const DrawerPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = React.useContext(DrawerContext)
  if (!open) return null
  return <>{children}</>
}

interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DrawerContext)
    return (
      <div
        ref={ref}
        className={cn('fixed inset-0 z-50 bg-black/80', className)}
        onClick={() => onOpenChange(false)}
        {...props}
      />
    )
  }
)
DrawerOverlay.displayName = 'DrawerOverlay'

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DrawerContext)

    React.useEffect(() => {
      if (!open) return
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }, [open, onOpenChange])

    if (!open) return null

    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        <DrawerOverlay />
        <div
          ref={ref}
          className={cn(
            'relative z-50 flex flex-col rounded-t-[10px] bg-background border border-border',
            className
          )}
          onClick={e => e.stopPropagation()}
          {...props}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          {children}
        </div>
      </div>
    )
  }
)
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
)
DrawerFooter.displayName = 'DrawerFooter'

const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
DrawerTitle.displayName = 'DrawerTitle'

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
DrawerDescription.displayName = 'DrawerDescription'

const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DrawerContext)
  return (
    <button
      ref={ref}
      onClick={e => {
        onOpenChange(false)
        onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DrawerClose.displayName = 'DrawerClose'

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
}
