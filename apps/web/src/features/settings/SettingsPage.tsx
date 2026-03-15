// =============================================================================
// SettingsPage — master-detail settings layout.
//
// Mobile:  full-screen overlay; category list → tap into detail (iOS-style).
// Desktop: two-column split — 256px left sidebar + scrollable right content.
// =============================================================================

import { useState } from 'react'
import { useDarkMode } from '../../hooks/useDarkMode'
import { EditProfileModal } from '../profile/EditProfileModal'
import type { ProfileData } from '../profile/EditProfileModal'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingsSection = 'account' | 'privacy' | 'preferences' | 'notifications'

// ---------------------------------------------------------------------------
// Sidebar nav categories
// ---------------------------------------------------------------------------

const SECTIONS: { id: SettingsSection; label: string; icon: string; description: string }[] = [
  {
    id: 'account',
    label: 'Account',
    icon: 'manage_accounts',
    description: 'Profile, password, data',
  },
  {
    id: 'privacy',
    label: 'Privacy & Safety',
    icon: 'shield',
    description: 'Visibility, location, safety',
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: 'tune',
    description: 'Theme, units, language',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'notifications',
    description: 'Alerts, hype squad, quiet hours',
  },
]

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  id?: string
}) {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        id={id}
        className="sr-only peer"
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div
        className={[
          'w-11 h-6 rounded-full transition-colors peer-focus:outline-none',
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
          'after:bg-white after:border after:border-gray-300 dark:after:border-slate-500 after:rounded-full',
          'after:h-5 after:w-5 after:transition-all',
          'peer-checked:after:translate-x-full peer-checked:after:border-white',
          'peer-checked:bg-primary-brand bg-slate-200 dark:bg-slate-700',
        ].join(' ')}
      />
    </label>
  )
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id?: string
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
          {description}
        </p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  )
}

