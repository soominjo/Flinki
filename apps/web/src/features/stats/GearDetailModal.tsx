import { createPortal } from 'react-dom'

export interface GearLockerItem {
  id: string
  brand: string
  model: string
  image: string
  currentMetric: number
  maxMetric: number
  metricUnit: string
  color: string
}

interface GearDetailModalProps {
  isOpen: boolean
  onClose: () => void
  gear: GearLockerItem | null
}

export function GearDetailModal({ isOpen, onClose, gear }: GearDetailModalProps) {
  if (!isOpen || !gear) return null

  const fillPct = Math.round((gear.currentMetric / gear.maxMetric) * 100)
  const unitBase = gear.metricUnit.replace(' cap', '')
  const remaining = gear.maxMetric - gear.currentMetric

  // Escalate progress bar color as gear wears out
  const progressColorClass =
    fillPct >= 80 ? 'bg-rose-500' : fillPct >= 60 ? 'bg-amber-500' : gear.color

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
        aria-labelledby="gear-detail-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="gear-detail-title" className="text-lg font-bold text-slate-900 dark:text-white">
            Gear Details
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

        {/* Gear identity */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-800 bg-center bg-cover shrink-0 border border-slate-200 dark:border-slate-700"
            style={{ backgroundImage: `url('${gear.image}')` }}
            role="img"
            aria-label={`${gear.brand} ${gear.model}`}
          />
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
              {gear.brand}
            </p>
            <h3 className="text-slate-900 dark:text-white text-xl font-bold font-display">
              {gear.model}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Added Jan 2025</p>
          </div>
        </div>

        {/* Lifespan progress */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-4">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">
            Lifespan Progress
          </p>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-slate-900 dark:text-white text-2xl font-bold font-display">
              {gear.currentMetric}
              <span className="text-sm font-medium text-slate-400 ml-1">{unitBase}</span>
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">
              {remaining} {unitBase} remaining
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`${progressColorClass} h-full rounded-full transition-all duration-500`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] font-bold text-slate-400">0</span>
            <span className="text-[10px] font-bold text-slate-400">{fillPct}% used</span>
            <span className="text-[10px] font-bold text-slate-400">
              {gear.maxMetric} {unitBase}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            className="flex-1 py-3 rounded-xl border-2 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            onClick={() => {
              alert(`${gear.brand} ${gear.model} retired.`)
              onClose()
            }}
          >
            Retire
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-xl bg-primary-brand text-white font-bold text-sm hover:bg-primary-brand/90 transition-colors"
            onClick={() => {
              alert('Edit functionality coming soon.')
              onClose()
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
