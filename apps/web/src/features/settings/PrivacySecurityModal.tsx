import { useState } from 'react'

interface PrivacySecurityModalProps {
  onClose: () => void
}

const inputClass =
  'w-full h-12 px-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ' +
  'focus:ring-2 focus:ring-primary-brand placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm'

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

export function PrivacySecurityModal({ onClose }: PrivacySecurityModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  function handleUpdatePassword() {
    if (!currentPassword || !newPassword) return
    alert('Password updated successfully!')
    setCurrentPassword('')
    setNewPassword('')
  }

  const canUpdate = currentPassword.length > 0 && newPassword.length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog */}
      <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center pointer-events-none md:inset-0 md:items-center md:justify-center">
        <div className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl animate-slide-up pointer-events-auto flex flex-col max-h-[92vh] md:relative md:rounded-2xl md:max-w-md md:max-h-[85vh]">
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 shrink-0 md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <button
              className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              onClick={onClose}
            >
              Back
            </button>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Privacy & Security</h2>
            <div className="w-10" /> {/* spacer for centering */}
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto pb-8">
            {/* ── Change Password ──────────────────────────────────── */}
            <div className="px-6 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary-brand">lock</span>
                <h3 className="text-slate-900 dark:text-white font-bold text-base">
                  Change Password
                </h3>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    className={`${inputClass} pl-10`}
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 pointer-events-none text-xl">
                    key
                  </span>
                </div>

                <div className="relative">
                  <input
                    className={`${inputClass} pl-10`}
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 pointer-events-none text-xl">
                    lock_reset
                  </span>
                </div>

                <button
                  className={[
                    'w-full h-12 rounded-xl font-bold text-sm transition-all active:scale-[0.98]',
                    canUpdate
                      ? 'bg-primary-brand text-white shadow-md shadow-primary-brand/30 hover:bg-primary-brand/90'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-300 cursor-not-allowed',
                  ].join(' ')}
                  onClick={handleUpdatePassword}
                  disabled={!canUpdate}
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800 mx-6 my-6" />

            {/* ── Security ─────────────────────────────────────────── */}
            <div className="px-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary-brand">security</span>
                <h3 className="text-slate-900 dark:text-white font-bold text-base">Security</h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold text-sm">
                      Two-Factor Authentication
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      {twoFAEnabled
                        ? 'Your account has an extra layer of protection.'
                        : 'Add an extra layer of security to your account.'}
                    </p>
                  </div>
                  <Toggle checked={twoFAEnabled} onChange={setTwoFAEnabled} />
                </div>

                {twoFAEnabled && (
                  <div className="mt-3 flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                    <span
                      className="material-symbols-outlined text-emerald-500 text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <p className="text-emerald-700 text-xs font-semibold">2FA is active</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Home indicator — mobile only */}
          <div className="flex justify-center pb-3 shrink-0 md:hidden">
            <div className="w-32 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </>
  )
}
