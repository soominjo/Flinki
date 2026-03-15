import { createPortal } from 'react-dom'
import type { PersonalBest } from '../../lib/mockStatsData'

interface PRDetailModalProps {
  isOpen: boolean
  onClose: () => void
  pr: PersonalBest | null
  onViewEvidenceJourney: () => void
}

export function PRDetailModal({ isOpen, onClose, pr, onViewEvidenceJourney }: PRDetailModalProps) {
  if (!isOpen || !pr) return null

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
        aria-labelledby="pr-detail-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="pr-detail-title" className="text-lg font-bold text-slate-900 dark:text-white">
            Personal Best
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

        {/* PR identity — gradient border pill */}
        <div className={`p-[2px] rounded-2xl bg-gradient-to-br ${pr.theme} mb-5`}>
          <div className="bg-white dark:bg-slate-900 rounded-[14px] p-5 flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-primary-brand text-5xl">{pr.icon}</span>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
              {pr.sport}
            </p>
            <p className="text-slate-900 dark:text-white text-4xl font-bold font-display tabular-nums">
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
                <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-tight">
                  Verified
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details block */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-5 space-y-3">
          {/* Date Achieved */}
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              Date Achieved
            </p>
            <p className="text-slate-900 dark:text-white text-sm font-semibold">{pr.date}</p>
          </div>
          {/* Verified Source */}
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              Verified Source
            </p>
            <div className="flex items-center gap-1.5">
              {pr.verified && (
                <span
                  className="material-symbols-outlined text-emerald-500 text-base shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              )}
              <p className="text-slate-700 dark:text-slate-300 text-sm">{pr.source}</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          className="w-full py-3 rounded-xl bg-primary-brand text-white font-bold text-sm hover:bg-primary-brand/90 transition-colors"
          onClick={() => {
            onClose()
            onViewEvidenceJourney()
          }}
        >
          View Evidence Journey
        </button>
      </div>
    </div>,
    document.body
  )
}
