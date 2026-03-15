import { useState } from 'react'
import { mockUser } from '../../lib/mockData'
import { showToast } from '../shared/Toaster'

export interface ProfileData {
  name: string
  bio: string
  location: string
}

interface EditProfileModalProps {
  profileData: ProfileData
  onSave: (data: ProfileData) => void
  onClose: () => void
}

const inputClass =
  'w-full h-12 px-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ' +
  'focus:ring-2 focus:ring-primary-brand placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm'

export function EditProfileModal({ profileData, onSave, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(profileData.name)
  const [bio, setBio] = useState(profileData.bio)
  const [location, setLocation] = useState(profileData.location)
  const [isSaving, setIsSaving] = useState(false)

  function handleSave() {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setTimeout(() => {
      onSave({ name: name.trim() || profileData.name, bio, location })
      showToast('Profile updated!')
      onClose()
    }, 1000)
  }

  const canSave = name.trim().length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-modal"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog */}
      <div className="fixed inset-x-0 bottom-0 z-modal-elevated flex justify-center pointer-events-none md:inset-0 md:items-center md:justify-center">
        <div className="w-full max-w-[400px] bg-white dark:bg-slate-950 rounded-t-[2.5rem] shadow-2xl animate-slide-up pointer-events-auto flex flex-col max-h-[92vh] md:relative md:rounded-2xl md:max-w-md md:max-h-[85vh]">
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
              Cancel
            </button>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Edit Profile</h2>
            <button
              className={[
                'text-sm font-bold transition-colors flex items-center gap-1',
                canSave && !isSaving ? 'text-primary-brand' : 'text-slate-300 cursor-not-allowed',
              ].join(' ')}
              onClick={handleSave}
              disabled={!canSave || isSaving}
            >
              {isSaving ? (
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            {/* ── Photo Uploads ─────────────────────────────────────── */}
            <div className="relative mb-6">
              {/* Cover photo */}
              <label className="block cursor-pointer">
                <input type="file" accept="image/*" className="sr-only" />
                <div
                  className="h-28 w-full bg-cover bg-center flex items-center justify-center group hover:brightness-90 transition-all"
                  style={{ backgroundImage: `url('${mockUser.coverUrl}')` }}
                >
                  <div className="size-10 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                    <span className="material-symbols-outlined text-white text-xl">
                      photo_camera
                    </span>
                  </div>
                </div>
                <span className="sr-only">Upload cover photo</span>
              </label>

              {/* Avatar — overlaps cover */}
              <div className="absolute -bottom-8 left-6">
                <label className="block cursor-pointer relative">
                  <input type="file" accept="image/*" className="sr-only" />
                  <div
                    className="h-20 w-20 rounded-full border-4 border-white dark:border-slate-950 bg-cover bg-center flex items-center justify-center group hover:brightness-90 transition-all overflow-hidden"
                    style={{ backgroundImage: `url('${mockUser.avatarUrl}')` }}
                  >
                    <div className="size-8 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                      <span className="material-symbols-outlined text-white text-base">
                        photo_camera
                      </span>
                    </div>
                  </div>
                  <span className="sr-only">Upload avatar</span>
                </label>
              </div>
            </div>

            {/* ── Form Fields ──────────────────────────────────────── */}
            <div className="px-6 pt-10 pb-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  Name
                </label>
                <input
                  className={inputClass}
                  placeholder="Your name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  Location
                </label>
                <div className="relative">
                  <input
                    className={`${inputClass} pl-10`}
                    placeholder="City, Country"
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 pointer-events-none">
                    location_on
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  Bio
                </label>
                <textarea
                  className="w-full p-4 rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-brand placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none outline-none text-sm"
                  placeholder="Tell your story..."
                  rows={4}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sticky save button */}
          <div className="shrink-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent">
            <button
              className="w-full h-14 bg-primary-brand hover:bg-primary-brand/90 text-white font-bold rounded-xl shadow-lg shadow-primary-brand/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
              onClick={handleSave}
              disabled={!canSave || isSaving}
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
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
