// =============================================================================
// NotificationsPanel
// Mobile: bottom sheet that slides up.
// Desktop: left-anchored slide-in panel (360px, narrower than the inbox).
// =============================================================================

import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NotifType = 'kudos' | 'comment' | 'follow' | 'achievement' | 'mention' | 'invite'

export interface AppNotification {
  id: string
  type: NotifType
  actorName: string
  actorAvatarUrl?: string
  text: string
  timestamp: string
  isUnread: boolean
}

// ---------------------------------------------------------------------------
// Mock data — 3 unread, 3 read
// ---------------------------------------------------------------------------

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'kudos',
    actorName: 'Jordan Lee',
    actorAvatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=200&h=200',
    text: 'gave you kudos on your London Marathon finish 🏅',
    timestamp: '2m',
    isUnread: true,
  },
  {
    id: 'notif-2',
    type: 'comment',
    actorName: 'Morgan Chen',
    actorAvatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=200&h=200',
    text: 'commented on your trail run: "Those splits look incredible!"',
    timestamp: '1h',
    isUnread: true,
  },
  {
    id: 'notif-3',
    type: 'follow',
    actorName: 'Sam Torres',
    actorAvatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=200&h=200',
    text: 'followed you',
    timestamp: '3h',
    isUnread: true,
  },
  {
    id: 'notif-4',
    type: 'achievement',
    actorName: 'Flinki',
    text: 'You unlocked a new achievement: Century Club 🎯',
    timestamp: '5h',
    isUnread: false,
  },
  {
    id: 'notif-5',
    type: 'mention',
    actorName: 'Priya Anand',
    actorAvatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=85&w=200&h=200',
    text: 'mentioned you in a post: "Inspired by @alexrivera\'s Berlin prep"',
    timestamp: 'Yesterday',
    isUnread: false,
  },
  {
    id: 'notif-6',
    type: 'invite',
    actorName: 'Kai Nakamura',
    actorAvatarUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=85&w=200&h=200',
    text: 'invited you to join Berlin Marathon Prep Group',
    timestamp: 'Mon',
    isUnread: false,
  },
]

// ---------------------------------------------------------------------------
// Icon + colour mappings per notification type
// ---------------------------------------------------------------------------

const TYPE_ICON: Record<NotifType, string> = {
  kudos: 'favorite',
  comment: 'chat_bubble',
  follow: 'person_add',
  achievement: 'workspace_premium',
  mention: 'alternate_email',
  invite: 'group_add',
}

const TYPE_COLOR: Record<NotifType, string> = {
  kudos: 'bg-rose-100 dark:bg-rose-900/40 text-rose-500',
  comment: 'bg-primary-brand/10 text-primary-brand',
  follow: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500',
  achievement: 'bg-amber-100 dark:bg-amber-900/40 text-amber-500',
  mention: 'bg-blue-100 dark:bg-blue-900/40 text-blue-500',
  invite: 'bg-violet-100 dark:bg-violet-900/40 text-violet-500',
}

// ---------------------------------------------------------------------------
// Notification item
// ---------------------------------------------------------------------------

interface NotificationItemProps {
  n: AppNotification
  onRead: (id: string) => void
}

