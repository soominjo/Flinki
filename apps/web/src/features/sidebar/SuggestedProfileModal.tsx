import { createPortal } from 'react-dom'

export interface SuggestedAthlete {
  id: string
  name: string
  avatar: string
  tags: string
  bio: string
}

interface SuggestedProfileModalProps {
  athlete: SuggestedAthlete | null
  onClose: () => void
}

export function SuggestedProfileModal({ athlete, onClose }: SuggestedProfileModalProps) {
  if (!athlete) return null

  return createPortal(
    <div
      className="fixed inset-0 z-overlay bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggested-profile-name"
      >
        <img
          src={athlete.avatar}
          alt={athlete.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md mb-4"
        />

        <h3
          id="suggested-profile-name"
          className="text-xl font-bold text-slate-900 dark:text-white"
        >
          {athlete.name}
        </h3>
        <p className="text-sm font-semibold text-primary-brand mt-1">{athlete.tags}</p>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
          {athlete.bio}
        </p>

        <button
          type="button"
          className="w-full mt-6 bg-primary-brand text-white font-bold py-3 rounded-xl hover:bg-primary-brand/90 transition-colors"
          onClick={() => {
            alert('Connection request sent!')
            onClose()
          }}
        >
          Connect
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )
}
