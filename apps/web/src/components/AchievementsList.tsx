import { useState } from 'react'
import type { Achievement } from '../lib/mockData'
import { AchievementDetailModal } from '../features/achievements/AchievementDetailModal'

const categoryConfig: Record<
  Achievement['category'],
  { label: string; pill: string; icon: string }
> = {
  milestone: {
    label: 'Milestone',
    pill: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    icon: 'emoji_events',
  },
  social: {
    label: 'Social',
    pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    icon: 'group',
  },
  skill: {
    label: 'Skill',
    pill: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
    icon: 'psychology',
  },
}

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const [selected, setSelected] = useState<Achievement | null>(null)

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      {achievements.map(ach => {
        const cat = categoryConfig[ach.category]
        const dateFormatted = new Date(ach.unlockedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })

        return (
          <button
            key={ach.id}
            type="button"
            onClick={() => setSelected(ach)}
            className="w-full text-left rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
          >
            {/* ── Hero Banner ── */}
            <div className="relative h-44 overflow-hidden bg-slate-200 dark:bg-slate-800">
              {ach.imageUrl ? (
                <img
                  src={ach.imageUrl}
                  alt={ach.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                  {ach.icon}
                </div>
              )}

              {/* Dark gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              {/* Top-left: category pill */}
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cat.pill}`}>
                  {cat.label}
                </span>
              </div>

              {/* Top-right: verified badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="material-symbols-outlined text-white text-sm">verified</span>
                <span className="text-white text-[10px] font-bold">Verified</span>
              </div>

              {/* Bottom overlay: title + date */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-bold text-[17px] leading-snug">{ach.title}</h4>
                <p className="text-white/65 text-xs mt-0.5">Unlocked {dateFormatted}</p>
              </div>
            </div>

            {/* ── Card Footer ── */}
            <div className="px-4 py-3 flex items-center gap-3">
              {/* Description excerpt */}
              <p className="flex-1 text-slate-500 dark:text-slate-400 text-xs leading-snug line-clamp-2">
                {ach.description}
              </p>

              {/* CTA */}
              <div className="shrink-0 flex items-center gap-1 text-primary-brand">
                <span className="text-[11px] font-bold whitespace-nowrap">See evidence</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </div>
          </button>
        )
      })}

      <AchievementDetailModal achievement={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
