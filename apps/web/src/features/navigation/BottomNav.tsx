const LEFT_NAV_ITEMS = [
  { tab: 'Achievements', label: 'Achievements', icon: 'emoji_events' },
  { tab: 'Activities', label: 'Activities', icon: 'bolt' },
] as const

const RIGHT_NAV_ITEMS = [
  { tab: 'Career & Quals', label: 'Career', icon: 'work' },
  { tab: 'Stats', label: 'Stats', icon: 'bar_chart' },
] as const

const ALL_NAV_ITEMS = [...LEFT_NAV_ITEMS, ...RIGHT_NAV_ITEMS] as const

export type NavTab = (typeof ALL_NAV_ITEMS)[number]['tab'] | 'Train'

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

interface NavButtonProps {
  tab: NavTab
  label: string
  icon: string
  isActive: boolean
  onClick: () => void
}

function NavButton({ tab, label, icon, isActive, onClick }: NavButtonProps) {
  return (
    <button
      key={tab}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      title={label}
      className={[
        'flex flex-col items-center justify-center gap-0.5 transition-colors',
        'py-3 px-2 flex-1 md:flex-none',
        'md:flex-row md:items-center md:gap-3',
        'md:w-full md:px-4 md:py-3 md:rounded-xl md:text-base md:justify-start',
        isActive
          ? 'text-primary-brand md:bg-primary-brand/10 font-bold'
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 md:hover:bg-slate-100 dark:md:hover:bg-slate-800 font-semibold',
      ].join(' ')}
    >
      <span
        className="material-symbols-outlined text-xl md:text-2xl"
        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span className="text-[10px] md:hidden">{label}</span>
      <span className="hidden md:inline text-sm font-semibold">{label}</span>
    </button>
  )
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
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
        'md:pt-8 md:gap-1 md:px-3',
      ].join(' ')}
    >
      {/* Wordmark — sidebar only */}
      <div className="hidden md:block mb-6 px-3">
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
          // Shared shell: flex slot on mobile, full-width row on desktop
          'flex-1 flex flex-col items-center justify-end pb-2 transition-all',
          'md:flex-none md:flex-row md:items-center md:gap-3 md:justify-start',
          'md:w-full md:px-4 md:py-3 md:rounded-xl md:pb-3',
          'md:bg-primary-brand md:hover:bg-primary-brand/90 md:text-white',
        ].join(' ')}
      >
        {/* Circle — mobile only; hidden on desktop via md:hidden */}
        <div className="h-12 w-12 -mt-8 rounded-full bg-primary-brand text-white shadow-lg flex items-center justify-center md:hidden">
          <span className="material-symbols-outlined text-xl">add</span>
        </div>

        {/* Mobile tiny label — sits below circle */}
        <span className="text-[10px] font-semibold text-primary-brand mt-1 md:hidden">Train</span>

        {/* Desktop icon + label */}
        <span className="material-symbols-outlined text-2xl hidden md:block">add_circle</span>
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
        />
      ))}
    </nav>
  )
}
