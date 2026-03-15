import { useState } from 'react'
import type { Activity } from '../lib/mockData'

const typeConfig: Record<Activity['type'], { label: string; color: string; dot: string }> = {
  workout: { label: 'Workout', color: 'text-orange-600', dot: 'bg-orange-400' },
  post: { label: 'Post', color: 'text-violet-600', dot: 'bg-violet-400' },
  achievement: { label: 'Achievement', color: 'text-amber-600', dot: 'bg-amber-400' },
  endorsement: { label: 'Endorsed', color: 'text-emerald-600', dot: 'bg-emerald-400' },
  goal: { label: 'Goal', color: 'text-blue-600', dot: 'bg-blue-400' },
  connection: { label: 'Connected', color: 'text-gray-600', dot: 'bg-gray-400' },
}

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [kudoed, setKudoed] = useState(false)
  const [kudosCount, setKudosCount] = useState(activity.kudos ?? 0)
  const config = typeConfig[activity.type]

  function handleKudos() {
    setKudoed(prev => {
      const next = !prev
      setKudosCount(c => c + (next ? 1 : -1))
      return next
    })
  }

  return (
    <article className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-2">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-xs font-semibold shadow">
          {activity.actorInitials ?? activity.actor.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-gray-800 leading-none truncate shrink">
              {activity.actor}
            </span>
            <span
              className={`flex shrink-0 items-center gap-1 text-[10px] font-medium ${config.color}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">{activity.timeAgo}</span>
        </div>
      </div>

      {/* Message */}
      <p className="px-3.5 pb-2.5 text-sm text-gray-700 leading-snug">{activity.message}</p>

      {/* Stats grid */}
      {activity.stats && activity.stats.length > 0 && (
        <div className="mx-3.5 mb-2.5 grid grid-cols-4 gap-px rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
          {activity.stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center py-2 bg-gray-50">
              <span className="text-[13px] font-bold text-gray-800 leading-none">{stat.value}</span>
              <span className="mt-0.5 text-[9px] text-gray-400 uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Image carousel */}
      {activity.imageGradients && activity.imageGradients.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3.5 pb-3">
          {activity.imageGradients.map((gradient, i) => (
            <div
              key={i}
              className={`h-28 w-36 shrink-0 rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}
            />
          ))}
        </div>
      )}

      {/* Footer — Kudos */}
      <div className="flex items-center gap-1 border-t border-gray-100 px-3.5 py-2">
        <button
          onClick={handleKudos}
          aria-label="Give kudos"
          className={[
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150',
            'hover:scale-105 active:scale-95 focus:outline-none',
            kudoed
              ? 'bg-orange-100 text-orange-600'
              : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500',
          ].join(' ')}
        >
          {/* Fist/kudos icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={kudoed ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
          </svg>
          <span>Kudos</span>
          {kudosCount > 0 && (
            <span
              className={[
                'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                kudoed ? 'bg-orange-200 text-orange-700' : 'bg-gray-200 text-gray-600',
              ].join(' ')}
            >
              {kudosCount}
            </span>
          )}
        </button>
      </div>
    </article>
  )
}
