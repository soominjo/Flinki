import { useState } from 'react'
import { useDarkMode } from '../../hooks/useDarkMode'
import { EditProfileModal } from '../profile/EditProfileModal'
import type { ProfileData } from '../profile/EditProfileModal'
import { PrivacySecurityModal } from '../settings/PrivacySecurityModal'
import { NotificationsModal } from '../settings/NotificationsModal'

interface SettingsModalProps {
  onClose: () => void
  profileData: ProfileData
  onSaveProfile: (data: ProfileData) => void
}

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        className="sr-only peer"
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div
        className={[
          'w-11 h-6 rounded-full transition-colors',
          'peer-focus:outline-none',
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

// ---------------------------------------------------------------------------
// Menu row helper
// ---------------------------------------------------------------------------

interface MenuRowProps {
  icon: string
  label: string
  onClick?: () => void
  destructive?: boolean
  right?: React.ReactNode
}

function MenuRow({ icon, label, onClick, destructive, right }: MenuRowProps) {
  return (
    <button
      className={[
        'w-full flex items-center gap-4 px-6 py-4 transition-colors text-left',
        'hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700',
        destructive ? 'text-red-500' : 'text-slate-800 dark:text-slate-200',
      ].join(' ')}
      onClick={onClick}
    >
      <span
        className={[
          'material-symbols-outlined text-xl shrink-0',
          destructive ? 'text-red-500' : 'text-primary-brand',
        ].join(' ')}
      >
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {right}
    </button>
  )
}

// ---------------------------------------------------------------------------
// SettingsModal
// ---------------------------------------------------------------------------

export function SettingsModal({ onClose, profileData, onSaveProfile }: SettingsModalProps) {
  const [darkMode, setDarkMode] = useDarkMode()
  const [isEditProfileOpen, setEditProfileOpen] = useState(false)
  const [isPrivacyOpen, setPrivacyOpen] = useState(false)
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog */}
      <div className="fixed inset-x-0 bottom-0 z-modal flex justify-center pointer-events-none md:inset-0 md:items-center md:justify-center">
        <div className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl animate-slide-up pointer-events-auto md:relative md:rounded-2xl md:max-w-sm md:h-auto">
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Settings</h2>
            <button
              className="text-slate-400 text-sm font-semibold hover:text-slate-600 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <MenuRow icon="edit" label="Edit Profile" onClick={() => setEditProfileOpen(true)} />
            <MenuRow
              icon="notifications"
              label="Notifications"
              onClick={() => setNotificationsOpen(true)}
            />
            <MenuRow icon="lock" label="Privacy & Security" onClick={() => setPrivacyOpen(true)} />
            <MenuRow
              icon="dark_mode"
              label="Dark Mode"
              right={<Toggle checked={darkMode} onChange={setDarkMode} />}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800 mx-6" />

          {/* Destructive */}
          <div className="py-2">
            <MenuRow
              icon="logout"
              label="Log Out"
              destructive
              onClick={() => alert('Logging out...')}
            />
          </div>

          {/* Home indicator safe area — mobile only */}
          <div className="flex justify-center pb-3 md:hidden">
            <div className="w-32 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Edit Profile modal — stacks on top of Settings */}
      {isEditProfileOpen && (
        <EditProfileModal
          profileData={profileData}
          onSave={onSaveProfile}
          onClose={() => setEditProfileOpen(false)}
        />
      )}

      {/* Privacy & Security modal — stacks on top of Settings */}
      {isPrivacyOpen && <PrivacySecurityModal onClose={() => setPrivacyOpen(false)} />}

      {/* Notifications modal — stacks on top of Settings */}
      {isNotificationsOpen && <NotificationsModal onClose={() => setNotificationsOpen(false)} />}
    </>
  )
}
