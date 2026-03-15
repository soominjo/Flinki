// ---------------------------------------------------------------------------
// Squad & Training Partners
// Surfaces Layer 4 (Peer Confirmation) relationships on the profile.
// ---------------------------------------------------------------------------

export interface SquadMember {
  id: string
  name: string
  avatarUrl?: string
  /** e.g. "Running Partner", "Climbing Buddy" */
  relationship: string
  /** Material Symbols icon for the sport */
  sportIcon: string
  /** Whether the current user already follows them */
  following: boolean
}

import { useState } from 'react'

// ---------------------------------------------------------------------------
// AvatarStack — overlapping avatar strip (the visual hook for Layer 4)
// ---------------------------------------------------------------------------

function AvatarStack({ members }: { members: SquadMember[] }) {
  const shown = members.slice(0, 4)

  return (
    <div className="flex items-center gap-3 mb-5">
      {/* Overlapping avatars */}
      <div className="flex -space-x-3">
        {shown.map((m, i) => {
          const initials = m.name
            .split(' ')
            .map(w => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)

          return (
            <div
              key={m.id}
              title={m.name}
              className="h-11 w-11 rounded-full border-[2.5px] border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm"
              style={{ zIndex: shown.length - i }}
            >
              {m.avatarUrl ? (
                <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                  {initials}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Label */}
      <div>
        <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
          {shown.map(m => m.name.split(' ')[0]).join(', ')}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
          train together regularly
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SquadMemberRow
// ---------------------------------------------------------------------------

function SquadMemberRow({ member }: { member: SquadMember }) {
  const [following, setFollowing] = useState(member.following)

  const initials = member.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
        {member.avatarUrl ? (
          <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400">
            {initials}
          </div>
        )}
      </div>

      {/* Name + relationship */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[12px] text-slate-400">
            {member.sportIcon}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {member.relationship}
          </span>
        </div>
      </div>

      {/* L4 badge + follow toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {/* L4 trust indicator */}
        <span className="text-[9px] font-black bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 px-1.5 py-0.5 rounded">
          L4
        </span>

        <button
          type="button"
          onClick={() => setFollowing(f => !f)}
          className={[
            'text-[11px] font-bold px-3 py-1.5 rounded-full transition-all duration-200',
            following
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
              : 'bg-primary-brand text-white shadow-sm shadow-primary-brand/20 hover:bg-primary-brand/90',
          ].join(' ')}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SquadSection
// ---------------------------------------------------------------------------

interface SquadSectionProps {
  members: SquadMember[]
}

export function SquadSection({ members }: SquadSectionProps) {
  if (members.length === 0) return null

  return (
    <section className="mx-4 mb-3">
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-500 text-[18px]">group</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Frequent Training Partners
            </h3>
            <span className="text-[9px] font-black bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 px-1.5 py-0.5 rounded">
              L4 · Peer Confirmed
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            {members.length} partners
          </span>
        </div>

        {/* Overlapping avatar stack — the Layer 4 visual hook */}
        <AvatarStack members={members} />

        {/* Members list */}
        <div className="flex flex-col gap-4">
          {members.map(member => (
            <SquadMemberRow key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
