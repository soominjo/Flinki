import type { Achievement } from '../../lib/mockData'

// ---------------------------------------------------------------------------
// Trust Layer System — all 6 layers, each with a distinct visual identity
// ---------------------------------------------------------------------------

export type TrustLayer = 1 | 2 | 3 | 4 | 5 | 6

export interface TrustLayerConfig {
  label: string
  sublabel: string
  icon: string // Material Symbol name
  /** Pill/badge background + text */
  pill: string
  /** Timeline node background */
  nodeBg: string
  /** Timeline node icon color */
  nodeIcon: string
  /** Card background + border */
  cardBg: string
  /** Connector bar between nodes */
  connector: string
  /** Metric value text color */
  valueColor: string
}

export const TRUST_LAYERS: Record<TrustLayer, TrustLayerConfig> = {
  1: {
    label: 'Self-Reported',
    sublabel: 'Claimed by the athlete',
    icon: 'edit_note',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    nodeBg: 'bg-slate-100 dark:bg-slate-700',
    nodeIcon: 'text-slate-500 dark:text-slate-400',
    cardBg: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
    connector: 'bg-slate-300 dark:bg-slate-600',
    valueColor: 'text-slate-600 dark:text-slate-300',
  },
  2: {
    label: 'Media Evidence',
    sublabel: 'Photo or video proof',
    icon: 'photo_camera',
    pill: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400',
    nodeBg: 'bg-violet-100 dark:bg-violet-900/50',
    nodeIcon: 'text-violet-600 dark:text-violet-400',
    cardBg: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800',
    connector: 'bg-violet-300 dark:bg-violet-700',
    valueColor: 'text-violet-700 dark:text-violet-400',
  },
  3: {
    label: 'Activity Log',
    sublabel: 'Logged natively in Flinki',
    icon: 'watch',
    pill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    nodeBg: 'bg-blue-100 dark:bg-blue-900/50',
    nodeIcon: 'text-blue-600 dark:text-blue-400',
    cardBg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    connector: 'bg-blue-300 dark:bg-blue-700',
    valueColor: 'text-blue-700 dark:text-blue-400',
  },
  4: {
    label: 'Peer Confirmed',
    sublabel: 'Tagged by fellow athletes',
    icon: 'group',
    pill: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400',
    nodeBg: 'bg-cyan-100 dark:bg-cyan-900/50',
    nodeIcon: 'text-cyan-600 dark:text-cyan-400',
    cardBg: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800',
    connector: 'bg-cyan-300 dark:bg-cyan-700',
    valueColor: 'text-cyan-700 dark:text-cyan-400',
  },
  5: {
    label: 'Institutional',
    sublabel: 'Validated by an organisation',
    icon: 'verified_user',
    pill: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400',
    nodeBg: 'bg-indigo-100 dark:bg-indigo-900/50',
    nodeIcon: 'text-indigo-600 dark:text-indigo-400',
    cardBg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
    connector: 'bg-indigo-300 dark:bg-indigo-700',
    valueColor: 'text-indigo-700 dark:text-indigo-400',
  },
  6: {
    label: 'Official Results',
    sublabel: 'Verified result on record',
    icon: 'emoji_events',
    pill: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
    nodeBg: 'bg-amber-100 dark:bg-amber-900/50',
    nodeIcon: 'text-amber-600 dark:text-amber-400',
    cardBg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    connector: 'bg-amber-300 dark:bg-amber-700',
    valueColor: 'text-amber-700 dark:text-amber-400',
  },
}

// ---------------------------------------------------------------------------
// TrustLayerBadge — the reusable badge chip for a given layer
// ---------------------------------------------------------------------------

