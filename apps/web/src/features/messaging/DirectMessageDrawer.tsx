// =============================================================================
// DirectMessageDrawer
// Slides in from the right edge. Full-screen on mobile, 30vw panel on desktop.
// =============================================================================

import { useEffect, useRef, useState } from 'react'
import type { UserProfile } from '../../lib/mockData'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string
  text: string
  sender: 'me' | 'them'
  timestamp: string
}

// ---------------------------------------------------------------------------
// Mock conversation — swap IS_FIRST_MESSAGE to true to see empty state
// ---------------------------------------------------------------------------

const IS_FIRST_MESSAGE = false

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'them',
    text: 'Hey! Great run at the Austin Half yesterday 🔥',
    timestamp: '10:12 AM',
  },
  {
    id: 'm-2',
    sender: 'me',
    text: 'Thanks! Felt strong the whole way. You were flying on the back half!',
    timestamp: '10:14 AM',
  },
  {
    id: 'm-3',
    sender: 'them',
    text: "Ha, pacing strategy from Berlin prep. How's your mileage looking for the build?",
    timestamp: '10:15 AM',
  },
  {
    id: 'm-4',
    sender: 'me',
    text: 'Up to about 90 km/week now. Targeting 110 by end of month.',
    timestamp: '10:18 AM',
  },
  {
    id: 'm-5',
    sender: 'them',
    text: 'Solid. Let me know if you want to do a long run together before the taper 👊',
    timestamp: '10:19 AM',
  },
]

const ATTACH_OPTIONS = [
  { icon: 'directions_run', label: 'Share an Activity' },
  { icon: 'workspace_premium', label: 'Share an Achievement' },
  { icon: 'group_add', label: 'Invite to Train' },
]

