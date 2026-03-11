import { createPortal } from 'react-dom'
import type { ExperienceItem } from './CareerTimeline'
import type { Certification } from './CareerTimeline'

type TimelineItem = ExperienceItem | Certification

function isExperience(item: TimelineItem): item is ExperienceItem {
  return 'role' in item && 'dateRange' in item
}

interface CredentialDetailModalProps {
  item: TimelineItem | null
  onClose: () => void
}

const DUMMY_DESCRIPTION = 'Led a team of 5 instructors, managing scheduling and safety protocols.'

export function CredentialDetailModal({ item, onClose }: CredentialDetailModalProps) {
  if (!item) return null

  const isExp = isExperience(item)
  const title = isExp ? item.role : item.title
  const organization = isExp ? item.organization : item.issuer
  const dateRange = isExp ? item.dateRange : null
  const logoUrl = isExp ? item.logoUrl : (item as Certification).imageUrl
  const icon = !isExp ? (item as Certification).icon : null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="credential-detail-title"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 mb-4">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-full h-full object-cover" />
            ) : icon ? (
              <span className="material-symbols-outlined text-4xl text-primary-brand">{icon}</span>
            ) : (
              <span className="text-lg font-bold text-slate-500 dark:text-slate-400">
                {organization.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <h2
            id="credential-detail-title"
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{organization}</p>
          {dateRange && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{dateRange}</p>
          )}
        </div>

        <p className="text-slate-600 dark:text-slate-300 mt-6 text-sm leading-relaxed">
          {DUMMY_DESCRIPTION}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-8 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )
}
