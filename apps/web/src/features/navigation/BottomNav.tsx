import React from 'react'

const LEFT_NAV_ITEMS = [
  { tab: 'Achievements', label: 'Achievements', icon: 'emoji_events' },
  { tab: 'Activities', label: 'Activities', icon: 'bolt' },
] as const

const RIGHT_NAV_ITEMS = [
  { tab: 'Career & Quals', label: 'Career', icon: 'work' },
  { tab: 'Stats', label: 'Stats', icon: 'bar_chart' },
  { tab: 'Social', label: 'Social', icon: 'group' },
  { tab: 'Messages', label: 'Messages', icon: 'chat' },
  { tab: 'Notifications', label: 'Alerts', icon: 'notifications' },
] as const

const ALL_NAV_ITEMS = [...LEFT_NAV_ITEMS, ...RIGHT_NAV_ITEMS] as const

export type NavTab = (typeof ALL_NAV_ITEMS)[number]['tab'] | 'Train'

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  /** Content injected at the bottom of the desktop sidebar. Hidden on mobile. */
  desktopBottomContent?: React.ReactNode
  /** Unread notification count — renders a badge on the bell icon when > 0. */
  notificationCount?: number
}

interface NavButtonProps {
  tab: NavTab
  label: string
  icon: string
  isActive: boolean
  onClick: () => void
  /** When provided, renders a count badge on the icon. */
  badge?: number
}

function NavButton({ tab, label, icon, isActive, onClick, badge }: NavButtonProps) {
  return (
    <button
      key={tab}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      title={label}
      className={[
        // Base: mobile stacked column, desktop horizontal row
        'relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
        'py-3 px-1.5 flex-1 md:flex-none',
        'md:flex-row md:items-center md:gap-3',
        'md:w-full md:px-4 md:py-2.5 md:rounded-xl md:justify-start',
        isActive
          ? // Desktop: soft tinted pill — Train keeps the only solid purple block
            'text-primary-brand font-bold md:bg-primary-brand/10 dark:md:bg-primary-brand/15 md:text-primary-brand'
          : // Inactive: muted with smooth hover lift on desktop, subtle on mobile
            'text-slate-400 dark:text-slate-500 font-semibold hover:text-slate-600 dark:hover:text-slate-300 md:hover:bg-slate-100 dark:md:hover:bg-slate-800 md:hover:text-slate-700 dark:md:hover:text-slate-200',
      ].join(' ')}
    >
      {/* Mobile active indicator — thin bar above icon */}
      <span
        className={[
          'md:hidden absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300',
          isActive ? 'w-5 bg-primary-brand' : 'w-0 bg-transparent',
        ].join(' ')}
      />

      {/* Icon — wrapped in relative div so the badge can sit on top-right of the icon */}
      <div className="relative leading-none">
        <span
          className="material-symbols-outlined text-xl"
          style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {icon}
        </span>

        {/* Unread badge */}
        {badge !== undefined && badge > 0 && (
          <span
            aria-label={`${badge} unread notifications`}
            className={[
              'absolute -top-1.5 -right-2',
              'min-w-[16px] h-4 px-[3px]',
              'bg-primary-brand text-white',
              'text-[9px] font-bold leading-none',
              'rounded-full flex items-center justify-center',
              'ring-2 ring-white dark:ring-slate-900',
            ].join(' ')}
          >
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>

      <span className="text-[10px] md:hidden leading-tight">{label}</span>
      <span className="hidden md:inline text-sm font-semibold">{label}</span>
    </button>
  )
}

export function BottomNav({
  activeTab,
  onTabChange,
  desktopBottomContent,
  notificationCount,
}: BottomNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={[
        // Mobile: fixed horizontal bar at bottom — align to end so circle floats up
        'fixed bottom-0 left-0 right-0 z-20',
        'flex flex-row justify-between items-end',
        'bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2',
        // md+: sticky left sidebar
        'md:sticky md:top-0 md:h-screen md:flex-col md:justify-start md:items-stretch',
        'md:w-full md:border-r md:border-slate-200 dark:md:border-slate-800 md:border-t-0',
        'md:pt-8 md:gap-1 md:px-4',
      ].join(' ')}
    >
      {/* Wordmark — sidebar only */}
      <div className="hidden md:block mb-4 px-3">
        <span className="text-2xl font-bold text-primary-brand tracking-tight">Flinki</span>
      </div>

      {/* Left items (mobile) / top items (sidebar) */}
      {LEFT_NAV_ITEMS.map(({ tab, label, icon }) => (
        <NavButton
          key={tab}
          tab={tab}
          label={label}
          icon={icon}
          isActive={activeTab === tab}
          onClick={() => onTabChange(tab)}
        />
      ))}

      {/* ── Center elevated "Train" button ── */}
      {/*
        Mobile:  full-width flex slot → circle floats up via -mt-8 + items-end parent
                 label renders below the circle, outside it
        Desktop: stretches to a full sidebar row like the other nav items
      */}
      <button
        onClick={() => onTabChange('Train')}
        aria-label="Log a training session"
        title="Train"
        className={[
          // Mobile: flex slot with floating circle; Desktop: full-width sidebar row
          'flex-1 flex flex-col items-center justify-end pb-2 transition-all duration-200',
          'md:flex-none md:flex-row md:items-center md:gap-3 md:justify-start',
          'md:w-full md:px-4 md:py-2.5 md:rounded-xl md:pb-2.5',
          'md:bg-primary-brand md:hover:bg-primary-brand/90 md:text-white',
        ].join(' ')}
      >
        {/* Circle — mobile only */}
        <div className="h-12 w-12 -mt-8 rounded-full bg-primary-brand text-white shadow-lg shadow-primary-brand/30 flex items-center justify-center md:hidden">
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add
          </span>
        </div>

        {/* Mobile tiny label */}
        <span className="text-[10px] font-semibold text-primary-brand mt-1 md:hidden">Train</span>

        {/* Desktop icon + label */}
        <span
          className="material-symbols-outlined text-xl hidden md:block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          add_circle
        </span>
        <span className="hidden md:inline text-sm font-bold text-white">Train</span>
      </button>

      {/* Right items (mobile) / bottom items (sidebar) */}
      {RIGHT_NAV_ITEMS.map(({ tab, label, icon }) => (
        <NavButton
          key={tab}
          tab={tab}
          label={label}
          icon={icon}
          isActive={activeTab === tab}
          onClick={() => onTabChange(tab)}
          badge={tab === 'Notifications' ? notificationCount : undefined}
        />
      ))}

      {/* Desktop-only bottom slot — hidden on mobile */}
      {desktopBottomContent && (
        <div className="hidden md:flex flex-col mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 overflow-y-auto no-scrollbar">
          {desktopBottomContent}
        </div>
      )}
    </nav>
  )
}
