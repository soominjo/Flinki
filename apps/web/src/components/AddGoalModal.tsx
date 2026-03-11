import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@repo/ui/Dialog'
import { Input } from '@repo/ui/Input'

const CATEGORIES = [
  { value: 'career', label: '🎯 Career' },
  { value: 'skill', label: '🧠 Skill' },
  { value: 'education', label: '📚 Education' },
  { value: 'personal', label: '🌿 Personal' },
]

const SPORTS = ['Running', 'Cycling', 'Climbing', 'Swimming', 'Strength', 'Yoga', 'Other']

// ---------------------------------------------------------------------------
// Toggle Switch component
// ---------------------------------------------------------------------------
interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  id?: string
}

function ToggleSwitch({ checked, onChange, id }: ToggleProps) {
  return (
    <button
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
        checked ? 'bg-violet-600' : 'bg-gray-200',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md',
          'transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Image upload placeholder
// ---------------------------------------------------------------------------
function ImageUploadPlaceholder() {
  const [hasImage, setHasImage] = useState(false)

  if (hasImage) {
    return (
      <div className="relative h-28 w-full rounded-xl bg-gradient-to-br from-violet-300 to-indigo-400 flex items-center justify-center">
        <span className="text-4xl">🏔️</span>
        <button
          onClick={() => setHasImage(false)}
          className="absolute top-2 right-2 rounded-full bg-black/40 p-1 text-white hover:bg-black/60 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setHasImage(true)}
      className="flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-violet-300 hover:bg-violet-50 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
      <span className="text-xs text-gray-400 font-medium">Add cover photo</span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------
interface AddGoalModalProps {
  open: boolean
  onClose: () => void
}

export function AddGoalModal({ open, onClose }: AddGoalModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('career')
  const [sport, setSport] = useState('')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [isTrainingGoal, setIsTrainingGoal] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!title.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      resetForm()
      onClose()
    }, 1200)
  }

  function resetForm() {
    setTitle('')
    setCategory('career')
    setSport('')
    setDeadline('')
    setDescription('')
    setIsTrainingGoal(false)
  }

  const canSubmit = title.trim().length > 0

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        if (!v) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-[360px] max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
        <DialogHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold">Add New Goal</DialogTitle>
            <DialogClose
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
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-5 pt-4 pb-2 flex flex-col gap-4">
          {/* Cover photo */}
          <ImageUploadPlaceholder />

          {/* Goal title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Goal Title *</label>
            <Input
              placeholder="e.g. Run a 10K under 50 minutes"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="rounded-xl border-gray-200 text-sm"
            />
          </div>

          {/* Category + Sport row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-400"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Sport (optional)</label>
              <select
                value={sport}
                onChange={e => setSport(e.target.value)}
                className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-400"
              >
                <option value="">— Select —</option>
                {SPORTS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Target Date</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Description</label>
            <textarea
              placeholder="What does achieving this goal look like?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>

          {/* Toggle — training goal */}
          <div
            className={[
              'flex items-center justify-between rounded-xl border px-4 py-3 transition-colors duration-200',
              isTrainingGoal ? 'border-violet-200 bg-violet-50' : 'border-gray-100 bg-gray-50',
            ].join(' ')}
          >
            <div className="min-w-0 pr-4">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                Make this a training goal
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Shows a progress ring on your profile
              </p>
            </div>
            <ToggleSwitch
              checked={isTrainingGoal}
              onChange={setIsTrainingGoal}
              id="training-toggle"
            />
          </div>
        </div>

        <DialogFooter className="px-5 pb-5 pt-3 flex gap-2">
          <DialogClose
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
            onClick={resetForm}
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={[
              'flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
              canSubmit
                ? 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            {submitted ? '✓ Goal Added!' : 'Add Goal'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
