import { useEffect, useRef, useState } from 'react'
import { showToast } from '../shared/Toaster'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FlowType = 'past' | 'goal'
type Step = 'form' | 'success'

export interface AchievementFormData {
  flowType: FlowType
  sport: string
  eventName: string
  month: string
  year: string
  result: string
  description: string
  mediaFile?: File
}

const SPORT_OPTIONS = [
  { value: 'running', label: 'Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'climbing', label: 'Climbing' },
  { value: 'triathlon', label: 'Triathlon' },
]

// ---------------------------------------------------------------------------
// MediaUploadArea
// ---------------------------------------------------------------------------

function MediaUploadArea({ onFileSelect }: { onFileSelect?: (f: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onFileSelect?.(file)
  }

  return (
    <div className="p-4">
      <label className="block cursor-pointer">
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={handleChange}
        />
        {preview ? (
          <div
            className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-800 bg-cover bg-center"
            style={{ backgroundImage: `url('${preview}')` }}
          />
        ) : (
          <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
            <div className="size-12 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-primary-brand">
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
            </div>
            <div className="text-center">
              <p className="text-slate-900 dark:text-white font-bold">Upload Race Photo or Medal</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">PNG, JPG up to 10MB</p>
            </div>
          </div>
        )}
      </label>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
      {children}
    </label>
  )
}

const inputClass =
  'w-full h-12 px-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ' +
  'focus:ring-2 focus:ring-primary-brand placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none'

// ---------------------------------------------------------------------------
// FlowToggle — inline segmented control at the top of the form
// ---------------------------------------------------------------------------

function FlowToggle({ value, onChange }: { value: FlowType; onChange: (t: FlowType) => void }) {
  return (
    <div className="mx-4 mt-4 mb-1 grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
      {(
        [
          { type: 'goal' as FlowType, icon: 'flag', label: 'Start a Goal' },
          { type: 'past' as FlowType, icon: 'emoji_events', label: 'Log Achievement' },
        ] as const
      ).map(opt => (
        <button
          key={opt.type}
          type="button"
          onClick={() => onChange(opt.type)}
          className={[
            'flex items-center justify-center gap-1.5 h-10 rounded-lg text-sm font-bold transition-all',
            value === opt.type
              ? opt.type === 'goal'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-primary-brand text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
          ].join(' ')}
        >
          <span className="material-symbols-outlined text-[16px]">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2 — Success / celebration
// ---------------------------------------------------------------------------

function SuccessStep({
  flowType,
  eventName,
  onClose,
}: {
  flowType: FlowType
  eventName: string
  onClose: () => void
}) {
  if (flowType === 'goal') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-0 text-center px-6 py-10">
        {/* Animated celebration ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-400/25 animate-ping" />
          <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-5xl">🎯</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Goal Set!</h2>
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1 truncate max-w-[260px]">
          {eventName}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs">
          Congrats! You've started a new journey. The Flinki community is behind you.
        </p>

        {/* Community pill */}
        <div className="flex items-center gap-2 mt-6 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
          <span className="material-symbols-outlined text-emerald-500 text-xl">groups</span>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Shared with your training squad
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98]"
        >
          Let's Go!
        </button>
      </div>
    )
  }

  // Past achievement success
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 py-10">
      <div className="h-20 w-20 rounded-full bg-primary-brand/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary-brand text-[48px]">
          check_circle
        </span>
      </div>
      <h2 className="text-xl font-black text-slate-900 dark:text-white">Achievement Posted!</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{eventName}</span> has
        been added to your Flinki profile.
      </p>
      <button
        onClick={onClose}
        className="mt-4 w-full h-14 bg-primary-brand hover:bg-primary-brand/90 text-white font-bold rounded-xl shadow-lg shadow-primary-brand/30 transition-all active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AddAchievementModal — main export
// ---------------------------------------------------------------------------

export interface AddAchievementModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: AchievementFormData) => void
}

export function AddAchievementModal({ open, onClose, onSubmit }: AddAchievementModalProps) {
  const [step, setStep] = useState<Step>('form')
  const [flowType, setFlowType] = useState<FlowType>('goal')
  const [sport, setSport] = useState('')
  const [eventName, setEventName] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [result, setResult] = useState('')
  const [description, setDescription] = useState('')
  const [mediaFile, setMediaFile] = useState<File | undefined>()
  const [isSaving, setIsSaving] = useState(false)

  const canSave = eventName.trim().length > 0
  const isPast = flowType === 'past'

  function handleSubmit() {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setTimeout(() => {
      onSubmit?.({ flowType, sport, eventName, month, year, result, description, mediaFile })
      showToast(isPast ? 'Achievement added to your profile!' : "Goal set! Let's go!")
      setIsSaving(false)
      setStep('success')
    }, 800)
  }

  function handleClose() {
    setStep('form')
    setFlowType('goal')
    setSport('')
    setEventName('')
    setMonth('')
    setYear('')
    setResult('')
    setDescription('')
    setMediaFile(undefined)
    onClose()
  }

  if (!open) return null

  const headerTitle = isPast ? 'Past Achievement' : 'New Goal'

  return (
    <div className="fixed inset-0 z-modal flex justify-center bg-background-dark md:items-center md:bg-slate-900/60 md:backdrop-blur-sm">
      <div className="relative w-full max-w-[400px] bg-background-light dark:bg-slate-900 flex flex-col h-screen overflow-hidden animate-slide-up md:h-auto md:max-h-[85vh] md:rounded-2xl md:shadow-2xl">
        {/* ── Header — hidden on success step ── */}
        {step !== 'success' && (
          <header className="flex items-center justify-between px-4 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <button
              className="text-slate-500 dark:text-slate-400 text-sm font-medium"
              onClick={handleClose}
            >
              Cancel
            </button>

            <h1 className="text-slate-900 dark:text-white font-bold text-lg">{headerTitle}</h1>

            <button
              className={[
                'text-sm font-bold transition-colors flex items-center gap-1',
                canSave && !isSaving ? 'text-primary-brand' : 'text-slate-300 cursor-not-allowed',
              ].join(' ')}
              onClick={handleSubmit}
              disabled={!canSave || isSaving}
            >
              {isSaving ? (
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
              ) : (
                'Save'
              )}
            </button>
          </header>
        )}

        {/* ── Step: Form ── */}
        {step === 'form' && (
          <main className="flex-1 overflow-y-auto pb-32">
            {/* Goal / Past toggle */}
            <FlowToggle value={flowType} onChange={setFlowType} />

            {/* Media upload — past achievements only */}
            {isPast && <MediaUploadArea onFileSelect={setMediaFile} />}

            <div className={['px-4 space-y-5', isPast ? '' : 'pt-4'].join(' ')}>
              {/* Sport Category */}
              <div className="space-y-1.5">
                <FieldLabel>Sport Category</FieldLabel>
                <div className="relative">
                  <select
                    className="w-full h-12 pl-4 pr-10 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-brand appearance-none outline-none"
                    value={sport}
                    onChange={e => setSport(e.target.value)}
                  >
                    <option value="">Select Sport</option>
                    {SPORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Event / Goal name */}
              <div className="space-y-1.5">
                <FieldLabel>{isPast ? 'Event Name' : 'Goal Name'}</FieldLabel>
                <input
                  className={inputClass}
                  placeholder={isPast ? 'Berlin Marathon 2025' : 'Tokyo Marathon 2026'}
                  type="text"
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                />
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel>{isPast ? 'Month' : 'Target Month'}</FieldLabel>
                  <div className="relative">
                    <input
                      className={`${inputClass} pr-10`}
                      placeholder="MM"
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      value={month}
                      onChange={e => setMonth(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-xl pointer-events-none">
                      calendar_today
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>{isPast ? 'Year' : 'Target Year'}</FieldLabel>
                  <div className="relative">
                    <input
                      className={`${inputClass} pr-10`}
                      placeholder="YYYY"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={year}
                      onChange={e => setYear(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 text-xl pointer-events-none">
                      calendar_month
                    </span>
                  </div>
                </div>
              </div>

              {/* Result — past only */}
              {isPast && (
                <div className="space-y-1.5">
                  <FieldLabel>Result / Metric</FieldLabel>
                  <input
                    className={inputClass}
                    placeholder="Time: 3:45:12"
                    type="text"
                    value={result}
                    onChange={e => setResult(e.target.value)}
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <FieldLabel>{isPast ? 'Description' : 'Why this goal?'}</FieldLabel>
                <textarea
                  className="w-full p-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-brand placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none outline-none"
                  placeholder={
                    isPast ? 'Tell the story...' : 'What motivates you to take on this challenge?'
                  }
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
          </main>
        )}

        {/* ── Step: Success ── */}
        {step === 'success' && (
          <SuccessStep flowType={flowType} eventName={eventName} onClose={handleClose} />
        )}

        {/* ── Fixed bottom CTA — form step only ── */}
        {step === 'form' && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light/90 to-transparent dark:from-slate-900 dark:via-slate-900/90">
            <button
              className={[
                'w-full h-14 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                isPast
                  ? 'bg-primary-brand hover:bg-primary-brand/90 text-white shadow-primary-brand/30'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30',
              ].join(' ')}
              onClick={handleSubmit}
              disabled={!canSave || isSaving}
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                <>
                  <span>{isPast ? 'Post Achievement' : 'Set Goal'}</span>
                  <span className="material-symbols-outlined text-xl">
                    {isPast ? 'send' : 'flag'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CompletionCelebrationModal — triggered by "Mark as Complete" on a goal
// ---------------------------------------------------------------------------

export interface CompletionCelebrationModalProps {
  open: boolean
  goalTitle: string
  onClose: () => void
  onLogAchievement: () => void
}

export function CompletionCelebrationModal({
  open,
  goalTitle,
  onClose,
  onLogAchievement,
}: CompletionCelebrationModalProps) {
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !confettiRef.current) return
    const container = confettiRef.current
    const colors = [
      '#f59e0b',
      '#f97316',
      '#ef4444',
      '#10b981',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#fbbf24',
    ]
    for (let i = 0; i < 48; i++) {
      setTimeout(() => {
        if (!container) return
        const el = document.createElement('div')
        el.className = 'confetti-particle rounded-sm'
        el.style.width = `${6 + Math.random() * 6}px`
        el.style.height = `${6 + Math.random() * 6}px`
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        el.style.setProperty('--cx', `${(Math.random() - 0.5) * 240}px`)
        el.style.setProperty('--cy', `${-(Math.random() * 140 + 60)}px`)
        el.style.setProperty('--cr', `${(Math.random() - 0.5) * 720}deg`)
        el.style.left = `${20 + Math.random() * 60}%`
        el.style.top = '35%'
        container.appendChild(el)
        setTimeout(() => el.remove(), 2000)
      }, i * 25)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={confettiRef}
        className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
      >
        {/* Hero gradient */}
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 px-6 pt-10 pb-8 text-center overflow-hidden">
          <div className="absolute top-3 left-6 text-3xl opacity-60 select-none">✨</div>
          <div className="absolute top-6 right-8 text-2xl opacity-50 select-none">🌟</div>
          <div className="absolute bottom-5 left-10 text-xl opacity-40 select-none">⭐</div>
          <div className="absolute bottom-3 right-12 text-2xl opacity-40 select-none">🎉</div>

          {/* Pulsing ring behind trophy */}
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
            <div className="relative text-7xl">🏆</div>
          </div>

          <h2 className="text-white font-black text-3xl leading-tight">Congratulations!</h2>
          <p className="text-white/90 text-base mt-2 font-semibold leading-snug">
            You finished <span className="font-black">{goalTitle}</span>
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-center">
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Add your final results to your Flinki profile and let the community celebrate with you.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="px-6 pb-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onLogAchievement}
            className="w-full h-14 bg-primary-brand hover:bg-primary-brand/90 text-white font-bold rounded-xl shadow-lg shadow-primary-brand/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
          >
            <span className="material-symbols-outlined text-xl">emoji_events</span>
            Log Final Result &amp; Add to Achievements
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
