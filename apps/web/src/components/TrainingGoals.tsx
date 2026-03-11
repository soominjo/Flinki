import type { Goal } from '../lib/mockData'

// SVG ring dimensions
const SIZE = 72 // outer SVG viewBox size
const STROKE = 4.5 // ring stroke width
const RADIUS = (SIZE - STROKE) / 2 // 33.75 — fits inside the viewBox
const CIRCUMFERENCE = 2 * Math.PI * RADIUS // ≈ 212

const categoryConfig: Record<
  Goal['category'],
  { emoji: string; trackColor: string; ringColor: string; bg: string }
> = {
  career: {
    emoji: '🎯',
    trackColor: '#e9d5ff',
    ringColor: '#7c3aed',
    bg: 'bg-violet-50',
  },
  skill: {
    emoji: '🧠',
    trackColor: '#bfdbfe',
    ringColor: '#2563eb',
    bg: 'bg-blue-50',
  },
  education: {
    emoji: '📚',
    trackColor: '#fde68a',
    ringColor: '#d97706',
    bg: 'bg-amber-50',
  },
  personal: {
    emoji: '🌿',
    trackColor: '#a7f3d0',
    ringColor: '#059669',
    bg: 'bg-emerald-50',
  },
}

interface ProgressRingProps {
  progress: number // 0–100
  status: Goal['status']
  category: Goal['category']
}

function ProgressRing({ progress, status, category }: ProgressRingProps) {
  const { trackColor, ringColor } = categoryConfig[category]
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const offset = CIRCUMFERENCE * (1 - clampedProgress / 100)

  const ringStroke = status === 'completed' ? '#10b981' : ringColor

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="absolute inset-0"
      style={{ transform: 'rotate(-90deg)' }}
      aria-hidden
    >
      {/* Background track */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={trackColor}
        strokeWidth={STROKE}
      />
      {/* Progress arc */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={ringStroke}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

interface GoalThumbProps {
  goal: Goal
}

function GoalThumb({ goal }: GoalThumbProps) {
  const { emoji, bg } = categoryConfig[goal.category]

  // Shorten title to ~10 chars for the label
  const shortTitle = goal.title.length > 10 ? goal.title.slice(0, 10) + '…' : goal.title

  return (
    <div className="flex flex-col items-center gap-1.5 snap-start shrink-0 w-[72px]">
      {/* Ring + thumbnail */}
      <div className="relative w-[72px] h-[72px]">
        <ProgressRing progress={goal.progress} status={goal.status} category={goal.category} />
        {/* Inner circle */}
        <div
          className={`absolute inset-[6px] rounded-full ${bg} flex items-center justify-center text-2xl shadow-sm`}
        >
          {emoji}
        </div>
        {/* Completed checkmark badge */}
        {goal.status === 'completed' && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow">
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
              className="text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 4.5L3.5 6.5L7.5 2.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      {/* Label */}
      <span className="text-[10px] text-gray-600 font-medium text-center leading-tight w-full truncate px-0.5">
        {shortTitle}
      </span>
      {/* Progress % */}
      <span className="text-[9px] text-gray-400 -mt-1">{goal.progress}%</span>
    </div>
  )
}

interface TrainingGoalsProps {
  goals: Goal[]
  onAddGoal?: () => void
}

export function TrainingGoals({ goals, onAddGoal }: TrainingGoalsProps) {
  return (
    <section className="px-4 pt-4 pb-2">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Active Goals</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1">
        {/* "+ Add Goal" thumb — always first */}
        <div className="flex flex-col items-center gap-1.5 snap-start shrink-0 w-[72px]">
          <button
            onClick={onAddGoal}
            aria-label="Add goal"
            className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <span className="text-[10px] text-gray-400 font-medium">Add</span>
          <span className="text-[9px] text-transparent -mt-1">·</span>
        </div>

        {goals.map(goal => (
          <GoalThumb key={goal.id} goal={goal} />
        ))}
      </div>
    </section>
  )
}
