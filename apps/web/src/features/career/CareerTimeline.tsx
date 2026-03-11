import { useState } from 'react'
import { AddCredentialModal } from './AddCredentialModal'
import { CredentialDetailModal } from './CredentialDetailModal'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export interface ExperienceItem {
  id: string
  role: string
  organization: string
  /** e.g. "Jan 2022 - Present • 2 yrs 4 mos" */
  dateRange: string
  logoUrl?: string
  logoAlt?: string
  /** Optional city/region */
  location?: string
  /** 2–3 sentence role description */
  description?: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  /** Material Symbols icon name, e.g. "verified_user" */
  icon: string
  imageUrl?: string
  credentialUrl?: string
  issuedDate?: string
  expiresDate?: string
  status?: 'active' | 'expired'
  credentialId?: string
}

// ---------------------------------------------------------------------------
// L5 Institutional verified badge
// ---------------------------------------------------------------------------

function L5VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
      <span className="text-[10px] font-black tabular-nums">L5</span>
      <span className="material-symbols-outlined text-[12px]">verified_user</span>
      <span className="text-[10px] font-bold">Institutional</span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Active / Expired status pill
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: 'active' | 'expired' }) {
  if (status === 'expired') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Expired
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Active
    </span>
  )
}

// ---------------------------------------------------------------------------
// 3-dots overflow menu (shared)
// ---------------------------------------------------------------------------

