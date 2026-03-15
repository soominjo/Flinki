import { EVIDENCE, TRUST_LAYERS, type TrustLayer } from '../achievements/AchievementDetailModal'
import { mockAchievements } from '../../lib/mockData'

// ---------------------------------------------------------------------------
// Derive the overall trust picture from all achievements' evidence
// ---------------------------------------------------------------------------

function computeTrustMatrix() {
  const layersPresent = new Set<TrustLayer>()
  let peerTags = 0
  let institutionalCount = 0

  for (const ach of mockAchievements) {
    const items = EVIDENCE[ach.id] ?? []
    for (const item of items) {
      layersPresent.add(item.layer)
      if (item.layer === 4) peerTags++
      if (item.layer === 5) institutionalCount++
    }
  }

  const maxLayer = ([6, 5, 4, 3, 2, 1] as TrustLayer[]).find(l => layersPresent.has(l)) ?? 1

  return { layersPresent, maxLayer, peerTags, institutionalCount }
}

const { layersPresent, maxLayer, peerTags, institutionalCount } = computeTrustMatrix()
const maxLayerCfg = TRUST_LAYERS[maxLayer]

// ---------------------------------------------------------------------------
// TrustMatrixWidget
// ---------------------------------------------------------------------------

interface TrustMatrixWidgetProps {
  achievementsCount: number
  onViewReport?: () => void
}

export function TrustMatrixWidget({ achievementsCount, onViewReport }: TrustMatrixWidgetProps) {
  return (
    <section className="mx-4 mt-4 mb-3">
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-xl flex items-center justify-center ${maxLayerCfg.nodeBg}`}
            >
              <span className={`material-symbols-outlined text-[18px] ${maxLayerCfg.nodeIcon}`}>
                {maxLayerCfg.icon}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none mb-0.5">
                Credibility Score
              </p>
              <p className={`text-sm font-black leading-none ${maxLayerCfg.valueColor}`}>
                L{maxLayer} · {maxLayerCfg.label}
              </p>
            </div>
          </div>

          {/* Sponsor-facing "verified" stamp */}
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-1.5">
            <span className="material-symbols-outlined text-amber-500 text-[16px]">verified</span>
            <span className="text-[11px] font-black text-amber-700 dark:text-amber-400">
              Verified
            </span>
          </div>
        </div>

        {/* 6-layer segment bar */}
        <div className="px-4 mb-3">
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            {([1, 2, 3, 4, 5, 6] as TrustLayer[]).map(n => {
              const c = TRUST_LAYERS[n]
              const active = layersPresent.has(n)
              return (
                <div
                  key={n}
                  title={`L${n}: ${c.label}`}
                  className={`flex-1 rounded-sm transition-opacity ${active ? c.connector : 'bg-slate-200 dark:bg-slate-700 opacity-40'}`}
                />
              )
            })}
          </div>
        </div>

        {/* Layer icon row */}
        <div className="px-4 mb-4">
          <div className="flex gap-1">
            {([1, 2, 3, 4, 5, 6] as TrustLayer[]).map(n => {
              const c = TRUST_LAYERS[n]
              const active = layersPresent.has(n)
              return (
                <div
                  key={n}
                  title={c.label}
                  className={`flex-1 flex flex-col items-center gap-0.5 transition-opacity ${active ? 'opacity-100' : 'opacity-25'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? c.nodeBg : 'bg-slate-100 dark:bg-slate-800'}`}
                  >
                    <span
                      className={`material-symbols-outlined text-[14px] ${active ? c.nodeIcon : 'text-slate-400'}`}
                    >
                      {c.icon}
                    </span>
                  </div>
                  <span className="text-[8px] font-black text-slate-400">L{n}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats row + CTA */}
        <div className="px-4 pb-4 border-t border-slate-50 dark:border-slate-800 pt-3 flex items-center gap-3">
          {/* Stat pills */}
          <div className="flex-1 flex flex-wrap gap-1.5">
            <StatChip
              icon="emoji_events"
              value={achievementsCount}
              label="verified"
              color="amber"
            />
            {institutionalCount > 0 && (
              <StatChip
                icon="verified_user"
                value={institutionalCount}
                label="institutional"
                color="indigo"
              />
            )}
            {peerTags > 0 && (
              <StatChip icon="group" value={peerTags} label="peer tags" color="cyan" />
            )}
          </div>

          {/* View report CTA */}
          {onViewReport && (
            <button
              type="button"
              onClick={onViewReport}
              className="shrink-0 flex items-center gap-1 text-primary-brand text-[11px] font-bold hover:underline"
            >
              View report
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// StatChip
// ---------------------------------------------------------------------------

type ChipColor = 'amber' | 'indigo' | 'cyan'

const CHIP_COLORS: Record<ChipColor, string> = {
  amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
  cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400',
}

function StatChip({
  icon,
  value,
  label,
  color,
}: {
  icon: string
  value: number
  label: string
  color: ChipColor
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${CHIP_COLORS[color]}`}
    >
      <span className="material-symbols-outlined text-[11px]">{icon}</span>
      {value} {label}
    </span>
  )
}