function NotificationItem({ n, onRead }: NotificationItemProps) {
  return (
    <button
      onClick={() => onRead(n.id)}
      className={[
        'w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors',
        n.isUnread
          ? 'bg-primary-brand/[0.06] dark:bg-primary-brand/[0.12] hover:bg-primary-brand/10 dark:hover:bg-primary-brand/[0.18]'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60',
      ].join(' ')}
    >
      {/* Avatar / icon stack */}
      <div className="relative flex-none mt-0.5">
        {n.actorAvatarUrl ? (
          <div
            className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
            style={{ backgroundImage: `url('${n.actorAvatarUrl}')` }}
            aria-label={`${n.actorName}'s avatar`}
          />
        ) : (
          // System notification — use type icon directly
          <div
            className={[
              'h-10 w-10 rounded-full flex items-center justify-center',
              TYPE_COLOR[n.type],
            ].join(' ')}
          >
            <span
              className="material-symbols-outlined text-xl leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {TYPE_ICON[n.type]}
            </span>
          </div>
        )}
        {/* Type badge on top of avatar */}
        {n.actorAvatarUrl && (
          <div
            className={[
              'absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full',
              'flex items-center justify-center',
              'ring-2 ring-white dark:ring-slate-900',
              TYPE_COLOR[n.type],
            ].join(' ')}
          >
            <span
              className="material-symbols-outlined text-[10px] leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {TYPE_ICON[n.type]}
            </span>
          </div>
        )}
      </div>

      {/* Text + timestamp */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            'text-sm leading-snug',
            n.isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400',
          ].join(' ')}
        >
          <span className={n.isUnread ? 'font-bold' : 'font-semibold'}>{n.actorName}</span>{' '}
          <span className={n.isUnread ? 'font-medium' : ''}>{n.text}</span>
        </p>
        <p
          className={[
            'text-[11px] font-semibold mt-1',
            n.isUnread ? 'text-primary-brand' : 'text-slate-400 dark:text-slate-500',
          ].join(' ')}
        >
          {n.timestamp}
        </p>
      </div>

      {/* Unread dot */}
      {n.isUnread && (
        <div className="flex-none mt-2 shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary-brand" aria-label="Unread" />
        </div>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NotificationsPanelProps {
  open: boolean
  onClose: () => void
  /** Called whenever the unread count changes so the nav badge stays in sync. */
  onUnreadCountChange: (count: number) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NotificationsPanel({
  open,
  onClose,
  onUnreadCountChange,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => n.isUnread).length

  // Sync unread count upward whenever it changes
  useEffect(() => {
    onUnreadCountChange(unreadCount)
  }, [unreadCount, onUnreadCountChange])

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isUnread: false } : n)))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })))
  }

  // Lock body scroll (mobile only — prevents main scroll while sheet is open)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const hasUnread = unreadCount > 0

  return (
    <>
      {/* ── Mobile backdrop only ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          'fixed inset-0 z-backdrop md:hidden',
          'bg-slate-900/60 backdrop-blur-sm',
          'transition-opacity ease-panel',
          open
            ? 'opacity-100 pointer-events-auto duration-300 delay-0'
            : 'opacity-0 pointer-events-none duration-[260ms] delay-[40ms]',
        ].join(' ')}
      />

      {/* ── Desktop click-outside (below panel, no visual) ─────────── */}
      {open && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="hidden md:fixed md:block md:inset-0 z-[44]"
        />
      )}

      {/* ── Panel ──────────────────────────────────────────────────── */}
      {/*
        Mobile:  bottom sheet — fixed, slides up from bottom.
        Desktop: left-anchored slide-in panel (360px), slides from left.

        Closed transforms:
          mobile  → translate-y-full  (panel below viewport)
          desktop → md:translate-y-0 md:-translate-x-full  (panel left of viewport)
        Open:
          translate-y-0 md:translate-x-0
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className={[
          'fixed z-modal flex flex-col overflow-hidden',
          'bg-white dark:bg-slate-900 shadow-2xl',
          // Mobile layout: bottom sheet
          'inset-x-0 bottom-0 max-h-[88vh] rounded-t-[2.5rem]',
          // Desktop layout: left-side panel (narrower than MessageInbox)
          'md:inset-auto md:left-0 md:top-0 md:bottom-0 md:w-[360px] md:rounded-none md:rounded-r-2xl',
          // GPU hint + transition
          'will-change-transform transition-[transform,opacity] ease-panel duration-300',
          open
            ? 'translate-y-0 md:translate-x-0 opacity-100 pointer-events-auto'
            : 'translate-y-full md:translate-y-0 md:-translate-x-full opacity-0 md:opacity-100 pointer-events-none',
        ].join(' ')}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>

        {/* ── Sticky header ──────────────────────────────────────── */}
        <header className="flex-none flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* Back button (desktop) */}
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="hidden md:flex rounded-full p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors -ml-1.5 mr-1"
            >
              <span className="material-symbols-outlined block text-xl leading-none">
                arrow_back
              </span>
            </button>

            <h2 className="font-bold text-[17px] text-slate-900 dark:text-white tracking-tight">
              Notifications
            </h2>

            {hasUnread && (
              <span className="bg-primary-brand text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                {unreadCount}
              </span>
            )}
          </div>

          {hasUnread && (
            <button
              onClick={markAllRead}
              className="text-primary-brand text-xs font-bold hover:underline transition-opacity"
            >
              Mark all as read
            </button>
          )}
        </header>

        {/* ── Notification list or empty state ─────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-8 text-center">
              <div className="relative">
                <span
                  className="material-symbols-outlined text-slate-200 dark:text-slate-700 text-[64px] leading-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  notifications
                </span>
                <span className="absolute -bottom-1 -right-1 text-2xl leading-none">✅</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base">
                  You're all caught up!
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 leading-relaxed">
                  Go log an activity or cheer on your Squad.
                </p>
              </div>
            </div>
          ) : (
            <ul role="list">
              {/* ── Unread section ── */}
              {hasUnread && (
                <>
                  <li className="px-5 pt-4 pb-1">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      New
                    </p>
                  </li>
                  {notifications
                    .filter(n => n.isUnread)
                    .map(n => (
                      <li key={n.id}>
                        <NotificationItem n={n} onRead={markRead} />
                      </li>
                    ))}
                </>
              )}

              {/* ── Read section ── */}
              {notifications.some(n => !n.isUnread) && (
                <>
                  <li className="px-5 pt-4 pb-1">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {hasUnread ? 'Earlier' : 'All Notifications'}
                    </p>
                  </li>
                  {notifications
                    .filter(n => !n.isUnread)
                    .map(n => (
                      <li key={n.id}>
                        <NotificationItem n={n} onRead={markRead} />
                      </li>
                    ))}
                </>
              )}
            </ul>
          )}
        </div>

        {/* Home indicator safe area (mobile) */}
        <div className="flex justify-center pt-1 pb-2 md:hidden">
          <div className="w-32 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full" />
        </div>
      </div>
    </>
  )
}
