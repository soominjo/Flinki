import { useState } from 'react'

interface NotificationsModalProps {
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Shared Toggle
// ---------------------------------------------------------------------------

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        className="sr-only peer"
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div
        className={[
          'w-11 h-6 rounded-full transition-colors peer-focus:outline-none',
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
          'after:bg-white after:border after:border-gray-300 dark:after:border-slate-500 after:rounded-full',
          'after:h-5 after:w-5 after:transition-all',
          'peer-checked:after:translate-x-full peer-checked:after:border-white',
          'peer-checked:bg-primary-brand bg-slate-200 dark:bg-slate-700',
        ].join(' ')}
      />
    </label>
  )
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary-brand text-xl">{icon}</span>
        <h3 className="text-slate-900 dark:text-white font-bold text-base">{title}</h3>
      </div>
      <p className="text-slate-400 text-xs mb-4 ml-7">{subtitle}</p>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toggle row
// ---------------------------------------------------------------------------

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-slate-900 dark:text-white font-semibold text-sm leading-snug">{label}</p>
        <p className="text-slate-400 text-xs mt-0.5 leading-snug">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Time input
// ---------------------------------------------------------------------------

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex-1">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</p>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary-brand outline-none"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// NotificationsModal
// ---------------------------------------------------------------------------

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  // Section 1 — Hype Squad
  const [prAlerts, setPrAlerts] = useState(true)

  // Section 2 — Gear Locker
  const [gearWarnings, setGearWarnings] = useState(true)

  // Section 3 — Recovery Mode
  const [syncSchedule, setSyncSchedule] = useState(false)
  const [dndStart, setDndStart] = useState('22:00')
  const [dndEnd, setDndEnd] = useState('06:00')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog */}
      <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center pointer-events-none md:inset-0 md:items-center md:justify-center">
        <div className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl animate-slide-up pointer-events-auto flex flex-col max-h-[92vh] md:relative md:rounded-2xl md:max-w-md md:max-h-[85vh]">
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 shrink-0 md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <button
              className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              onClick={onClose}
            >
              Back
            </button>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Notifications</h2>
            <div className="w-10" />
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            {/* ── Section 1: Hype Squad ─────────────────────────────── */}
            <Section
              icon="local_fire_department"
              title="Hype Squad"
              subtitle="Celebrate the wins of your training circle."
            >
              <ToggleRow
                label="PR & Milestone Alerts"
                description="Get notified instantly when your close connections hit a Personal Best."
                checked={prAlerts}
                onChange={setPrAlerts}
              />
            </Section>

            {/* ── Section 2: Gear Locker ────────────────────────────── */}
            <Section
              icon="backpack"
              title="Gear Locker"
              subtitle="Keep your kit performing at its peak."
            >
              <ToggleRow
                label="Gear Lifespan Warnings"
                description="We'll ping you when your running shoes pass 500km so you never train on dead rubber."
                checked={gearWarnings}
                onChange={setGearWarnings}
              />
            </Section>

            {/* ── Section 3: Recovery Mode ─────────────────────────── */}
            <Section
              icon="bedtime"
              title="Recovery Mode"
              subtitle="Protect your sleep. Rest is training too."
            >
              <ToggleRow
                label="Sync with Training Schedule"
                description="Automatically silence all alerts on your recovery and rest days."
                checked={syncSchedule}
                onChange={setSyncSchedule}
              />

              {/* Quiet Hours */}
              <div
                className={[
                  'transition-opacity duration-200',
                  syncSchedule ? 'opacity-100' : 'opacity-40 pointer-events-none',
                ].join(' ')}
              >
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="material-symbols-outlined text-primary-brand text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      do_not_disturb_on
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                      Do Not Disturb
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <TimeInput label="From" value={dndStart} onChange={setDndStart} />
                    <div className="flex items-end pb-2.5 text-slate-300 font-bold text-lg">→</div>
                    <TimeInput label="Until" value={dndEnd} onChange={setDndEnd} />
                  </div>
                  <p className="text-slate-400 text-[10px] mt-3 text-center">
                    No notifications between{' '}
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      {dndStart} – {dndEnd}
                    </span>
                  </p>
                </div>
              </div>
            </Section>
          </div>

          {/* Home indicator — mobile only */}
          <div className="flex justify-center pb-3 shrink-0 md:hidden">
            <div className="w-32 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </>
  )
}
