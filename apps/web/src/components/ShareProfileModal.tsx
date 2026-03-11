import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@repo/ui/Drawer'
import type { UserProfile } from '../lib/mockData'

interface ShareAction {
  id: string
  label: string
  sublabel: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const PdfIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
)

const QrCodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

interface ShareProfileModalProps {
  open: boolean
  onClose: () => void
  user: UserProfile
}

export function ShareProfileModal({ open, onClose, user }: ShareProfileModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function handleAction(id: string) {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const actions: ShareAction[] = [
    {
      id: 'pdf',
      label: 'Download PDF',
      sublabel: 'Save a printable profile summary',
      icon: <PdfIcon />,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      id: 'qr',
      label: 'QR Code',
      sublabel: 'Share via scannable QR link',
      icon: <QrCodeIcon />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      id: 'link',
      label: 'Copy Link',
      sublabel: 'flinki.app/@' + user.username,
      icon: <LinkIcon />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ]

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={v => {
        if (!v) onClose()
      }}
    >
      <DrawerContent className="max-h-[85vh] overflow-y-auto pb-8">
        <DrawerHeader className="pb-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-base">Share Profile</DrawerTitle>
            <DrawerClose
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 pt-4 flex flex-col gap-4">
          {/* Mini profile preview card */}
          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-4 flex items-center gap-3 shadow-sm">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-lg font-bold shadow-md ring-2 ring-white">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            {/* Details */}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">@{user.username}</p>
              <p className="text-xs text-gray-600 mt-1 leading-snug line-clamp-2">
                {user.headline}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Connections', value: user.connections.toLocaleString() },
              { label: 'Level', value: `Lv. ${user.level}` },
              { label: 'Location', value: user.location },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-xl bg-gray-50 py-2 px-2 text-center border border-gray-100"
              >
                <p className="text-xs font-bold text-gray-800">{stat.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Share actions */}
          <div className="flex flex-col gap-2">
            {actions.map(action => {
              const done = copiedId === action.id
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={[
                    'flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 text-left shadow-sm',
                    'transition-all duration-150 hover:shadow-md active:scale-[0.98]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
                  ].join(' ')}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.bgColor} ${action.color}`}
                  >
                    {done ? <CheckIcon /> : action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {done ? (action.id === 'link' ? 'Link Copied!' : 'Done!') : action.label}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{action.sublabel}</p>
                  </div>
                  {!done && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-gray-300"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
