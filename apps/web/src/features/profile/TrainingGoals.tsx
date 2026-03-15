import { useState } from 'react'
import { StoryViewerModal } from '../shared/StoryViewerModal'

// SVG ring geometry — 96×96 container, r=44
const CX = 48
const CY = 48
const RADIUS = 44
const STROKE_WIDTH = 5
const CIRCUMFERENCE = 2 * Math.PI * RADIUS // ≈ 276.46

function strokeDashoffset(progress: number) {
  const clamped = Math.min(100, Math.max(0, progress))
  return CIRCUMFERENCE * (1 - clamped / 100)
}

// Map text-color classes → bg-color classes for milestone bars
// Literal strings here so Tailwind includes them in the bundle
const BG_COLOR_MAP: Record<string, string> = {
  'text-accent-green': 'bg-accent-green',
  'text-accent-blue': 'bg-accent-blue',
  'text-primary-brand': 'bg-primary-brand',
}

const MILESTONES = [25, 50, 75, 100]

// ---------------------------------------------------------------------------
// Training Goals
// ---------------------------------------------------------------------------

export interface TrainingGoal {
  id: string
  title: string
  /** 0–100 */
  progress: number
  /** Tailwind text-color class for the progress arc, e.g. "text-accent-green" */
  colorClass: string
  imageUrl?: string
}

interface TrainingGoalThumbProps {
  goal: TrainingGoal
  onStoryOpen?: () => void
  onMarkComplete?: () => void
}

function TrainingGoalThumb({ goal, onStoryOpen, onMarkComplete }: TrainingGoalThumbProps) {
  const bgColorClass = BG_COLOR_MAP[goal.colorClass] ?? 'bg-slate-400'

  const nextMilestone = MILESTONES.find(m => goal.progress < m)
  const milestoneLabel = nextMilestone != null ? `Next: ${nextMilestone}%` : '🎉 Complete!'

  return (
    <div className="flex-none flex flex-col items-center gap-2 w-24">
      {/* Ring — tap opens story viewer */}
      <button
        type="button"
        className="relative h-24 w-24"
        onClick={onStoryOpen}
        aria-label={`View story for ${goal.title}`}
      >
        <svg className="progress-ring w-24 h-24" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            className="text-slate-100 dark:text-slate-700"
            cx={CX}
            cy={CY}
            fill="transparent"
            r={RADIUS}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress arc */}
          <circle
            className={goal.colorClass}
            cx={CX}
            cy={CY}
            fill="transparent"
            r={RADIUS}
            stroke="currentColor"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset(goal.progress)}
            strokeLinecap="round"
            strokeWidth={STROKE_WIDTH}
          />
        </svg>

        {/* Inner image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-[68px] w-[68px] rounded-full bg-slate-100 dark:bg-slate-800 bg-cover bg-center shadow-inner"
            style={goal.imageUrl ? { backgroundImage: `url('${goal.imageUrl}')` } : undefined}
            role="img"
            aria-label={goal.title}
          />
        </div>

        {/* Progress % badge */}
        <div
          className={`absolute bottom-0 right-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${bgColorClass}`}
        >
          {goal.progress}%
        </div>
      </button>

      {/* Title */}
      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
        {goal.title}
      </span>

      {/* Segmented milestone bar */}
      <div className="flex gap-0.5 w-full" aria-label={`Progress: ${goal.progress}%`}>
        {MILESTONES.map(ms => (
          <div
            key={ms}
            title={`${ms}%`}
            className={[
              'flex-1 h-1.5 rounded-full transition-colors',
              goal.progress >= ms ? bgColorClass : 'bg-slate-200 dark:bg-slate-700',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Next milestone label */}
      <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
        {milestoneLabel}
      </span>

      {/* Finish & Log */}
      {onMarkComplete && (
        <button
          type="button"
          onClick={onMarkComplete}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
        >
          <span className="material-symbols-outlined text-[13px]">emoji_events</span>
          Finish &amp; Log
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composed section
// ---------------------------------------------------------------------------

interface TrainingGoalsSectionProps {
  goals: TrainingGoal[]
  onAddGoal?: () => void
  onMarkComplete?: (goalId: string, goalTitle: string) => void
}

export function TrainingGoalsSection({
  goals,
  onAddGoal,
  onMarkComplete,
}: TrainingGoalsSectionProps) {
  const [activeStory, setActiveStory] = useState<{ title: string; imageUrl: string } | null>(null)

  return (
    <>
      {/* Currently Training For... */}
      <section className="mt-6">
        <div className="px-6 flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Currently Training For
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Tap a goal to see your progress story
            </p>
          </div>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar px-6 pb-3 md:flex-wrap md:overflow-x-visible">
          {goals.map(goal => (
            <TrainingGoalThumb
              key={goal.id}
              goal={goal}
              onStoryOpen={() =>
                setActiveStory({ title: goal.title, imageUrl: goal.imageUrl ?? '' })
              }
              onMarkComplete={
                onMarkComplete ? () => onMarkComplete(goal.id, goal.title) : undefined
              }
            />
          ))}

          {/* Add Goal */}
          <div className="flex-none flex flex-col items-center gap-2 w-20">
            <button
              className="h-20 w-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500"
              onClick={onAddGoal}
              aria-label="Add training goal"
            >
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Add Goal
            </span>
          </div>
        </div>
      </section>

      <StoryViewerModal
        isOpen={!!activeStory}
        onClose={() => setActiveStory(null)}
        title={activeStory?.title ?? ''}
        imageUrl={activeStory?.imageUrl ?? ''}
      />
    </>
  )
}