export function TrustLayerBadge({
  layer,
  showLabel = true,
}: {
  layer: TrustLayer
  showLabel?: boolean
}) {
  const c = TRUST_LAYERS[layer]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 ${c.pill}`}
      title={c.sublabel}
    >
      {/* Bold layer number */}
      <span className="text-[10px] font-black tabular-nums">L{layer}</span>
      {/* Layer-specific icon */}
      <span className="material-symbols-outlined text-[12px]">{c.icon}</span>
      {showLabel && <span className="text-[10px] font-bold">{c.label}</span>}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Trust Legend — compact horizontal strip explaining all 6 layers
// ---------------------------------------------------------------------------

function TrustLegend() {
  return (
    <div className="mb-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
        Credibility Layers
      </p>
      <div className="flex flex-col gap-1.5">
        {([6, 5, 4, 3, 2, 1] as TrustLayer[]).map(n => {
          const c = TRUST_LAYERS[n]
          return (
            <div key={n} className="flex items-center gap-2">
              <TrustLayerBadge layer={n} showLabel={false} />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {c.label}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">— {c.sublabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Evidence data — provenance chain for each achievement
// Ordered: highest trust layer first (L6 → L5 → L4 → L3 → L2 → L1)
// ---------------------------------------------------------------------------

export interface EvidenceItem {
  id: string
  layer: TrustLayer
  /** Content-specific icon (may differ from the layer icon) */
  icon: string
  title: string
  value?: string
  detail?: string
  date?: string
  imageUrl?: string
}

export const EVIDENCE: Record<string, EvidenceItem[]> = {
  'ach-1': [
    {
      id: 'e1-1',
      layer: 6,
      icon: 'emoji_events',
      title: 'Verified Finish Time',
      value: '2:58:32',
      detail: 'London Marathon 2024 · Wave 4 · Chip-timed by Abbott',
      date: 'Apr 21, 2024',
    },
    {
      id: 'e1-5',
      layer: 5,
      icon: 'verified_user',
      title: 'London Marathon Race Entry',
      value: 'Bib #18432',
      detail: 'Registration verified · Virgin London Marathon Ltd',
      date: 'Nov 12, 2023',
    },
    {
      id: 'e1-6',
      layer: 4,
      icon: 'group',
      title: 'Tagged by Fellow Runners',
      value: '2 tags',
      detail: 'Jamie L. and Priya S. confirmed your finish-line presence',
      date: 'Apr 21, 2024',
    },
    {
      id: 'e1-3',
      layer: 3,
      icon: 'directions_run',
      title: 'Brighton Half Marathon',
      value: '1:24:18',
      detail: '6 weeks prior · Qualifying standard achieved',
      date: 'Mar 10, 2024',
    },
    {
      id: 'e1-4',
      layer: 3,
      icon: 'watch',
      title: 'Flinki Training Log',
      value: '487 km total',
      detail: '16-week build · Avg 4.2 runs/week · Longest run: 32 km',
      date: 'Jan – Apr 2024',
    },
    {
      id: 'e1-2',
      layer: 2,
      icon: 'photo_library',
      title: 'Race Photos Uploaded',
      value: '3 photos',
      detail: 'Finish line · Tower Bridge km 21 · Start corral',
      date: 'Apr 21, 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&q=85&w=1080&h=720',
    },
  ],
  'ach-2': [
    {
      id: 'e2-1',
      layer: 6,
      icon: 'emoji_events',
      title: 'Verified Finish Time',
      value: '9:41:05',
      detail: 'UTMB 50K 2024 · Bib #2847 · Chamonix finish arch',
      date: 'Aug 30, 2024',
    },
    {
      id: 'e2-5',
      layer: 5,
      icon: 'verified_user',
      title: 'UTMB World Series Registration',
      value: 'Bib #2847',
      detail: 'Official race registration · UTMB Group SA',
      date: 'Feb 5, 2024',
    },
    {
      id: 'e2-3',
      layer: 3,
      icon: 'route',
      title: 'Flinki Training Log',
      value: '52 km · 3,100 m ↑',
      detail: '9 h 41 m active · Avg HR 148 bpm · 4,200 kcal',
      date: 'Aug 30, 2024',
    },
    {
      id: 'e2-4',
      layer: 3,
      icon: 'landscape',
      title: 'Trail Training Block',
      value: '320 km',
      detail: '12-week trail prep · 8,400 m elevation gain',
      date: 'Jun – Aug 2024',
    },
    {
      id: 'e2-2',
      layer: 2,
      icon: 'photo_library',
      title: 'Summit Photo — Col de Voza',
      value: '1 photo',
      detail: '2,026 m elevation · Captured at race checkpoint',
      date: 'Aug 30, 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=85&w=1080&h=720',
    },
  ],
  'ach-3': [
    {
      id: 'e3-1',
      layer: 6,
      icon: 'local_fire_department',
      title: '30-Day Training Streak',
      value: '30 sessions',
      detail: 'Auto-verified from Flinki activity log · No gaps detected',
      date: 'May 20, 2024',
    },
    {
      id: 'e3-4',
      layer: 4,
      icon: 'group',
      title: 'Climbing Partner Endorsement',
      value: 'Yuki T.',
      detail: '"Was at the wall with Alex for most of this streak — absolutely committed."',
      date: 'May 22, 2024',
    },
    {
      id: 'e3-3',
      layer: 3,
      icon: 'fitness_center',
      title: 'Flinki Training Log',
      value: '30 sessions',
      detail: 'Avg 62 min/session · Finger training + outdoor sends · Logged on Flinki',
      date: 'Apr 20 – May 20, 2024',
    },
    {
      id: 'e3-2',
      layer: 2,
      icon: 'photo_library',
      title: 'Session Photos Uploaded',
      value: '7 photos',
      detail: 'Photos from 7 individual sessions during the streak',
      date: 'Apr – May 2024',
      imageUrl:
        'https://images.unsplash.com/photo-1517036495536-fa2fb9a744cb?auto=format&fit=crop&q=85&w=1080&h=720',
    },
    {
      id: 'e3-5',
      layer: 1,
      icon: 'edit_note',
      title: '30-Day Goal Declared',
      value: 'Day 1',
      detail: 'Publicly committed to a 30-day streak on Flinki',
      date: 'Apr 20, 2024',
    },
  ],
  'ach-4': [
    {
      id: 'e4-1',
      layer: 6,
      icon: 'person_add',
      title: 'First Connection Made',
      value: 'Jordan P.',
      detail: 'Mutual follow established · Verified on platform',
      date: 'Jan 15, 2024',
    },
  ],
  'ach-5': [
    {
      id: 'e5-1',
      layer: 6,
      icon: 'star',
      title: 'Skill Endorsement Received',
      value: '"Race Pacing"',
      detail: 'Endorsed by Morgan Chen · Verified athlete (L6 profile)',
      date: 'Jun 1, 2024',
    },
    {
      id: 'e5-2',
      layer: 1,
      icon: 'edit_note',
      title: 'Skill Listed on Profile',
      value: 'Race Pacing',
      detail: 'Self-declared on Flinki profile under Running skills',
      date: 'Jan 10, 2024',
    },
  ],
}

// ---------------------------------------------------------------------------
// Props + component
// ---------------------------------------------------------------------------

interface AchievementDetailModalProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementDetailModal({ achievement, onClose }: AchievementDetailModalProps) {
  if (!achievement) return null

  const evidence = EVIDENCE[achievement.id] ?? []

  // Compute the highest trust layer present for the "Trust Score" callout
  const maxLayer = evidence.reduce<TrustLayer>(
    (acc, item) => (item.layer > acc ? item.layer : acc),
    1
  )
  const maxLayerConfig = TRUST_LAYERS[maxLayer]

  return (
    <div
      className="fixed inset-0 z-modal flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ach-detail-title"
      >
        {/* ── Hero Header ─────────────────────────────────────────────────── */}
        <div className="relative h-52 shrink-0 overflow-hidden rounded-t-3xl bg-slate-200 dark:bg-slate-800">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white rounded-full p-2"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl block">close</span>
          </button>

          {/* Trust score chip — top left */}
          <div className="absolute top-4 left-4">
            <TrustLayerBadge layer={maxLayer} />
          </div>

          {/* Title + date */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 id="ach-detail-title" className="text-white font-bold text-xl leading-snug">
              {achievement.title}
            </h2>
            <p className="text-white/65 text-xs mt-1">
              Unlocked{' '}
              {new Date(achievement.unlockedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* ── Scrollable Body ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Story paragraph */}
          <div className="px-5 pt-5 pb-4">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* ── Trust Score summary bar ────────────────────────────────────── */}
          {evidence.length > 0 && (
            <div className="mx-5 mb-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${maxLayerConfig.nodeBg}`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${maxLayerConfig.nodeIcon}`}
                >
                  {maxLayerConfig.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Highest trust:{' '}
                  <span className={maxLayerConfig.valueColor}>{maxLayerConfig.label}</span>
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {maxLayerConfig.sublabel} · {evidence.length} evidence{' '}
                  {evidence.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <TrustLayerBadge layer={maxLayer} showLabel={false} />
            </div>
          )}

          {/* ── Evidence Waterfall ─────────────────────────────────────────── */}
          {evidence.length > 0 && (
            <div className="px-5 pb-6">
              {/* Section header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  account_tree
                </span>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Evidence Waterfall
                </h3>
              </div>

              {/* Trust Legend */}
              <TrustLegend />

              {/* Timeline */}
              <div className="flex flex-col">
                {evidence.map((item, idx) => {
                  const c = TRUST_LAYERS[item.layer]
                  const isLast = idx === evidence.length - 1

                  return (
                    <div key={item.id} className="flex gap-3">
                      {/* ── Left column: node + connector ── */}
                      <div className="flex flex-col items-center shrink-0 w-10">
                        {/* Node circle */}
                        <div
                          className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shadow-sm ${c.nodeBg}`}
                        >
                          <span className={`material-symbols-outlined text-[20px] ${c.nodeIcon}`}>
                            {item.icon}
                          </span>
                          {/* Layer number badge — bottom-right of node */}
                          <span
                            className={`absolute -bottom-1 -right-1 text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm ${c.pill}`}
                          >
                            {item.layer}
                          </span>
                        </div>
                        {/* Colored connector bar to next node */}
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 min-h-[16px] mt-1 mb-1 rounded-full ${c.connector}`}
                          />
                        )}
                      </div>

                      {/* ── Right column: evidence card ── */}
                      <div className={`flex-1 min-w-0 rounded-2xl border p-3 mb-3 ${c.cardBg}`}>
                        {/* Trust layer badge + verified pill */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          <TrustLayerBadge layer={item.layer} />
                        </div>

                        {/* Title + value */}
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-slate-800 dark:text-white font-semibold text-sm leading-tight flex-1 min-w-0">
                            {item.title}
                          </p>
                          {item.value && (
                            <span className={`shrink-0 text-sm font-bold ${c.valueColor}`}>
                              {item.value}
                            </span>
                          )}
                        </div>

                        {/* Photo thumbnail */}
                        {item.imageUrl && (
                          <div className="mt-2.5 rounded-xl overflow-hidden h-32">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Detail + date */}
                        {item.detail && (
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug mt-2">
                            {item.detail}
                          </p>
                        )}
                        {item.date && (
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1.5">
                            {item.date}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="shrink-0 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
