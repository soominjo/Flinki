import { useState } from 'react'

const SPORT_OPTIONS = [
  { value: 'running', label: 'Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'triathlon', label: 'Triathlon' },
]

// ---------------------------------------------------------------------------
// Media Upload Area
// ---------------------------------------------------------------------------

interface MediaUploadAreaProps {
  onFileSelect?: (file: File) => void
}

function MediaUploadArea({ onFileSelect }: MediaUploadAreaProps) {
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
            role="img"
            aria-label="Uploaded photo preview"
          />
        ) : (
          <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="size-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-brand">
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
// Toggle Switch — Tailwind peer/peer-checked pattern, faithful to reference
//
// The reference markup uses a visually-hidden <input type="checkbox"> with
// class="sr-only peer" and a sibling <div> whose after: pseudo-element
// acts as the thumb.  The peer-checked: variants drive all state styling in
// pure CSS — no JS needed for the visual effect.  We only add React's
// controlled props (checked / onChange) to keep the state in sync.
// ---------------------------------------------------------------------------

interface TrainingGoalToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

function TrainingGoalToggle({ checked, onChange }: TrainingGoalToggleProps) {
  return (
    <div className="py-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        {/* Label copy */}
        <div className="flex flex-col">
          <span className="text-slate-900 dark:text-white font-semibold">Training Goal</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs">
            Make this a current training goal
          </span>
        </div>

        {/* Toggle — visually-hidden checkbox + CSS-driven track/thumb */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            className="sr-only peer"
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
          />
          {/*
            Track + thumb entirely in Tailwind:
              - Track:  w-11 h-6, slate-200 default, emerald-500 when checked
              - Thumb:  after:absolute after:top-[2px] after:left-[2px]
                        after:h-5 after:w-5 after:rounded-full after:bg-white
                        after:border after:border-gray-300
                        translates right on peer-checked
          */}
          <div
            className={[
              'w-11 h-6 rounded-full transition-colors',
              'peer-focus:outline-none',
              "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
              'after:bg-white after:border after:border-gray-300 dark:after:border-slate-500 after:rounded-full',
              'after:h-5 after:w-5 after:transition-all',
              'peer-checked:after:translate-x-full peer-checked:after:border-white',
              'peer-checked:bg-emerald-500 bg-slate-200 dark:bg-slate-700',
            ].join(' ')}
          />
        </label>
      </div>
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
// Main modal
// ---------------------------------------------------------------------------

export interface AddAchievementModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: AchievementFormData) => void
}

export interface AchievementFormData {
  sport: string
  eventName: string
  month: string
  year: string
  result: string
  description: string
  isTrainingGoal: boolean
  mediaFile?: File
}

export function AddAchievementModal({ open, onClose, onSubmit }: AddAchievementModalProps) {
  const [sport, setSport] = useState('')
  const [eventName, setEventName] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [result, setResult] = useState('')
  const [description, setDescription] = useState('')
  const [isTrainingGoal, setTrainingGoal] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | undefined>()

  const canSave = eventName.trim().length > 0

  function handleSubmit() {
    if (!canSave) return
    onSubmit?.({ sport, eventName, month, year, result, description, isTrainingGoal, mediaFile })
    alert('Achievement successfully posted!')
    handleCancel()
  }

  function handleCancel() {
    setSport('')
    setEventName('')
    setMonth('')
    setYear('')
    setResult('')
    setDescription('')
    setTrainingGoal(false)
    setMediaFile(undefined)
    onClose()
  }

  if (!open) return null

  return (
    // Full-screen on mobile → centered dialog on desktop
    <div className="fixed inset-0 z-50 flex justify-center bg-background-dark md:items-center md:bg-slate-900/60 md:backdrop-blur-sm">
      {/* Modal box */}
      <div className="relative w-full max-w-[400px] bg-background-light dark:bg-slate-900 flex flex-col h-screen overflow-hidden animate-slide-up md:h-auto md:max-h-[85vh] md:rounded-2xl md:shadow-2xl">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-4 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <button
            className="text-slate-500 dark:text-slate-400 text-sm font-medium"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <h1 className="text-slate-900 dark:text-white font-bold text-lg">New Achievement</h1>

          <button
            className={[
              'text-sm font-bold transition-colors',
              canSave ? 'text-primary-brand' : 'text-slate-300 cursor-not-allowed',
            ].join(' ')}
            onClick={handleSubmit}
            disabled={!canSave}
            aria-disabled={!canSave}
          >
            Save
          </button>
        </header>

        {/* ── Scrollable Content ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-32">
          {/* Media Upload Area */}
          <MediaUploadArea onFileSelect={setMediaFile} />

          {/* Form Fields */}
          <div className="px-4 space-y-5">
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

            {/* Event Name */}
            <div className="space-y-1.5">
              <FieldLabel>Event Name</FieldLabel>
              <input
                className={inputClass}
                placeholder="Berlin Marathon 2025"
                type="text"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
              />
            </div>

            {/* Date Picker Grid — Month + Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel>Month</FieldLabel>
                <div className="relative">
                  <input
                    className={`${inputClass} pr-10`}
                    placeholder="MM"
                    type="text"
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
                <FieldLabel>Year</FieldLabel>
                <div className="relative">
                  <input
                    className={`${inputClass} pr-10`}
                    placeholder="YYYY"
                    type="text"
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

            {/* Result / Metric */}
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

            {/* Description */}
            <div className="space-y-1.5">
              <FieldLabel>Description</FieldLabel>
              <textarea
                className="w-full p-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-brand placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none outline-none"
                placeholder="Tell the story..."
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Toggle Section */}
            <TrainingGoalToggle checked={isTrainingGoal} onChange={setTrainingGoal} />
          </div>
        </main>

        {/* ── Fixed Bottom Button ────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light/90 to-transparent">
          <button
            className="w-full h-14 bg-primary-brand hover:bg-primary-brand/90 text-white font-bold rounded-xl shadow-lg shadow-primary-brand/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            onClick={handleSubmit}
            disabled={!canSave}
          >
            <span>Post Achievement</span>
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
