import { useState, useMemo } from 'react'
import type { Achievement } from '../lib/mockData'
import { AchievementWaterfall } from '../features/achievements/AchievementWaterfall'
import { EVIDENCE } from '../features/achievements/AchievementDetailModal'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CategoryFilter = 'all' | Achievement['category']
type SortOrder = 'recent' | 'oldest' | 'trust'
type SportFilter = 'all' | 'running' | 'climbing' | 'l6'

const CATEGORY_FILTERS: { value: CategoryFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: 'grid_view' },
  { value: 'milestone', label: 'Milestone', icon: 'emoji_events' },
  { value: 'social', label: 'Social', icon: 'group' },
  { value: 'skill', label: 'Skill', icon: 'psychology' },
]

const SPORT_FILTERS: { value: SportFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All Sports', icon: 'sports' },
  { value: 'running', label: 'Running', icon: 'directions_run' },
  { value: 'climbing', label: 'Climbing', icon: 'landscape' },
  { value: 'l6', label: 'L6 Verified', icon: 'verified' },
]

function inferSport(ach: Achievement): 'running' | 'climbing' | 'other' {
  const text = (ach.title + ' ' + ach.description).toLowerCase()
  if (
    text.includes('marathon') ||
    text.includes(' run') ||
    text.includes('utmb') ||
    text.includes('trail') ||
    text.includes('50k')
  )
    return 'running'
  if (
    text.includes('climb') ||
    text.includes('summit') ||
    text.includes('mountain') ||
    text.includes('mont blanc')
  )
    return 'climbing'
  return 'other'
}

function hasL6Evidence(achievementId: string): boolean {
  return (EVIDENCE[achievementId] ?? []).some(item => item.layer === 6)
}

function getMaxTrustLayer(achievementId: string): number {
  const items = EVIDENCE[achievementId] ?? []
  return items.reduce((max, item) => Math.max(max, item.layer), 1)
}

// ---------------------------------------------------------------------------
// AchievementsList
// ---------------------------------------------------------------------------

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent')
  const [sportFilter, setSportFilter] = useState<SportFilter>('all')

  const filtered = useMemo(() => {
    let base =
      category === 'all' ? [...achievements] : achievements.filter(a => a.category === category)

    if (sportFilter === 'running') base = base.filter(a => inferSport(a) === 'running')
    else if (sportFilter === 'climbing') base = base.filter(a => inferSport(a) === 'climbing')
    else if (sportFilter === 'l6') base = base.filter(a => hasL6Evidence(a.id))

    if (sortOrder === 'recent') {
      return base.sort(
        (a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
      )
    } else if (sortOrder === 'oldest') {
      return base.sort(
        (a, b) => new Date(a.unlockedAt).getTime() - new Date(b.unlockedAt).getTime()
      )
    } else {
      return base.sort((a, b) => getMaxTrustLayer(b.id) - getMaxTrustLayer(a.id))
    }
  }, [achievements, category, sortOrder, sportFilter])

  return (
    <div className="pt-3 pb-6">
      {/* ── Sticky filter sub-header ── */}
      <div className="sticky top-11 z-[5] bg-white dark:bg-slate-900 px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        {/* Row 1: Category + Sort */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setCategory(f.value)}
                className={[
                  'flex items-center gap-1 shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200',
                  category === f.value
                    ? 'bg-primary-brand text-white shadow-sm shadow-primary-brand/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[13px]">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as SortOrder)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-full pl-3 pr-7 py-1.5 border-none outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="trust">Highest Trust</option>
            </select>
            <span className="material-symbols-outlined text-[13px] text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Row 2: Sport / trust filters */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {SPORT_FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setSportFilter(f.value)}
              className={[
                'flex items-center gap-1 shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all duration-200',
                sportFilter === f.value
                  ? f.value === 'l6'
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                    : 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
              ].join(' ')}
            >
              <span className="material-symbols-outlined text-[12px]">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="px-4 text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-3 mb-3">
        {filtered.length} {filtered.length === 1 ? 'achievement' : 'achievements'}
        {category !== 'all' && ` · ${CATEGORY_FILTERS.find(f => f.value === category)?.label}`}
        {sportFilter !== 'all' && ` · ${SPORT_FILTERS.find(f => f.value === sportFilter)?.label}`}
      </p>

      {/* Waterfall items */}
      {filtered.length > 0 ? (
        <div className="px-4 flex flex-col gap-5">
          {filtered.map(ach => (
            <AchievementWaterfall key={ach.id} achievement={ach} />
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
            search_off
          </span>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            No achievements match these filters
          </p>
        </div>
      )}
    </div>
  )
}
