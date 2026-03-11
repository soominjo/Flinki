import { useState } from 'react'
import type { Achievement } from '../../lib/mockData'
import {
  TRUST_LAYERS,
  EVIDENCE,
  TrustLayerBadge,
  type TrustLayer,
  type EvidenceItem,
} from './AchievementDetailModal'

// ---------------------------------------------------------------------------
// Timeline Node — one evidence entry in the vertical waterfall
// ---------------------------------------------------------------------------

interface TimelineNodeProps {
  item: EvidenceItem
  isLast: boolean
}

function TimelineNode({ item, isLast }: TimelineNodeProps) {
  const c = TRUST_LAYERS[item.layer]

  return (
    <div className="flex gap-3">
      {/* ── Left column: node circle + vertical connector ── */}
      <div className="flex flex-col items-center shrink-0 w-10">
        {/* Colored node circle */}
        <div
          className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${c.nodeBg}`}
        >
          <span className={`material-symbols-outlined text-[20px] ${c.nodeIcon}`}>{item.icon}</span>
          {/* Layer number badge — bottom-right of the node */}
          <span
            className={`absolute -bottom-1 -right-1 text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm ${c.pill}`}
          >
            {item.layer}
          </span>
        </div>

        {/* Connector line to next node */}
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-[20px] mt-1 mb-1 rounded-full ${c.connector}`} />
        )}
      </div>

      {/* ── Right column: evidence card ── */}
      <div className={`flex-1 min-w-0 rounded-2xl border p-3 mb-3 ${c.cardBg}`}>
        {/* Task 4: Trust layer badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <TrustLayerBadge layer={item.layer} />
        </div>

        {/* Title + value */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-slate-800 dark:text-white font-semibold text-sm leading-tight flex-1 min-w-0">
            {item.title}
          </p>
          {item.value && (
            <span className={`shrink-0 text-sm font-bold ${c.valueColor}`}>{item.value}</span>
          )}
        </div>

        {/* Photo thumbnail */}
        {item.imageUrl && (
          <div className="mt-2.5 rounded-xl overflow-hidden h-32">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Detail + date */}
        {item.detail && (
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug mt-2">
            {item.detail}
          </p>
        )}
        {item.date && (
          <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1.5">{item.date}</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TrustScoreBar — thin multi-segment bar showing which layers are present
// ---------------------------------------------------------------------------

function TrustScoreBar({ layers }: { layers: TrustLayer[] }) {
  const present = new Set(layers)
  return (
    <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden">
      {([1, 2, 3, 4, 5, 6] as TrustLayer[]).map(n => {
        const c = TRUST_LAYERS[n]
        return (
          <div
            key={n}
            className={`flex-1 rounded-sm transition-opacity duration-300 ${present.has(n) ? c.connector : 'bg-slate-200 dark:bg-slate-700'}`}
          />
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AchievementWaterfall — hero card + expandable evidence journey
// ---------------------------------------------------------------------------

interface AchievementWaterfallProps {
  achievement: Achievement
}

export function AchievementWaterfall({ achievement }: AchievementWaterfallProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const evidence = EVIDENCE[achievement.id] ?? []
  const l6Item = evidence.find(e => e.layer === 6)
  const maxLayer = evidence.reduce<TrustLayer>(
    (acc, item) => (item.layer > acc ? item.layer : acc),
    1
  )
  const maxLayerCfg = TRUST_LAYERS[maxLayer]
  const evidenceLayers = evidence.map(e => e.layer) as TrustLayer[]

  const dateFormatted = new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* ── Task 2: Hero Card ─────────────────────────────────────────────── */}
      <div className="relative">
        {/* Hero image / gradient */}
        <div className="relative h-52 overflow-hidden bg-slate-200 dark:bg-slate-800">
          {achievement.imageUrl ? (
            <img
              src={achievement.imageUrl}
              alt={achievement.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
              {achievement.icon}
            </div>
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* Top-left: highest trust layer badge */}
          <div className="absolute top-3 left-3">
            <TrustLayerBadge layer={maxLayer} />
          </div>

          {/* Top-right: evidence count pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="material-symbols-outlined text-white text-[13px]">account_tree</span>
            <span className="text-white text-[10px] font-bold">
              {evidence.length} evidence {evidence.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Bottom overlay: title + date */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h4 className="text-white font-bold text-[17px] leading-snug">{achievement.title}</h4>
            <p className="text-white/60 text-[11px] mt-0.5">Unlocked {dateFormatted}</p>
          </div>
        </div>

        {/* ── L6 Outcome Panel (Official Results) ── */}
        {l6Item && (
          <div className="px-4 pt-4 pb-1">
            <div
              className={`flex items-center gap-3 rounded-2xl border p-3 ${TRUST_LAYERS[6].cardBg}`}
            >
              {/* L6 icon */}
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${TRUST_LAYERS[6].nodeBg}`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${TRUST_LAYERS[6].nodeIcon}`}
                >
                  {l6Item.icon}
                </span>
              </div>

              {/* Metric */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                  Official Result
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-black tabular-nums ${TRUST_LAYERS[6].valueColor}`}>
                    {l6Item.value}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    {l6Item.title}
                  </span>
                </div>
                {l6Item.detail && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                    {l6Item.detail}
                  </p>
                )}
              </div>

              {/* L6 badge */}
              <TrustLayerBadge layer={6} showLabel={false} />
            </div>
          </div>
        )}

        {/* ── Trust score bar + Expand Journey button ── */}
        <div className="px-4 pt-3 pb-4">
          {/* Multi-layer trust bar */}
          {evidence.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Credibility Chain
                </span>
                <span className={`text-[10px] font-bold ${maxLayerCfg.valueColor}`}>
                  {maxLayerCfg.label}
                </span>
              </div>
              <TrustScoreBar layers={evidenceLayers} />
            </div>
          )}

          {/* Expand Journey button */}
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className={[
              'w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200',
              isExpanded
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                : 'bg-primary-brand text-white shadow-md shadow-primary-brand/20 hover:bg-primary-brand/90 active:scale-[0.98]',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExpanded ? 'expand_less' : 'timeline'}
            </span>
            {isExpanded ? 'Collapse Journey' : 'Expand Journey'}
            <span
              className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            >
              keyboard_arrow_down
            </span>
          </button>
        </div>
      </div>

      {/* ── Task 3 & 4: Expandable Evidence Timeline ─────────────────────── */}
      {isExpanded && evidence.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
          {/* Section header */}
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">account_tree</span>
            <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Evidence Journey
            </h3>
            <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500">
              {evidence.length} layers · ordered L6 → L1
            </span>
          </div>

          {/* Timeline nodes */}
          <div className="px-4 pb-4">
            {evidence.map((item, idx) => (
              <TimelineNode key={item.id} item={item} isLast={idx === evidence.length - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
