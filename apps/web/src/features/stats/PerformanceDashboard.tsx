import { useState } from 'react'
import { personalBests, gearLocker } from '../../lib/mockStatsData'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

// Heatmap cell colors are string literals so Tailwind JIT can detect them.
// Bar heights and gear fill widths use style={{ }} since dynamic arbitrary
// values like h-[${n}%] are not scanned by the JIT compiler.

export type HeatmapColor =
  | 'bg-slate-200'
  | 'bg-emerald-100'
  | 'bg-emerald-200'
  | 'bg-emerald-300'
  | 'bg-emerald-400'
  | 'bg-emerald-500'
  | 'bg-emerald-600'
  | 'bg-emerald-700'
  | 'bg-emerald-800'

export interface YearStats {
  /** Year label shown in the title and active filter pill */
  year: string
  distance: string
  distanceUnit: string
  elevation: string
  elevationUnit: string
  activeDays: number
  /** 48 color strings for the 12-col × 4-row heatmap */
  heatmap: HeatmapColor[]
  trainingLoad: {
    weeklyEffort: number
    /** e.g. "Productive" */
    status: string
    /** Bar heights as 0-100 percentages, one per day (7 bars) */
    bars: number[]
    days: string[]
  }
  personalRecords: PersonalRecord[]
  gear: GearItem[]
}

export interface PersonalRecord {
  id: string
  /** Material Symbols icon name */
  icon: string
  activity: string
  time: string
  verified: boolean
  /** First card uses the full gradient border; rest use the muted version */
  isPrimary?: boolean
}

export interface GearItem {
  id: string
  name: string
  imageUrl?: string
  imageAlt?: string
  metricLabel: string
  capLabel: string
  /** 0-100 fill percentage for the progress bar */
  progress: number
  /** Tailwind bg class for the fill, e.g. "bg-primary-brand" or "bg-emerald-500" */
  progressColor: string
}

// ---------------------------------------------------------------------------
// Activity Heatmap
// ---------------------------------------------------------------------------

