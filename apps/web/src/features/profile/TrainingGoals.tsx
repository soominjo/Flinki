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
}

function TrainingGoalThumb({ goal }: TrainingGoalThumbProps) {
  const bgColorClass = BG_COLOR_MAP[goal.colorClass] ?? 'bg-slate-400'

  const nextMilestone = MILESTONES.find(m => goal.progress < m)
  const milestoneLabel = nextMilestone != null ? `Next: ${nextMilestone}%` : '🎉 Complete!'

  return (
    <div className="flex-none flex flex-col items-center gap-2 w-24">
      {/* Ring */}
      <div className="relative h-24 w-24">
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
      </div>

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
    </div>
  )
}

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

export interface AlbumThumb {
  id: string
  title: string
  imageUrl?: string
}

interface AlbumCircleProps {
  album: AlbumThumb
  isSelected: boolean
  onSelect: (id: string) => void
}

function AlbumCircle({ album, isSelected, onSelect }: AlbumCircleProps) {
  return (
    <div className="flex-none text-center">
      <div
        className={[
          'h-16 w-16 rounded-full bg-cover bg-center mb-1 ring-2 ring-offset-2 transition-all overflow-hidden cursor-pointer',
          isSelected
            ? 'ring-primary-brand bg-primary-brand'
            : 'ring-transparent bg-slate-200 dark:bg-slate-700 hover:ring-primary-brand',
        ].join(' ')}
        style={album.imageUrl ? { backgroundImage: `url('${album.imageUrl}')` } : undefined}
        onClick={() => onSelect(album.id)}
        role="button"
        aria-label={`Select album: ${album.title}`}
        aria-pressed={isSelected}
      />
      <span
        className={`text-[10px] font-semibold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
      >
        {album.title}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composed section
// ---------------------------------------------------------------------------

interface TrainingGoalsSectionProps {
  goals: TrainingGoal[]
  albums: AlbumThumb[]
  selectedAlbumId: string
  onAddGoal?: () => void
  onSelectAlbum?: (id: string) => void
  onShowAllPhotos?: () => void
}

export function TrainingGoalsSection({
  goals,
  albums,
  selectedAlbumId,
  onAddGoal,
  onSelectAlbum,
  onShowAllPhotos,
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
            <button
              key={goal.id}
              type="button"
              className="flex-none"
              onClick={() =>
                setActiveStory({
                  title: goal.title,
                  imageUrl: goal.imageUrl ?? '',
                })
              }
            >
              <TrainingGoalThumb goal={goal} />
            </button>
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

      {/* Albums */}
      <section className="mt-8">
        <div className="px-6 flex justify-between items-end mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Albums</h3>
          <button className="text-primary-brand text-sm font-semibold" onClick={onShowAllPhotos}>
            Show all photos
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2 md:flex-wrap md:overflow-x-visible">
          {albums.map(album => (
            <div
              key={album.id}
              className="flex-none"
              onClick={() =>
                setActiveStory({
                  title: album.title,
                  imageUrl: album.imageUrl ?? '',
                })
              }
            >
              <AlbumCircle
                album={album}
                isSelected={album.id === selectedAlbumId}
                onSelect={onSelectAlbum ?? (() => {})}
              />
            </div>
          ))}
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
