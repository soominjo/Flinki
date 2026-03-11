import * as React from 'react'
import { cn } from '../../lib/utils'

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
})

interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, defaultOpen = false, onOpenChange, children }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const controlled = open !== undefined
  const isOpen = controlled ? open : internalOpen

  const handleChange = (v: boolean) => {
    if (!controlled) setInternalOpen(v)
    onOpenChange?.(v)
  }

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleChange }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, children, onClick, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext)

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
DialogTrigger.displayName = 'DialogTrigger'

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = React.useContext(DialogContext)
  if (!open) return null
  return <>{children}</>
}

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext)
    return (
      <div
        ref={ref}
        className={cn('fixed inset-0 z-50 bg-black/80 animate-in fade-in-0', className)}
        onClick={() => onOpenChange(false)}
        {...props}
      />
    )
  }
)
DialogOverlay.displayName = 'DialogOverlay'

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext)

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogOverlay />
        <div
          ref={ref}
          role="dialog"
          aria-modal
          className={cn(
            'relative z-50 w-full max-w-lg rounded-xl bg-background p-6 shadow-lg',
            className
          )}
          onClick={e => e.stopPropagation()}
          {...props}
        >
          {children}
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03163 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03163 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
DialogDescription.displayName = 'DialogDescription'

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
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
DialogClose.displayName = 'DialogClose'

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