function OverflowMenu({
  isOpen,
  onToggle,
  onClose,
}: {
  isOpen: boolean
  onToggle: (e: React.MouseEvent) => void
  onClose: () => void
}) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        className="text-slate-400 dark:text-slate-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="More options"
        onClick={onToggle}
      >
        <span className="material-symbols-outlined text-xl">more_vert</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            onClick={e => {
              e.stopPropagation()
              alert('Edit modal opening...')
              onClose()
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={e => {
              e.stopPropagation()
              alert('Item deleted')
              onClose()
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Task 2: Rich Role Card — Experience & Affiliations
// ---------------------------------------------------------------------------

// Timeline connector line — starts just below the 64px (h-16) logo
const timelineLineBase =
  'relative z-10 ' +
  "before:content-[''] before:absolute before:left-8 before:top-16 before:-bottom-8 " +
  'before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700'

const timelineLineLast = 'relative z-10'

function ExperienceEntry({
  item,
  isLast,
  onSelect,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: {
  item: ExperienceItem
  isLast: boolean
  onSelect: () => void
  isMenuOpen: boolean
  onMenuToggle: (e: React.MouseEvent) => void
  onMenuClose: () => void
}) {
  return (
    <div className="relative flex gap-4">
      {/* ── Left column: 64×64 logo + vertical connector ── */}
      <div className={isLast ? timelineLineLast : timelineLineBase}>
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
          {item.logoUrl ? (
            <img
              className="w-full h-full object-cover"
              src={item.logoUrl}
              alt={item.logoAlt ?? item.organization}
            />
          ) : (
            <span className="text-sm font-black text-slate-500 dark:text-slate-400">
              {item.organization.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* ── Right column: elevated card ── */}
      <div
        className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-2 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onSelect}
      >
        {/* Card header */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-900 dark:text-white font-bold text-base leading-tight">
              {item.role}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold mt-0.5">
              {item.organization}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <p className="text-slate-400 dark:text-slate-500 text-xs">{item.dateRange}</p>
              {item.location && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="flex items-center gap-0.5 text-slate-400 dark:text-slate-500 text-xs">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    {item.location}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Task 4: 3-dots menu preserved */}
          <OverflowMenu isOpen={isMenuOpen} onToggle={onMenuToggle} onClose={onMenuClose} />
        </div>

        {/* L5 trust badge */}
        <div className="px-4 pb-3">
          <L5VerifiedBadge />
        </div>

        {/* Description */}
        {item.description && (
          <div className="px-4 pb-4 border-t border-slate-50 dark:border-slate-800 pt-3">
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
              {item.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Task 3: Premium Credential Card — Licenses & Certifications
// ---------------------------------------------------------------------------

const CERT_THEMES = [
  {
    gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    sealBorder: 'ring-indigo-200 dark:ring-indigo-800',
  },
  {
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    sealBorder: 'ring-emerald-200 dark:ring-emerald-800',
  },
  {
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-100 dark:bg-violet-900/50',
    iconColor: 'text-violet-600 dark:text-violet-400',
    sealBorder: 'ring-violet-200 dark:ring-violet-800',
  },
  {
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    sealBorder: 'ring-amber-200 dark:ring-amber-800',
  },
] as const

function CertificationCard({
  cert,
  index,
  onSelect,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: {
  cert: Certification
  index: number
  onSelect: () => void
  isMenuOpen: boolean
  onMenuToggle: (e: React.MouseEvent) => void
  onMenuClose: () => void
}) {
  const theme = CERT_THEMES[index % CERT_THEMES.length]

  return (
    <div
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
      onClick={onSelect}
    >
      {/* ── Gradient header with large centered seal ── */}
      <div
        className={`relative bg-gradient-to-b ${theme.gradient} dark:from-slate-800/80 dark:to-transparent px-4 pt-5 pb-4 flex flex-col items-center`}
      >
        {/* Large badge/seal */}
        <div
          className={`w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center ring-4 ${theme.sealBorder} shadow-sm overflow-hidden`}
        >
          {cert.imageUrl ? (
            <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
          ) : (
            <span className={`material-symbols-outlined text-[32px] ${theme.iconColor}`}>
              {cert.icon}
            </span>
          )}
        </div>

        {/* Credential ID watermark */}
        {cert.credentialId && (
          <p className="mt-2 text-[9px] font-mono text-slate-400 dark:text-slate-600 tracking-wider">
            {cert.credentialId}
          </p>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="px-4 pb-4 flex-1 flex flex-col">
        {/* Status pill + 3-dots */}
        <div className="flex items-center justify-between mb-2">
          {cert.status ? <StatusPill status={cert.status} /> : <span /> /* spacer */}
          {/* Task 4: 3-dots menu preserved */}
          <OverflowMenu isOpen={isMenuOpen} onToggle={onMenuToggle} onClose={onMenuClose} />
        </div>

        {/* Title */}
        <h3 className="text-slate-900 dark:text-white font-bold text-sm leading-tight mb-1">
          {cert.title}
        </h3>

        {/* Issuer */}
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
          {cert.issuer}
        </p>

        {/* Dates */}
        {(cert.issuedDate || cert.expiresDate) && (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-slate-400 dark:text-slate-500 mb-3">
            {cert.issuedDate && <span>Issued {cert.issuedDate}</span>}
            {cert.expiresDate && (
              <>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>Expires {cert.expiresDate}</span>
              </>
            )}
          </div>
        )}

        {/* Show Credential link */}
        {cert.credentialUrl && (
          <a
            className="inline-flex items-center gap-1 text-primary-brand text-xs font-bold mt-auto hover:underline"
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            Show Credential
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Composed section
// ---------------------------------------------------------------------------

interface CareerTimelineProps {
  experience: ExperienceItem[]
  certifications: Certification[]
}

export function CareerTimeline({ experience, certifications }: CareerTimelineProps) {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | Certification | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* ── Experience & Affiliations ── */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
            Experience &amp; Affiliations
          </h2>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-primary-brand/10 text-primary-brand flex items-center justify-center hover:bg-primary-brand/20 transition-colors"
            onClick={() => setIsAddOpen(true)}
            aria-label="Add experience"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {experience.map((item, i) => (
            <ExperienceEntry
              key={item.id}
              item={item}
              isLast={i === experience.length - 1}
              onSelect={() => setSelectedItem(item)}
              isMenuOpen={activeMenuId === item.id}
              onMenuToggle={e => {
                e.stopPropagation()
                setActiveMenuId(activeMenuId === item.id ? null : item.id)
              }}
              onMenuClose={() => setActiveMenuId(null)}
            />
          ))}
        </div>
      </div>

      {/* ── Licenses & Certifications ── */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
            Licenses &amp; Certifications
          </h2>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-primary-brand/10 text-primary-brand flex items-center justify-center hover:bg-primary-brand/20 transition-colors"
            onClick={() => setIsAddOpen(true)}
            aria-label="Add certification"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        {/* Task 3: side-by-side grid on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, i) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={i}
              onSelect={() => setSelectedItem(cert)}
              isMenuOpen={activeMenuId === cert.id}
              onMenuToggle={e => {
                e.stopPropagation()
                setActiveMenuId(activeMenuId === cert.id ? null : cert.id)
              }}
              onMenuClose={() => setActiveMenuId(null)}
            />
          ))}
        </div>
      </div>

      {/* Task 4: modals preserved intact */}
      <CredentialDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <AddCredentialModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  )
}
