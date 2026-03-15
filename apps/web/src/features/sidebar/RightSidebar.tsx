import React, { useMemo, useState } from 'react'
import { SuggestedProfileModal } from './SuggestedProfileModal'

export function RightSidebar() {
  const suggestedAthletes = useMemo(
    () => [
      {
        id: 'sarah-jenkins',
        name: 'Sarah Jenkins',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=85',
        tags: 'Marathoner • Climber • Designer',
        bio: 'Passionate trail runner based in Austin. Always looking for weekend long-run partners!',
      },
      {
        id: 'marcus-thorne',
        name: 'Marcus Thorne',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=85',
        tags: 'Ultra Runner • Coach',
        bio: 'Ultra runner and running coach. Love helping others crush their first 50K or 100-miler.',
      },
      {
        id: 'nina-patel',
        name: 'Nina Patel',
        avatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=400&q=85',
        tags: 'Triathlete • Nutritionist',
        bio: 'Triathlete and sports nutritionist. Balancing swim-bike-run with helping athletes fuel properly.',
      },
    ],
    []
  )

  const [requestedIds, setRequestedIds] = useState<Record<string, boolean>>({})
  const [previewAthlete, setPreviewAthlete] = useState<(typeof suggestedAthletes)[0] | null>(null)

  return (
    <aside className="hidden lg:flex flex-col w-full sticky top-0 h-screen overflow-y-auto pt-8 pb-8 px-4 gap-6 border-l border-slate-200 dark:border-slate-800 no-scrollbar">
      {/* ── Trust Credibility Widget ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-500 text-[16px]">verified</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Credibility Score
            </h3>
          </div>
          <span className="text-[9px] font-black bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            L6 Verified
          </span>
        </div>

        {/* Stacked progress bar */}
        <div className="h-3 rounded-full overflow-hidden flex mb-2">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-700"
            style={{ width: '78%' }}
            title="78% Verified Data"
          />
          <div className="bg-slate-200 dark:bg-slate-700 flex-1" title="22% Self-Reported" />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] font-semibold mb-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-emerald-500 inline-block" />
            <span className="text-slate-600 dark:text-slate-400">78% Verified Data</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
            <span className="text-slate-400 dark:text-slate-500">22% Self-Reported</span>
          </div>
        </div>

        {/* Layer breakdown */}
        <div className="flex gap-1">
          {(
            [
              { label: 'L1', color: 'bg-slate-400', title: 'Self-Reported' },
              { label: 'L2', color: 'bg-blue-400', title: 'Media' },
              { label: 'L3', color: 'bg-violet-400', title: 'Device Data' },
              { label: 'L4', color: 'bg-cyan-400', title: 'Peer Confirmed' },
              { label: 'L5', color: 'bg-indigo-500', title: 'Institutional' },
              { label: 'L6', color: 'bg-amber-500', title: 'Official Results' },
            ] as const
          ).map(({ label, color, title }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-0.5" title={title}>
              <div className={`w-full h-1.5 rounded-full ${color}`} />
              <span className="text-[8px] font-black text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => alert('Opening detailed analytics...')}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            alert('Opening detailed analytics...')
          }
        }}
        className={[
          'text-left cursor-pointer',
          'bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4',
          'transition-shadow hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-brand/40',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Your Analytics</h3>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Last 7 Days
          </span>
        </div>

        <div className="space-y-4">
          {/* Profile Views */}
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-slate-400">visibility</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Profile Views
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display tabular-nums">
                42
              </span>
              <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px] leading-none">
                  arrow_upward
                </span>
                +12%
              </span>
            </div>

            <div className="flex items-end gap-1 h-6 mt-3">
              <div className="w-full h-[30%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[50%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[40%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[80%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[60%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[90%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-full rounded-t-sm bg-primary-brand dark:bg-primary-brand" />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

          {/* Post Impressions */}
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-slate-400">bar_chart</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Post Impressions
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display tabular-nums">
                1,204
              </span>
              <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px] leading-none">
                  arrow_upward
                </span>
                +5%
              </span>
            </div>

            <div className="flex items-end gap-1 h-6 mt-3">
              <div className="w-full h-[50%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[30%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[70%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[40%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[90%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-[60%] rounded-t-sm bg-primary-brand/20 dark:bg-primary-brand/40" />
              <div className="w-full h-full rounded-t-sm bg-primary-brand dark:bg-primary-brand" />
            </div>
          </div>

          <button
            type="button"
            onClick={event => {
              event.stopPropagation()
              alert('Loading full analytics dashboard...')
            }}
            className="w-full text-xs font-bold text-primary-brand text-center mt-5 hover:underline cursor-pointer"
          >
            View detailed insights →
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Suggested Connections
          </h3>
        </div>

        <div className="mt-3 space-y-3">
          {suggestedAthletes.map(athlete => {
            const isRequested = requestedIds[athlete.id] === true

            return (
              <div
                key={athlete.id}
                className="flex flex-col gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setPreviewAthlete(athlete)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setPreviewAthlete(athlete)
                    }
                  }}
                  aria-label={`View ${athlete.name}'s profile`}
                >
                  <img
                    src={athlete.avatar}
                    alt={athlete.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    loading="lazy"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {athlete.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      {athlete.tags}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isRequested}
                  onClick={() => setRequestedIds(prev => ({ ...prev, [athlete.id]: true }))}
                  className={[
                    'w-full text-xs font-semibold px-3 py-2 rounded-full transition-colors',
                    isRequested
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-primary-brand text-white hover:brightness-110',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-brand/40',
                  ].join(' ')}
                >
                  {isRequested ? 'Pending' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <SuggestedProfileModal athlete={previewAthlete} onClose={() => setPreviewAthlete(null)} />
    </aside>
  )
}