function SectionCard({
  icon,
  iconColor = 'text-primary-brand',
  title,
  children,
}: {
  icon: string
  iconColor?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`material-symbols-outlined text-xl ${iconColor}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
      </div>
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 px-4 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ── Section: Account ────────────────────────────────────────────────────────
// ---------------------------------------------------------------------------

function AccountSection({
  profileData,
  onOpenEditProfile,
}: {
  profileData: ProfileData
  onOpenEditProfile: () => void
}) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [twoFA, setTwoFA] = useState(false)
  const [exporting, setExporting] = useState(false)

  const canUpdatePw = currentPw.length > 0 && newPw.length > 0

  function handleExport() {
    setExporting(true)
    setTimeout(() => {
      const blob = new Blob(['{"user":"Alex Rivera","data":"..."}'], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'flinki-data-export.json'
      a.click()
      URL.revokeObjectURL(url)
      setExporting(false)
    }, 1200)
  }

  const inputCls =
    'w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none ' +
    'text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 ' +
    'focus:ring-2 focus:ring-primary-brand outline-none'

  return (
    <div className="px-6 py-6 space-y-0">
      {/* Profile card */}
      <SectionCard icon="person" title="Profile">
        <div className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-700/60">
          <div
            className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=85&w=200&h=200')",
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm">{profileData.name}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 truncate">
              {profileData.bio}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenEditProfile}
          className="w-full flex items-center justify-between py-3.5 text-left group"
        >
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Edit Profile</span>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-brand text-xl transition-colors">
            chevron_right
          </span>
        </button>
      </SectionCard>

      {/* Change password */}
      <SectionCard icon="lock" title="Change Password">
        <div className="py-4 space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            className={inputCls}
          />
          <button
            onClick={() => {
              if (canUpdatePw) {
                alert('Password updated!')
                setCurrentPw('')
                setNewPw('')
              }
            }}
            disabled={!canUpdatePw}
            className={[
              'w-full h-11 rounded-xl font-bold text-sm transition-all active:scale-[0.98]',
              canUpdatePw
                ? 'bg-primary-brand text-white hover:bg-primary-brand/90 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed',
            ].join(' ')}
          >
            Update Password
          </button>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard icon="security" title="Security">
        <ToggleRow
          id="2fa"
          label="Two-Factor Authentication"
          description="Add an extra layer of security to your account."
          checked={twoFA}
          onChange={setTwoFA}
        />
        {twoFA && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2.5 mb-3.5">
            <span
              className="material-symbols-outlined text-emerald-500 text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              2FA is active — your account is protected
            </p>
          </div>
        )}
      </SectionCard>

      {/* ── Danger Zone ── */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="material-symbols-outlined text-xl text-red-500"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <h3 className="font-bold text-red-500 text-base">Danger Zone</h3>
        </div>

        <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 px-5 py-4 space-y-3">
          {/* Export */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Export My Data</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                Download a full copy of your achievements, activities, and profile data.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="shrink-0 flex items-center gap-1.5 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-xl hover:border-primary-brand hover:text-primary-brand transition-colors active:scale-[0.97]"
            >
              {exporting ? (
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-base">download</span>
              )}
              {exporting ? 'Exporting…' : 'Export'}
            </button>
          </div>

          <div className="border-t border-red-200 dark:border-red-900/40" />

          {/* Delete */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Delete Account</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                Permanently remove your profile and all data. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => {
                if (
                  window.confirm('Are you sure? This action is permanent and cannot be undone.')
                ) {
                  alert('Account deletion initiated.')
                }
              }}
              className="shrink-0 text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-2 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ── Section: Privacy & Safety ───────────────────────────────────────────────
// ---------------------------------------------------------------------------

type Visibility = 'public' | 'squad' | 'only-me'

function PrivacySection() {
  const [visibility, setVisibility] = useState<Visibility>('public')
  const [profileSearch, setProfileSearch] = useState(true)
  const [mapPrivacy, setMapPrivacy] = useState(true)

  const visibilityOptions: {
    value: Visibility
    label: string
    description: string
    icon: string
  }[] = [
    {
      value: 'public',
      label: 'Public',
      description: 'Everyone on Flinki can see your activities',
      icon: 'public',
    },
    {
      value: 'squad',
      label: 'Training Squad Only',
      description: 'Only athletes you follow and follow back',
      icon: 'group',
    },
    {
      value: 'only-me',
      label: 'Only Me',
      description: 'Activities are private to you',
      icon: 'lock',
    },
  ]

  return (
    <div className="px-6 py-6">
      {/* Activity visibility */}
      <SectionCard
        icon="visibility"
        iconColor="text-violet-500"
        title="Default Activity Visibility"
      >
        <div className="py-2 space-y-1">
          {visibilityOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setVisibility(opt.value)}
              className={[
                'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors',
                visibility === opt.value
                  ? 'bg-primary-brand/8 dark:bg-primary-brand/15'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/40',
              ].join(' ')}
            >
              {/* Radio dot */}
              <div
                className={[
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                  visibility === opt.value
                    ? 'border-primary-brand'
                    : 'border-slate-300 dark:border-slate-600',
                ].join(' ')}
              >
                {visibility === opt.value && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary-brand" />
                )}
              </div>
              {/* Icon */}
              <span
                className={[
                  'material-symbols-outlined text-[18px] shrink-0',
                  visibility === opt.value
                    ? 'text-primary-brand'
                    : 'text-slate-400 dark:text-slate-500',
                ].join(' ')}
              >
                {opt.icon}
              </span>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={[
                    'text-sm font-semibold leading-tight',
                    visibility === opt.value
                      ? 'text-primary-brand'
                      : 'text-slate-900 dark:text-white',
                  ].join(' ')}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                  {opt.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Profile + map privacy toggles */}
      <SectionCard icon="person_search" iconColor="text-sky-500" title="Profile Visibility">
        <ToggleRow
          id="profile-search"
          label="Allow search discovery"
          description="Let other athletes find your profile by name or username in search."
          checked={profileSearch}
          onChange={setProfileSearch}
        />
      </SectionCard>

      <SectionCard icon="map" iconColor="text-emerald-500" title="Map Privacy">
        <ToggleRow
          id="map-privacy"
          label="Hide activity start & end points"
          description="Obscures the exact start and end location of your mapped routes — a standard safety feature."
          checked={mapPrivacy}
          onChange={setMapPrivacy}
        />
        {mapPrivacy && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2.5 mb-3.5">
            <span
              className="material-symbols-outlined text-emerald-500 text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield
            </span>
            <p className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              Your home location is hidden from all routes
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ── Section: Preferences ────────────────────────────────────────────────────
// ---------------------------------------------------------------------------

type ThemeMode = 'light' | 'dark' | 'system'
type Units = 'metric' | 'imperial'

function PreferencesSection() {
  const [, setDarkMode] = useDarkMode()
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')
  const [units, setUnits] = useState<Units>('metric')

  function handleThemeChange(mode: ThemeMode) {
    setThemeMode(mode)
    if (mode === 'light') setDarkMode(false)
    if (mode === 'dark') setDarkMode(true)
    if (mode === 'system') setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'System Default', icon: 'contrast' },
  ]

  return (
    <div className="px-6 py-6">
      {/* Appearance */}
      <SectionCard icon="palette" iconColor="text-violet-500" title="Appearance">
        <div className="py-4">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Theme
          </p>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleThemeChange(opt.value)}
                className={[
                  'flex flex-col items-center gap-2 py-3.5 rounded-2xl border-2 transition-all active:scale-[0.97]',
                  themeMode === opt.value
                    ? 'border-primary-brand bg-primary-brand/8 dark:bg-primary-brand/15 text-primary-brand'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600',
                ].join(' ')}
              >
                <span
                  className="material-symbols-outlined text-2xl leading-none"
                  style={
                    themeMode === opt.value ? { fontVariationSettings: "'FILL' 1" } : undefined
                  }
                >
                  {opt.icon}
                </span>
                <span className="text-[11px] font-bold leading-tight text-center">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Units */}
      <SectionCard icon="straighten" iconColor="text-sky-500" title="Units">
        <div className="py-4">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Measurement System
          </p>
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
            {(['metric', 'imperial'] as const).map(u => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={[
                  'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all',
                  units === u
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300',
                ].join(' ')}
              >
                {u === 'metric' ? 'Metric (km, kg)' : 'Imperial (mi, lb)'}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-center">
            Changes all distances, speeds, and weights across the app
          </p>
        </div>
      </SectionCard>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ── Section: Notifications ──────────────────────────────────────────────────
// (absorbs content from the old NotificationsModal)
// ---------------------------------------------------------------------------

function NotificationsSection() {
  const [prAlerts, setPrAlerts] = useState(true)
  const [gearWarnings, setGear] = useState(true)
  const [kudosAlerts, setKudos] = useState(true)
  const [newFollowers, setFollowers] = useState(true)
  const [syncSchedule, setSync] = useState(false)
  const [dndStart, setDndStart] = useState('22:00')
  const [dndEnd, setDndEnd] = useState('06:00')

  return (
    <div className="px-6 py-6">
      {/* Hype Squad */}
      <SectionCard icon="local_fire_department" iconColor="text-orange-500" title="Hype Squad">
        <ToggleRow
          id="pr-alerts"
          label="PR & Milestone Alerts"
          description="Get notified when your training circle hits a Personal Best."
          checked={prAlerts}
          onChange={setPrAlerts}
        />
        <ToggleRow
          id="kudos-alerts"
          label="Kudos & Reactions"
          description="Notify me when someone gives kudos on my activities."
          checked={kudosAlerts}
          onChange={setKudos}
        />
        <ToggleRow
          id="new-followers"
          label="New Followers"
          description="Notify me when someone follows my profile."
          checked={newFollowers}
          onChange={setFollowers}
        />
      </SectionCard>

      {/* Gear Locker */}
      <SectionCard icon="backpack" iconColor="text-amber-500" title="Gear Locker">
        <ToggleRow
          id="gear-warnings"
          label="Gear Lifespan Warnings"
          description="Alert me when my running shoes pass 500 km so I never train on dead rubber."
          checked={gearWarnings}
          onChange={setGear}
        />
      </SectionCard>

      {/* Recovery Mode / Quiet Hours */}
      <SectionCard icon="bedtime" iconColor="text-indigo-500" title="Recovery Mode">
        <ToggleRow
          id="sync-schedule"
          label="Sync with Training Schedule"
          description="Silence all alerts on your recovery and rest days automatically."
          checked={syncSchedule}
          onChange={setSync}
        />

        <div
          className={[
            'transition-opacity duration-200 pb-4',
            syncSchedule ? 'opacity-100' : 'opacity-40 pointer-events-none',
          ].join(' ')}
        >
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700/60 mt-1">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="material-symbols-outlined text-primary-brand text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                do_not_disturb_on
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                Do Not Disturb
              </p>
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  From
                </p>
                <input
                  type="time"
                  value={dndStart}
                  onChange={e => setDndStart(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary-brand outline-none"
                />
              </div>
              <div className="pb-3 text-slate-300 font-bold text-lg">→</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Until
                </p>
                <input
                  type="time"
                  value={dndEnd}
                  onChange={e => setDndEnd(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary-brand outline-none"
                />
              </div>
            </div>
            <p className="text-slate-400 text-[10px] mt-3 text-center">
              No notifications between{' '}
              <span className="font-bold text-slate-500 dark:text-slate-400">
                {dndStart} – {dndEnd}
              </span>
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ── Props ────────────────────────────────────────────────────────────────────
// ---------------------------------------------------------------------------

interface SettingsPageProps {
  onClose: () => void
  profileData: ProfileData
  onSaveProfile: (data: ProfileData) => void
}

// ---------------------------------------------------------------------------
// ── Root component ───────────────────────────────────────────────────────────
// ---------------------------------------------------------------------------

export function SettingsPage({ onClose, profileData, onSaveProfile }: SettingsPageProps) {
  // Desktop: which category is highlighted in the sidebar
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')
  // Mobile: null = show the category list; string = drilled into a category
  const [mobileSection, setMobileSection] = useState<SettingsSection | null>(null)

  const [isEditProfileOpen, setEditProfileOpen] = useState(false)

  // The section whose content to render in the right panel
  const displaySection = mobileSection ?? activeSection

  function renderContent(section: SettingsSection) {
    switch (section) {
      case 'account':
        return (
          <AccountSection
            profileData={profileData}
            onOpenEditProfile={() => setEditProfileOpen(true)}
          />
        )
      case 'privacy':
        return <PrivacySection />
      case 'preferences':
        return <PreferencesSection />
      case 'notifications':
        return <NotificationsSection />
    }
  }

  const activeMeta = SECTIONS.find(s => s.id === displaySection)!

  return (
    <>
      {/* Full-screen overlay — slides up on mobile, fades in on desktop */}
      <div className="fixed inset-0 z-modal bg-background-light dark:bg-slate-900 flex flex-col animate-slide-up md:animate-none md:opacity-100">
        {/* ── Top bar ─────────────────────────────────────────────── */}
        <header className="flex-none flex items-center gap-3 px-4 md:px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          {/* Back/close (mobile) */}
          <button
            onClick={mobileSection ? () => setMobileSection(null) : onClose}
            aria-label={mobileSection ? 'Back to settings' : 'Close settings'}
            className="rounded-full p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors -ml-1.5"
          >
            <span className="material-symbols-outlined block text-xl leading-none">
              {mobileSection ? 'arrow_back' : 'close'}
            </span>
          </button>

          {/* Title */}
          <h1 className="font-bold text-[17px] text-slate-900 dark:text-white tracking-tight flex-1">
            {mobileSection ? activeMeta.label : 'Settings'}
          </h1>

          {/* Close on desktop (always shows ×) */}
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="hidden md:flex rounded-full p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined block text-xl leading-none">close</span>
          </button>
        </header>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Left sidebar: category list ─────────────────────── */}
          {/*
            Mobile:  full-width list, hidden when a section is drilled into
            Desktop: 256px fixed sidebar, always visible
          */}
          <nav
            aria-label="Settings categories"
            className={[
              'flex-col overflow-y-auto',
              'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
              // Mobile: full-width, hidden when mobileSection is set
              'w-full md:w-64 md:flex-none md:flex',
              mobileSection ? 'hidden' : 'flex',
            ].join(' ')}
          >
            <div className="hidden md:block px-4 pt-5 pb-3">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                Settings
              </p>
            </div>

            <ul className="px-3 pb-4 space-y-0.5">
              {SECTIONS.map(s => {
                const isActive = activeSection === s.id
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        setActiveSection(s.id)
                        setMobileSection(s.id)
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150',
                        isActive
                          ? 'bg-primary-brand/10 dark:bg-primary-brand/15 text-primary-brand'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                      ].join(' ')}
                    >
                      <span
                        className="material-symbols-outlined text-xl shrink-0"
                        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {s.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={[
                            'text-sm font-semibold leading-tight',
                            isActive ? 'text-primary-brand' : '',
                          ].join(' ')}
                        >
                          {s.label}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate hidden md:block">
                          {s.description}
                        </p>
                      </div>
                      {/* Mobile chevron */}
                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg md:hidden">
                        chevron_right
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Log out — bottom of sidebar */}
            <div className="mt-auto px-3 pb-6 border-t border-slate-100 dark:border-slate-800 pt-3">
              <button
                onClick={() => alert('Logging out…')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-xl shrink-0">logout</span>
                <span className="text-sm font-semibold">Log Out</span>
              </button>
            </div>
          </nav>

          {/* ── Right panel: section content ────────────────────── */}
          {/*
            Mobile:  only visible when a section is drilled into
            Desktop: always visible, flex-1
          */}
          <div
            className={[
              'flex-1 overflow-y-auto bg-background-light dark:bg-slate-950',
              mobileSection ? 'block' : 'hidden md:block',
            ].join(' ')}
          >
            <div className="max-w-[680px] mx-auto">
              {/* Section header (desktop only — mobile uses top bar) */}
              <div className="hidden md:flex items-center gap-3 px-6 pt-7 pb-2">
                <span
                  className="material-symbols-outlined text-primary-brand text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {activeMeta.icon}
                </span>
                <div>
                  <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                    {activeMeta.label}
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {activeMeta.description}
                  </p>
                </div>
              </div>

              {renderContent(displaySection)}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile modal — floats above SettingsPage */}
      {isEditProfileOpen && (
        <EditProfileModal
          profileData={profileData}
          onSave={data => {
            onSaveProfile(data)
            setEditProfileOpen(false)
          }}
          onClose={() => setEditProfileOpen(false)}
        />
      )}
    </>
  )
}
