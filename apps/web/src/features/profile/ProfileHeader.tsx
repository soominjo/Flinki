import { useState } from 'react'
import type { UserProfile } from '../../lib/mockData'
import { SettingsPage } from '../settings/SettingsPage'
import { ImagePreviewModal } from '../shared/ImagePreviewModal'
import type { ProfileData } from './EditProfileModal'

interface ProfileHeaderProps {
  user: UserProfile
  onBack?: () => void
  onMessage?: () => void
  onShareBio?: () => void
  onExportPDF?: () => void
  onQRCode?: () => void
}

export function ProfileHeader({
  user,
  onBack,
  onMessage,
  onShareBio,
  onExportPDF,
  onQRCode,
}: ProfileHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user.name,
    bio: user.headline,
    location: user.location,
  })

  function handleExportPDF() {
    setIsExporting(true)

    setTimeout(() => {
      const blob = new Blob(['Mock PDF Content for FLINK Prototype'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Alex_Carter_FLINK_Snapshot.pdf'
      a.click()
      URL.revokeObjectURL(url)

      setIsExporting(false)
      alert('PDF Snapshot downloaded!')
      onExportPDF?.()
    }, 1500)
  }

  return (
    <>
      {/* Header Section */}
      <header className="relative">
        {/* Cover Photo */}
        <div
          className="h-56 md:h-64 w-full bg-slate-200 bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity"
          style={user.coverUrl ? { backgroundImage: `url('${user.coverUrl}')` } : undefined}
          onClick={() => setPreviewImage(user.coverUrl ?? null)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if ((e.key === 'Enter' || e.key === ' ') && user.coverUrl) {
              e.preventDefault()
              setPreviewImage(user.coverUrl)
            }
          }}
          aria-label="View cover photo"
        />

        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/40 to-transparent">
          <button
            className="bg-white/20 backdrop-blur-md text-white rounded-full p-2"
            onClick={onBack}
            aria-label="Go back"
          >
            <span className="material-symbols-outlined block">arrow_back</span>
          </button>
          <div className="flex gap-2">
            <button
              className="bg-white/20 backdrop-blur-md text-white rounded-full p-2"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Settings"
            >
              <span className="material-symbols-outlined block">settings</span>
            </button>
          </div>
        </div>

        {/* Profile Info Overlap */}
        <div className="px-6 -mt-16 relative">
          <div className="relative inline-block">
            <div
              className="h-32 w-32 rounded-full border-4 border-white bg-slate-300 bg-cover bg-center shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={user.avatarUrl ? { backgroundImage: `url('${user.avatarUrl}')` } : undefined}
              role="button"
              tabIndex={0}
              aria-label={`View ${profileData.name}'s profile photo`}
              onClick={() => setPreviewImage(user.avatarUrl ?? null)}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && user.avatarUrl) {
                  e.preventDefault()
                  setPreviewImage(user.avatarUrl)
                }
              }}
            />
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 h-6 w-6 bg-accent-green border-2 border-white rounded-full" />
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {profileData.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              {user.tags.join(' • ')}
            </p>
            <button className="text-primary-brand font-semibold text-sm mt-1 hover:underline">
              {profileData.location} • {user.connections} Connections
            </button>
          </div>
        </div>
      </header>

      {/* Bio & Actions */}
      <section className="px-6 mt-4">
        <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
          {profileData.bio}
        </p>

        {/* Horizontal Action Buttons */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 md:flex-wrap">
          <button
            className="flex-none bg-primary-brand text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
            onClick={onMessage}
          >
            <span className="material-symbols-outlined text-sm">send</span>
            Message
          </button>
          <button
            className="flex-none border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
            onClick={onShareBio}
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share Bio
          </button>
          <button
            className="flex-none border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Export Snapshot PDF
              </>
            )}
          </button>
          <button
            className="flex-none border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl"
            onClick={onQRCode}
            aria-label="Show QR code"
          >
            <span className="material-symbols-outlined block">qr_code_2</span>
          </button>
        </div>
      </section>

      {/* Settings modal */}
      {isSettingsOpen && (
        <SettingsPage
          onClose={() => setIsSettingsOpen(false)}
          profileData={profileData}
          onSaveProfile={setProfileData}
        />
      )}

      <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
    </>
  )
}
