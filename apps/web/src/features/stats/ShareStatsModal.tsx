import { createPortal } from 'react-dom'
import type { YearStats } from './PerformanceDashboard'
import type { PersonalBest } from '../../lib/mockStatsData'

interface ShareStatsModalProps {
  isOpen: boolean
  onClose: () => void
  year: string
  stats: YearStats | null
  topPR: PersonalBest
}

export function ShareStatsModal({ isOpen, onClose, year, stats, topPR }: ShareStatsModalProps) {
  if (!isOpen || !stats) return null

  return createPortal(
    <div
      className="fixed inset-0 z-overlay bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-2xl flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-stats-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="share-stats-title" className="text-lg font-bold text-slate-900 dark:text-white">
            Share Your Year
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Year in Sport card — the shareable centrepiece */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white mb-5">
          {/* App wordmark */}
          <p className="text-primary-brand font-bold text-[10px] uppercase tracking-widest mb-3">
            Flinki
          </p>

          {/* Year headline */}
          <p className="text-white text-2xl font-bold font-display leading-tight mb-5">
            {year} Year in Sport
          </p>

          {/* Key stats row */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                Total Distance
              </p>
              <p className="text-white text-2xl font-bold font-display tabular-nums leading-none">
                {stats.distance}
                <span className="text-base font-medium text-slate-400 ml-1">
                  {stats.distanceUnit}
                </span>
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                Active Days
              </p>
              <p className="text-white text-2xl font-bold font-display tabular-nums leading-none">
                {stats.activeDays}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-5" />

          {/* Top PR */}
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              Top Personal Best
            </p>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-brand text-2xl">
                {topPR.icon}
              </span>
              <div>
                <p className="text-slate-300 text-xs font-semibold">{topPR.sport}</p>
                <p className="text-white text-xl font-bold font-display tabular-nums leading-tight">
                  {topPR.time}
                </p>
              </div>
              {topPR.verified && (
                <div className="ml-auto flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-emerald-400 text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-tight">
                    Verified
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Branding footer */}
          <p className="text-slate-500 text-xs mt-5 text-right">flinki.app</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 py-3 rounded-xl border-2 border-primary-brand/30 text-primary-brand font-bold text-sm hover:bg-primary-brand/5 transition-colors"
            onClick={() => alert('Image saving coming soon.')}
          >
            Save Image
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-primary-brand text-white font-bold text-sm hover:bg-primary-brand/90 transition-colors"
            onClick={() => alert('Link copied!')}
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