function ActivityHeatmap({ cells }: { cells: HeatmapColor[] }) {
  return (
    <div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">
        Activity Heatmap
      </p>
      <div className="grid grid-cols-12 gap-1.5">
        {cells.map((color, i) => (
          <div key={i} className={`aspect-square rounded-[2px] ${color}`} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Key Stats + Heatmap card
// ---------------------------------------------------------------------------

function StatsAndHeatmapCard({ stats }: { stats: YearStats }) {
  return (
    <div className="p-4">
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="space-y-4 mb-6">
          {/* Distance */}
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Distance
            </p>
            <p className="text-slate-900 dark:text-white text-3xl font-bold font-display">
              {stats.distance}{' '}
              <span className="text-lg font-medium text-slate-400">{stats.distanceUnit}</span>
            </p>
          </div>
          {/* Elevation + Active Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Elevation
              </p>
              <p className="text-slate-900 dark:text-white text-2xl font-bold font-display">
                {stats.elevation}{' '}
                <span className="text-sm font-medium text-slate-400">{stats.elevationUnit}</span>
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Active Days
              </p>
              <p className="text-slate-900 dark:text-white text-2xl font-bold font-display">
                {stats.activeDays}
              </p>
            </div>
          </div>
        </div>
        <ActivityHeatmap cells={stats.heatmap} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Training Load bar chart
// ---------------------------------------------------------------------------

function TrainingLoadCard({ load }: { load: YearStats['trainingLoad'] }) {
  return (
    <div className="p-4 pt-0">
      <h3 className="text-slate-900 dark:text-white text-lg font-bold font-display mb-4">
        Training Load
      </h3>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        {/* Header row */}
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Weekly Relative Effort
            </p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold font-display">
              {load.weeklyEffort}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-tight">
              Status: {load.status}
            </p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="relative h-32 w-full flex items-end justify-between gap-2 px-1">
          {/* Dashed "Optimal Zone" guideline at ~50% height (bottom-16 = 64px of 128px) */}
          <div className="absolute bottom-16 left-0 right-0 border-t-2 border-dashed border-primary-brand/20 z-0" />
          <div className="absolute right-0 bottom-16 -mt-4">
            <span className="text-[8px] font-bold text-primary-brand/40 uppercase tracking-tighter">
              Optimal Zone
            </span>
          </div>

          {/* Gradient bars — height driven by data so we use style, not arbitrary classes */}
          {load.bars.map((pct, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary-brand to-indigo-400 rounded-t-sm z-10"
              style={{ height: `${pct}%` }}
            />
          ))}
        </div>

        {/* Day labels */}
        <div className="flex justify-between mt-2 px-1">
          {load.days.map((day, i) => (
            <span key={i} className="text-[10px] font-medium text-slate-400">
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Personal Records horizontal scroll
// ---------------------------------------------------------------------------

function PersonalRecordsRow() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold font-display">
          Personal Bests
        </h3>
        <span className="text-primary-brand text-sm font-semibold cursor-pointer">See All</span>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
        {personalBests.map(pr => (
          <div
            key={pr.id}
            className={`min-w-[160px] p-[2px] rounded-xl bg-gradient-to-br ${pr.theme}`}
          >
            <div className="bg-white dark:bg-slate-900 rounded-[10px] p-4 h-full relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary-brand text-xl">
                  {pr.icon}
                </span>
                <p className="text-slate-900 dark:text-white text-sm font-bold font-display">
                  {pr.sport}
                </p>
              </div>
              <p className="text-slate-900 dark:text-white text-xl font-bold font-display mb-1">
                {pr.time}
              </p>
              {pr.verified && (
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-emerald-500 text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-tight">
                    Verified
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Gear Locker list
// ---------------------------------------------------------------------------

function GearLockerList({ onAddGear }: { onAddGear?: () => void }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold font-display">
          Current Gear
        </h3>
        <button
          className="bg-primary-brand/10 text-primary-brand p-2 rounded-full flex items-center justify-center"
          onClick={onAddGear}
          aria-label="Add gear"
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </button>
      </div>

      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {gearLocker.map(item => {
          // Strip " cap" suffix for the left label so it reads "350km" not "350km cap"
          const unitBase = item.metricUnit.replace(' cap', '')
          const leftLabel = `${item.currentMetric}${unitBase}`
          const rightLabel = `${item.maxMetric} ${item.metricUnit}`
          const fillPct = (item.currentMetric / item.maxMetric) * 100

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm"
            >
              {/* Gear image */}
              <div
                className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 bg-center bg-cover shrink-0"
                style={{ backgroundImage: `url('${item.image}')` }}
                role="img"
                aria-label={`${item.brand} ${item.model}`}
              />

              {/* Gear details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm font-display truncate">
                    {item.brand} {item.model}
                  </h4>
                  <button className="text-slate-400 shrink-0" aria-label="More options">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>

                {/* Usage progress bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    {/* Width calculated as (currentMetric / maxMetric) * 100 */}
                    <div
                      className={`${item.color} h-full rounded-full`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard Header + Filter Row
// ---------------------------------------------------------------------------

const FILTER_YEARS = ['2025', '2024', 'All-Time'] as const
type FilterYear = (typeof FILTER_YEARS)[number]

interface DashboardHeaderProps {
  title: string
  activeYear: FilterYear
  onYearChange: (year: FilterYear) => void
  onBack?: () => void
  onShare?: () => void
}

function DashboardHeader({
  title,
  activeYear,
  onYearChange,
  onBack,
  onShare,
}: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-primary-brand/10 dark:border-slate-800">
      {/* Title row */}
      <div className="flex items-center p-4 justify-between">
        <button
          className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={onBack}
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>

        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">
          {title}
        </h2>

        <div className="flex w-10 items-center justify-end">
          <button
            className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"
            onClick={onShare}
            aria-label="Share"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex gap-3 p-4 pt-0 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-x-visible">
        {FILTER_YEARS.map(year => {
          const isActive = year === activeYear
          return (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={[
                'flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-6 transition-all',
                isActive
                  ? 'bg-primary-brand shadow-md shadow-primary-brand/20'
                  : 'bg-primary-brand/10 hover:bg-primary-brand/20',
              ].join(' ')}
            >
              <p
                className={[
                  'text-sm font-display',
                  isActive ? 'text-white font-semibold' : 'text-primary-brand font-medium',
                ].join(' ')}
              >
                {year}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PerformanceDashboard — composed view
// ---------------------------------------------------------------------------

interface PerformanceDashboardProps {
  /** Stats keyed by filter year label */
  statsByYear: Record<string, YearStats>
  onBack?: () => void
  onShare?: () => void
  onAddGear?: () => void
  onSeeAllPRs?: () => void
}

export function PerformanceDashboard({
  statsByYear,
  onBack,
  onShare,
  onAddGear,
}: PerformanceDashboardProps) {
  const [activeYear, setActiveYear] = useState<FilterYear>('2025')

  const stats = statsByYear[activeYear]

  return (
    <div className="w-full bg-white dark:bg-slate-950 min-h-screen flex flex-col relative">
      {/* Dashboard Header + Filter Row */}
      <DashboardHeader
        title={`${activeYear} Performance`}
        activeYear={activeYear}
        onYearChange={setActiveYear}
        onBack={onBack}
        onShare={onShare}
      />

      {/* Main Content Area */}
      {stats ? (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* Top two cards — stacked on mobile, side-by-side on desktop */}
          <div className="md:grid md:grid-cols-2 md:gap-6 md:p-4">
            <StatsAndHeatmapCard stats={stats} />
            <TrainingLoadCard load={stats.trainingLoad} />
          </div>
          <PersonalRecordsRow />
          <GearLockerList onAddGear={onAddGear} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          No data for {activeYear}
        </div>
      )}
    </div>
  )
}
