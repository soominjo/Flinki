// =============================================================================
// MessageInbox
// Slides in from the left. Full-screen on mobile, fixed left panel on desktop.
// Tapping a thread opens the DirectMessageDrawer from the right.
// =============================================================================

import { useEffect, useMemo, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InboxThread {
  id: string
  name: string
  avatarUrl?: string
  isActive: boolean
  lastMessage: string
  timestamp: string
  isUnread: boolean
  unreadCount?: number
}

// ---------------------------------------------------------------------------
// Mock threads
// ---------------------------------------------------------------------------

const MOCK_THREADS: InboxThread[] = [
  {
    id: 'thread-1',
    name: 'Alex Rivera',
    avatarUrl:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=85&w=200&h=200',
    isActive: true,
    lastMessage: 'Solid. Let me know if you want to do a long run together before the taper 👊',
    timestamp: '2m',
    isUnread: true,
    unreadCount: 1,
  },
  {
    id: 'thread-2',
    name: 'Morgan Chen',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=200&h=200',
    isActive: false,
    lastMessage: 'Just got back from Enchanted Rock — legs are toast 😅',
    timestamp: '1h',
    isUnread: true,
    unreadCount: 3,
  },
  {
    id: 'thread-3',
    name: 'Sam Torres',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=200&h=200',
    isActive: true,
    lastMessage: 'Endorsed you for pacing strategy, well earned 🏅',
    timestamp: '3h',
    isUnread: false,
  },
  {
    id: 'thread-4',
    name: 'Jordan Lee',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=200&h=200',
    isActive: false,
    lastMessage: 'Are you targeting sub-3 at Berlin? I am doing the same block',
    timestamp: 'Yesterday',
    isUnread: false,
  },
  {
    id: 'thread-5',
    name: 'Priya Anand',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=85&w=200&h=200',
    isActive: false,
    lastMessage: 'Shared an activity with you: Morning Yoga Flow 🧘',
    timestamp: 'Mon',
    isUnread: false,
  },
  {
    id: 'thread-6',
    name: 'Kai Nakamura',
    avatarUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=85&w=200&h=200',
    isActive: true,
    lastMessage: 'You: Thanks for the Strava segment tip, crushed it this morning!',
    timestamp: 'Sun',
    isUnread: false,
  },
]

// ---------------------------------------------------------------------------
// Thread Card
// ---------------------------------------------------------------------------

interface ThreadCardProps {
  thread: InboxThread
  onClick: () => void
}

function ThreadCard({ thread, onClick }: ThreadCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors text-left"
    >
      {/* Avatar + active dot */}
      <div className="relative flex-none">
        <div
          className={[
            'h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center',
            thread.isUnread ? 'ring-2 ring-primary-brand/30' : '',
          ].join(' ')}
          style={thread.avatarUrl ? { backgroundImage: `url('${thread.avatarUrl}')` } : undefined}
          aria-label={`${thread.name}'s avatar`}
        />
        {thread.isActive && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent-green border-2 border-white dark:border-slate-900" />
        )}
      </div>

      {/* Name + message preview */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            'text-sm leading-tight truncate',
            thread.isUnread
              ? 'font-bold text-slate-900 dark:text-white'
              : 'font-semibold text-slate-800 dark:text-slate-200',
          ].join(' ')}
        >
          {thread.name}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate leading-tight">
          {thread.lastMessage}
        </p>
      </div>

      {/* Timestamp + unread badge */}
      <div className="flex-none flex flex-col items-end gap-1.5 ml-1">
        <span
          className={[
            'text-[11px] font-semibold leading-none',
            thread.isUnread ? 'text-primary-brand' : 'text-slate-400 dark:text-slate-500',
          ].join(' ')}
        >
          {thread.timestamp}
        </span>
        {thread.isUnread && (
          <span className="h-2 w-2 rounded-full bg-primary-brand" aria-label="Unread message" />
        )}
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MessageInboxProps {
  open: boolean
  onClose: () => void
  onOpenThread: (threadId: string, name: string) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MessageInbox({ open, onClose, onOpenThread }: MessageInboxProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MOCK_THREADS
    return MOCK_THREADS.filter(
      t => t.name.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q)
    )
  }, [query])

  // Lock body scroll while open
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

  const totalUnread = MOCK_THREADS.filter(t => t.isUnread).reduce(
    (n, t) => n + (t.unreadCount ?? 1),
    0
  )

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────────────────── */}
      {/*
        Enter: fade in immediately over 300ms.
        Exit:  40ms delay so the panel starts sliding before the scrim lifts.
      */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          'fixed inset-0 z-backdrop',
          'bg-slate-900/60 backdrop-blur-sm',
          'transition-opacity ease-panel',
          open
            ? 'opacity-100 pointer-events-auto duration-300 delay-0'
            : 'opacity-0 pointer-events-none duration-[260ms] delay-[40ms]',
        ].join(' ')}
      />

      {/* ── Inbox Panel ────────────────────────────────────────────── */}
      {/*
        will-change-transform: GPU layer promoted before interaction.
        ease-panel: cubic-bezier(0.32, 0.72, 0, 1) — same iOS curve as DM drawer.
        Slides in from the LEFT (opposite of DM drawer) so the UX reads:
        inbox opens ← → conversation opens.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Messages inbox"
        className={[
          // Positioning: full-screen mobile, left-side panel desktop
          'fixed z-modal flex flex-col',
          'inset-0',
          'md:inset-auto md:left-0 md:top-0 md:bottom-0 md:w-[380px]',
          // Slide from left — GPU-accelerated, iOS-style easing
          'will-change-transform transition-transform duration-300 ease-panel',
          open ? 'translate-x-0' : '-translate-x-full',
          // Surface
          'bg-white dark:bg-slate-900 shadow-2xl',
          'md:rounded-r-2xl overflow-hidden',
        ].join(' ')}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <header className="flex-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close inbox"
              className="rounded-full p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined block text-xl leading-none">
                arrow_back
              </span>
            </button>

            {/* Title + unread count */}
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Messages
              </h2>
              {totalUnread > 0 && (
                <span className="bg-primary-brand text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                  {totalUnread}
                </span>
              )}
            </div>

            {/* New message FAB / compose icon */}
            <button
              aria-label="New message"
              className="rounded-full p-1.5 text-primary-brand hover:bg-primary-brand/10 transition-colors"
            >
              <span className="material-symbols-outlined block text-xl leading-none">
                edit_square
              </span>
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-2">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px] leading-none flex-none">
              search
            </span>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search messages…"
              aria-label="Search conversations"
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-w-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">close</span>
              </button>
            )}
          </div>
        </header>

        {/* ── Thread List ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            // Empty search state
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16 px-8 text-center">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl">
                search_off
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No conversations matching{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">"{query}"</span>
              </p>
            </div>
          ) : (
            <ul role="list" aria-label="Conversations">
              {/* Unread section */}
              {filtered.some(t => t.isUnread) && (
                <>
                  <li className="px-4 pt-4 pb-1">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Unread
                    </p>
                  </li>
                  {filtered
                    .filter(t => t.isUnread)
                    .map(thread => (
                      <li key={thread.id}>
                        <ThreadCard
                          thread={thread}
                          onClick={() => onOpenThread(thread.id, thread.name)}
                        />
                      </li>
                    ))}
                </>
              )}

              {/* All / recent section */}
              {filtered.some(t => !t.isUnread) && (
                <>
                  <li className="px-4 pt-4 pb-1">
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {filtered.some(t => t.isUnread) ? 'Earlier' : 'All Messages'}
                    </p>
                  </li>
                  {filtered
                    .filter(t => !t.isUnread)
                    .map(thread => (
                      <li key={thread.id}>
                        <ThreadCard
                          thread={thread}
                          onClick={() => onOpenThread(thread.id, thread.name)}
                        />
                      </li>
                    ))}
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
