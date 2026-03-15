import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// ---------------------------------------------------------------------------
// showToast — call from anywhere in the app, no prop drilling needed
// ---------------------------------------------------------------------------

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent('flinki-toast', { detail: { message } }))
}

// ---------------------------------------------------------------------------
// Toaster — place once in App.tsx; listens for the custom event above
// ---------------------------------------------------------------------------

interface Toast {
  id: number
  message: string
  fading: boolean
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    function handler(e: Event) {
      const { message } = (e as CustomEvent<{ message: string }>).detail
      const id = Date.now()

      setToasts(prev => [...prev, { id, message, fading: false }])

      // Begin fade-out 500ms before removal
      setTimeout(
        () => setToasts(prev => prev.map(t => (t.id === id ? { ...t, fading: true } : t))),
        2500
      )
      // Remove from DOM
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
    }

    window.addEventListener('flinki-toast', handler)
    return () => window.removeEventListener('flinki-toast', handler)
  }, [])

  if (toasts.length === 0) return null

  return createPortal(
    // bottom-24 on mobile clears the bottom nav bar; md:bottom-6 on desktop
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={[
            'flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold whitespace-nowrap',
            'bg-slate-900 text-white dark:bg-white dark:text-slate-900',
            'animate-slide-up transition-opacity duration-500',
            toast.fading ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          <span
            className="material-symbols-outlined text-[16px] text-emerald-400 dark:text-emerald-600 shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          {toast.message}
        </div>
      ))}
    </div>,
    document.body
  )
}
