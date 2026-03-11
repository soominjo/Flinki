import { useState } from 'react'

interface ActionPill {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
}

const QrIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </svg>
)

const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
)

interface ActionBarProps {
  onShareBio?: () => void
}

export function ActionBar({ onShareBio }: ActionBarProps) {
  const [active, setActive] = useState<string | null>(null)

  const pills: ActionPill[] = [
    { id: 'message', label: 'Message', icon: <MessageIcon /> },
    { id: 'share-bio', label: 'Share Bio', icon: <ShareIcon />, onClick: onShareBio },
    { id: 'qr-invite', label: 'QR Invite', icon: <QrIcon /> },
  ]

  return (
    <div className="px-4 py-2 border-b border-gray-100">
      {/* Horizontally scrollable pill row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {pills.map(pill => (
          <button
            key={pill.id}
            onClick={() => {
              setActive(pill.id === active ? null : pill.id)
              pill.onClick?.()
            }}
            className={[
              'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium',
              'transition-all duration-150 ease-out',
              'hover:scale-105 active:scale-95',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1',
              active === pill.id
                ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:border-violet-400 hover:text-violet-600',
            ].join(' ')}
          >
            {pill.icon}
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  )
}
