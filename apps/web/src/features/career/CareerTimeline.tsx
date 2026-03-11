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
}

export interface Certification {
  id: string
  title: string
  issuer: string
  /** Material Symbols icon name, e.g. "verified_user" */
  icon: string
  imageUrl?: string
  credentialUrl?: string
}

// ---------------------------------------------------------------------------
// Experience & Affiliations timeline
// ---------------------------------------------------------------------------

// The reference CSS for .timeline-line::before:
//   content: ''; position: absolute; left: 20px; top: 40px;
//   bottom: -20px; width: 2px; background-color: #e2e8f0;
// .timeline-item:last-child .timeline-line::before { display: none; }
//
// Breakdown → Tailwind utilities:
//   left: 20px  → before:left-5   (5 × 4px = 20px)
//   top: 40px   → before:top-10  (10 × 4px = 40px)
//   bottom: -20px → before:-bottom-5
//   width: 2px  → before:w-0.5
//   #e2e8f0     → before:bg-slate-200
//   last-child hidden → omit the classes when isLast

const timelineLineBase =
  'relative z-10 ' +
  "before:content-[''] before:absolute before:left-5 before:top-10 before:-bottom-5 " +
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
      {/* Logo column — hosts the ::before connector line via Tailwind */}
      <div className={isLast ? timelineLineLast : timelineLineBase}>
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
          {item.logoUrl ? (
            <img
              className="w-full h-full object-cover"
              src={item.logoUrl}
              alt={item.logoAlt ?? item.organization}
            />
          ) : (
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {item.organization.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div
          className="flex justify-between items-start cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors p-2 -mx-2 rounded-xl"
          onClick={onSelect}
        >
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-base leading-tight">
              {item.role}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">{item.organization}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{item.dateRange}</p>
          </div>
          <div className="relative shrink-0">
            <button
              type="button"
              className="text-slate-400 dark:text-slate-500 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="More options"
              onClick={onMenuToggle}
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={e => {
                    e.stopPropagation()
                    alert('Edit post modal opening...')
                    onMenuClose()
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={e => {
                    e.stopPropagation()
                    alert('Post deleted')
                    onMenuClose()
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Licenses & Certifications list
// ---------------------------------------------------------------------------

function CertificationCard({
  cert,
  onSelect,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: {
  cert: Certification
  onSelect: () => void
  isMenuOpen: boolean
  onMenuToggle: (e: React.MouseEvent) => void
  onMenuClose: () => void
}) {
  return (
    <div className="flex gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative">
      {/* Icon / image badge */}
      <div className="w-12 h-12 rounded-full bg-primary-brand/5 flex items-center justify-center text-primary-brand shrink-0 overflow-hidden">
        {cert.imageUrl ? (
          <img src={cert.imageUrl} alt={cert.title} className="h-full w-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-3xl">{cert.icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className="flex justify-between items-start cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors p-2 -mx-2 rounded-xl"
          onClick={onSelect}
        >
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm leading-tight">
              {cert.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{cert.issuer}</p>
            {cert.credentialUrl && (
              <a
                className="inline-flex items-center gap-1 text-primary-brand text-xs font-bold mt-2 hover:underline"
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
          <div className="relative shrink-0">
            <button
              type="button"
              className="text-slate-400 dark:text-slate-500 -mr-1 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="More options"
              onClick={onMenuToggle}
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={e => {
                    e.stopPropagation()
                    alert('Edit post modal opening...')
                    onMenuClose()
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={e => {
                    e.stopPropagation()
                    alert('Post deleted')
                    onMenuClose()
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
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
  onAddCredential?: () => void
}

export function CareerTimeline({ experience, certifications }: CareerTimelineProps) {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | Certification | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Experience & Affiliations */}
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
        <div className="flex flex-col gap-8">
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

      {/* Licenses & Certifications */}
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
        <div className="flex flex-col gap-4">
          {certifications.map(cert => (
            <CertificationCard
              key={cert.id}
              cert={cert}
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

      <CredentialDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <AddCredentialModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  )
}
