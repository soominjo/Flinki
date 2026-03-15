// ---------------------------------------------------------------------------
// TrainingSquad — horizontal scrollable row of verified training partners.
// Each card: avatar with trust-level ring, name, sport, session count.
// ---------------------------------------------------------------------------

// ── Trust level visual tokens ────────────────────────────────────────────────
const TRUST_RING: Record<number, string> = {
  1: 'ring-slate-300  dark:ring-slate-600',
  2: 'ring-amber-400  dark:ring-amber-500',
  3: 'ring-blue-400   dark:ring-blue-500',
  4: 'ring-cyan-400   dark:ring-cyan-500',
  5: 'ring-violet-400 dark:ring-violet-500',
  6: 'ring-yellow-400 dark:ring-yellow-500',
}

const TRUST_BADGE: Record<number, string> = {
  1: 'bg-slate-100  dark:bg-slate-800 text-slate-600  dark:text-slate-300',
  2: 'bg-amber-100  dark:bg-amber-900/40 text-amber-700  dark:text-amber-400',
  3: 'bg-blue-100   dark:bg-blue-900/40 text-blue-700   dark:text-blue-400',
  4: 'bg-cyan-100   dark:bg-cyan-900/40 text-cyan-700   dark:text-cyan-400',
  5: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400',
  6: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500',
}

const TRUST_LABEL: Record<number, string> = {
  1: 'Self-Rep',
  2: 'Media',
  3: 'Device',
  4: 'Peer',
  5: 'Org',
  6: 'Official',
}

// ── Data shape ────────────────────────────────────────────────────────────────

export interface TrainingPartner {
  id: string
  name: string
  avatarUrl: string
  sport: string
  sportIcon: string
  trustLevel: 1 | 2 | 3 | 4 | 5 | 6
  mutualSessions: number
}

// ── Mock data — Task 2 ────────────────────────────────────────────────────────

export const MOCK_TRAINING_SQUAD: TrainingPartner[] = [
  {
    id: 'tp-1',
    name: 'Jordan Pierce',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=200&h=200',
    sport: 'Running',
    sportIcon: 'directions_run',
    trustLevel: 6,
    mutualSessions: 42,
  },
  {
    id: 'tp-2',
    name: 'Yuki Tanaka',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=85&w=200&h=200',
    sport: 'Climbing',
    sportIcon: 'landscape',
    trustLevel: 5,
    mutualSessions: 28,
  },
  {
    id: 'tp-3',
    name: 'Morgan Chen',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=200&h=200',
    sport: 'Trail Run',
    sportIcon: 'terrain',
    trustLevel: 5,
    mutualSessions: 19,
  },
  {
    id: 'tp-4',
    name: 'Sam Okafor',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=85&w=200&h=200',
    sport: 'Cycling',
    sportIcon: 'directions_bike',
    trustLevel: 4,
    mutualSessions: 11,
  },
]

// ── PartnerCard ───────────────────────────────────────────────────────────────

function PartnerCard({ partner }: { partner: TrainingPartner }) {
  return (
    <div className="flex flex-col items-center shrink-0 w-[72px] gap-1 cursor-pointer group">
      {/* Avatar + trust ring + badge */}
      <div className="relative mb-1">
        <div
          className={`h-14 w-14 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 ${TRUST_RING[partner.trustLevel]}`}
        >
          <img
            src={partner.avatarUrl}
            alt={partner.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Trust level badge pinned to bottom of avatar */}
        <div
          className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-[8px] font-black px-1.5 py-px rounded-full whitespace-nowrap shadow-sm ${TRUST_BADGE[partner.trustLevel]}`}
          title={`Layer ${partner.trustLevel} — ${TRUST_LABEL[partner.trustLevel]}`}
        >
          <span className="material-symbols-outlined text-[8px]">verified</span>L
          {partner.trustLevel}
        </div>
      </div>

      {/* Name */}
      <p className="text-[11px] font-semibold text-slate-800 dark:text-white text-center leading-tight line-clamp-2 mt-0.5 w-full">
        {partner.name}
      </p>

      {/* Sport */}
      <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500">
        <span className="material-symbols-outlined text-[10px]">{partner.sportIcon}</span>
        <span className="text-[9px]">{partner.sport}</span>
      </div>

      {/* Mutual sessions */}
      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
        {partner.mutualSessions} sessions
      </span>
    </div>
  )
}

// ── TrainingSquad — Task 1 ────────────────────────────────────────────────────

export function TrainingSquad() {
  return (
    <section className="mx-4 mb-3">
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm px-4 pt-4 pb-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-500 text-[18px]">group</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Training Squad</h3>
            <span className="text-[9px] font-black bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 px-1.5 py-0.5 rounded">
              L4 · Peer Confirmed
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            {MOCK_TRAINING_SQUAD.length} partners
          </span>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
          {MOCK_TRAINING_SQUAD.map(partner => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  )
}