const QUICK_STARTS = [
  { emoji: '🏅', text: 'Amazing race!' },
  { emoji: '🤝', text: "Let's train together" },
  { emoji: '⚡', text: 'Invite to Train' },
]

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DirectMessageDrawerProps {
  open: boolean
  onClose: () => void
  user: UserProfile
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DirectMessageDrawer({ open, onClose, user }: DirectMessageDrawerProps) {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>(IS_FIRST_MESSAGE ? [] : MOCK_MESSAGES)
  const [showAttachMenu, setShowAttach] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(t)
    }
  }, [messages, open])

  // Focus input when drawer opens (after animation)
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 320)
      return () => clearTimeout(t)
    }
  }, [open])

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

  function handleSend() {
    if (!inputText.trim()) return
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        text: inputText.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setInputText('')
    setShowAttach(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const firstName = user.name.split(' ')[0]

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────────────────── */}
      {/*
        Enter: fade in immediately over 300ms.
        Exit:  40ms delay so the panel starts sliding before the scrim lifts,
               then fade out over 260ms — feels like the panel "takes the lead".
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

      {/* ── Drawer ─────────────────────────────────────────────────── */}
      {/*
        will-change-transform: promotes the layer to the GPU compositor
        before the user clicks so the first frame is never janky.
        ease-panel: cubic-bezier(0.32, 0.72, 0, 1) — iOS-style deceleration
        that feels snappy on enter and natural on exit.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Message ${user.name}`}
        className={[
          // Positioning: full-screen mobile, right-panel desktop
          'fixed z-modal flex flex-col',
          'inset-0',
          'md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[30vw] md:min-w-[360px] md:max-w-[480px]',
          // Slide animation — GPU-accelerated, iOS-style easing
          'will-change-transform transition-transform duration-300 ease-panel',
          open ? 'translate-x-0' : 'translate-x-full',
          // Surface
          'bg-white dark:bg-slate-900 shadow-2xl',
          'md:rounded-l-2xl overflow-hidden',
        ].join(' ')}
      >
        {/* ── 1. Trust Header ──────────────────────────────────────── */}
        <header className="flex-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Back / close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex-none rounded-full p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined block text-xl leading-none">
                arrow_back
              </span>
            </button>

            {/* Avatar with active dot */}
            <div className="relative flex-none">
              <div
                className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center ring-2 ring-white dark:ring-slate-900"
                style={user.avatarUrl ? { backgroundImage: `url('${user.avatarUrl}')` } : undefined}
                aria-label={`${user.name}'s avatar`}
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent-green border-2 border-white dark:border-slate-900" />
            </div>

            {/* Name + verified badge */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] text-slate-900 dark:text-white leading-tight truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                <span
                  className="material-symbols-outlined text-primary-brand text-[13px] leading-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="text-[11px] font-bold text-primary-brand leading-none">
                  Layer 6 Verified
                </span>
                <span className="text-slate-300 dark:text-slate-600 text-[11px] mx-0.5">·</span>
                <span className="text-[11px] font-semibold text-accent-green leading-none">
                  Active Now
                </span>
              </div>
            </div>

            {/* More options */}
            <button
              aria-label="More options"
              className="flex-none rounded-full p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined block text-xl leading-none">
                more_vert
              </span>
            </button>
          </div>
        </header>

        {/* ── 2. Chat Feed ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12 px-6">
              <div
                className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shadow-lg"
                style={user.avatarUrl ? { backgroundImage: `url('${user.avatarUrl}')` } : undefined}
              />
              <div className="text-4xl leading-none">👋</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                  Start a conversation with {firstName}. Ask about their recent{' '}
                  <span className="font-semibold text-primary-brand">London Marathon finish!</span>
                </p>
              </div>
              {/* Quick-start chips */}
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {QUICK_STARTS.map(({ emoji, text }) => (
                  <button
                    key={text}
                    onClick={() => {
                      setInputText(text)
                      inputRef.current?.focus()
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-brand/10 hover:text-primary-brand transition-colors"
                  >
                    {emoji} {text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message bubbles */
            messages.map((msg, i) => {
              const isMe = msg.sender === 'me'
              // Show timestamp after a run of same-sender bubbles ends
              const nextDifferent =
                messages[i + 1]?.sender !== msg.sender || i === messages.length - 1
              return (
                <div
                  key={msg.id}
                  className={['flex flex-col gap-0.5', isMe ? 'items-end' : 'items-start'].join(
                    ' '
                  )}
                >
                  <div
                    className={[
                      'max-w-[78%] px-4 py-2.5 text-sm leading-relaxed',
                      isMe
                        ? // Sender: purple, sharp bottom-right
                          'bg-primary-brand text-white rounded-t-2xl rounded-bl-2xl rounded-br-[4px]'
                        : // Receiver: slate, sharp bottom-left
                          'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-t-2xl rounded-br-2xl rounded-bl-[4px]',
                    ].join(' ')}
                  >
                    {msg.text}
                  </div>
                  {nextDifferent && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1 pb-1">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── 3. Attach Mini-Menu ──────────────────────────────────── */}
        {showAttachMenu && (
          <div className="flex-none border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Flinki Actions
            </p>
            <div className="flex gap-2">
              {ATTACH_OPTIONS.map(({ icon, label }) => (
                <button
                  key={label}
                  onClick={() => setShowAttach(false)}
                  className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 text-center hover:border-primary-brand hover:bg-primary-brand/5 transition-colors group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-brand text-[22px] leading-none transition-colors">
                    {icon}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-primary-brand leading-tight transition-colors">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. Input Composer ────────────────────────────────────── */}
        <div className="flex-none border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 md:pb-4">
          <div className="flex items-center gap-2">
            {/* Bolt / attach button */}
            <button
              onClick={() => setShowAttach(v => !v)}
              aria-label="Share activity, achievement or training invite"
              aria-expanded={showAttachMenu}
              className={[
                'flex-none rounded-full p-2 transition-colors',
                showAttachMenu
                  ? 'bg-primary-brand/10 text-primary-brand'
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-brand',
              ].join(' ')}
            >
              <span className="material-symbols-outlined block text-[22px] leading-none">bolt</span>
            </button>

            {/* Pill text input */}
            <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${firstName}…`}
                aria-label={`Message ${user.name}`}
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-w-0"
              />
            </div>

            {/* Send button — purple only when there's text */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              aria-label="Send message"
              className={[
                'flex-none rounded-full p-2 transition-all duration-150',
                inputText.trim()
                  ? 'bg-primary-brand text-white hover:bg-primary-brand/90 shadow-sm scale-100'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed scale-95',
              ].join(' ')}
            >
              <span className="material-symbols-outlined block text-[22px] leading-none">send</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
