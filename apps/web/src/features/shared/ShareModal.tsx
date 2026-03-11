// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react'

export interface ShareModalProps {
  open: boolean
  onClose: () => void
  initialView?: 'options' | 'qr'
  /** User data for the Mini Profile Card Preview */
  name: string
  avatarUrl?: string
  /** First line below name, e.g. "Marathoner • 12 Achievements" */
  tagline: string
  /** Second line, e.g. "Training for Berlin 2025" */
  trainingFor?: string
  onDownloadPDF?: () => void
  onShowQRCode?: () => void
  onCopyLink?: () => void
  onShareWhatsApp?: () => void
  onShareInstagram?: () => void
  onShareStrava?: () => void
}

// ---------------------------------------------------------------------------
// ShareModal
// ---------------------------------------------------------------------------

export function ShareModal({
  open,
  onClose,
  initialView,
  name,
  avatarUrl,
  tagline,
  trainingFor,
  onShowQRCode,
  onShareWhatsApp,
  onShareInstagram,
  onShareStrava,
}: ShareModalProps) {
  const [modalView, setModalView] = useState<'options' | 'qr'>('options')
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    if (!open) return
    setModalView(initialView ?? 'options')
  }, [initialView, open])

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

      onClose()
      setIsExporting(false)
      alert('PDF Snapshot downloaded!')
    }, 1500)
  }

  if (!open) return null

  return (
    <>
      {/* Dimming Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet (mobile) → Centered Dialog (desktop) */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none md:inset-0 md:items-center md:justify-center">
        <div className="w-full max-w-[400px] flex flex-col bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl animate-slide-up pointer-events-auto md:relative md:rounded-2xl md:max-w-md md:h-auto md:max-h-[85vh] md:overflow-y-auto">
          {/* Drag Handle — hidden on desktop */}
          <div className="flex justify-center p-3 md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Modal Header */}
          <div className="px-6 pt-2 pb-4">
            <h4 className="text-slate-900 dark:text-white text-lg font-bold text-center">
              Share your FLINK Profile
            </h4>
          </div>

          {/* Mini Profile Card Preview */}
          <div className="px-6 mb-6">
            <div className="bg-gradient-to-r from-primary-brand to-blue-600 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full border-2 border-white/50 overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img className="w-full h-full object-cover" src={avatarUrl} alt={name} />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {name
                      .split(' ')
                      .map(w => w[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Name + tagline */}
              <div className="overflow-hidden">
                <p className="font-bold text-base truncate">{name}</p>
                <p className="text-xs text-white/90 leading-tight">
                  {tagline}
                  {trainingFor && (
                    <>
                      <br />
                      {trainingFor}
                    </>
                  )}
                </p>
              </div>

              {/* QR Code hint icon */}
              <div className="ml-auto">
                <span className="material-symbols-outlined text-white/40">qr_code_2</span>
              </div>
            </div>
          </div>

          {/* Action List */}
          {modalView === 'options' ? (
            <div className="px-6 space-y-3 pb-8">
              {/* Primary Action — Download PDF Snapshot */}
              <button
                className="w-full flex items-center justify-center gap-2 bg-primary-brand text-white font-bold py-4 rounded-xl shadow-md active:scale-[0.98] transition-transform"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">download</span>
                    <span>Download PDF Snapshot</span>
                  </>
                )}
              </button>

              {/* Show QR Code */}
              <button
                className="w-full flex items-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-4 rounded-xl active:bg-slate-200 dark:active:bg-slate-700 transition-colors"
                onClick={() => {
                  setModalView('qr')
                  onShowQRCode?.()
                }}
              >
                <span className="material-symbols-outlined text-primary-brand">qr_code</span>
                <span className="text-sm">Show QR Code</span>
              </button>

              {/* Copy Profile Link */}
              <button
                className="w-full flex items-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-4 rounded-xl active:bg-slate-200 dark:active:bg-slate-700 transition-colors"
                onClick={() => {
                  alert('Link copied to clipboard!')
                  onClose()
                }}
              >
                <span className="material-symbols-outlined text-primary-brand">link</span>
                <span className="text-sm">Copy Profile Link</span>
              </button>

              {/* Share via Social */}
              <div className="w-full flex items-center justify-between bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-brand">share</span>
                  <span className="text-sm">Share via Social</span>
                </div>
                <div className="flex gap-3">
                  <button
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                    onClick={onShareWhatsApp}
                    aria-label="Share on WhatsApp"
                  >
                    <span className="material-symbols-outlined text-green-500 text-lg">chat</span>
                  </button>
                  <button
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                    onClick={onShareInstagram}
                    aria-label="Share on Instagram"
                  >
                    <span className="material-symbols-outlined text-pink-500 text-lg">
                      photo_camera
                    </span>
                  </button>
                  <button
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                    onClick={onShareStrava}
                    aria-label="Share on Strava"
                  >
                    <span className="material-symbols-outlined text-orange-600 text-lg">
                      directions_run
                    </span>
                  </button>
                </div>
              </div>

              {/* Cancel */}
              <button
                className="w-full pt-4 text-slate-400 font-semibold text-sm hover:text-slate-600 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="px-6 pb-8">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://flink.app/profile/alexcarter"
                alt="QR code to connect"
                className="mx-auto rounded-xl shadow-sm mb-4"
              />

              <div className="text-center">
                <div className="text-slate-900 dark:text-white font-bold text-base">
                  Scan to Connect
                </div>
                <div className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
                  Show this code to another athlete to instantly connect.
                </div>
              </div>

              <button
                className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-3 rounded-xl active:bg-slate-200 dark:active:bg-slate-700 transition-colors"
                onClick={() => setModalView('options')}
              >
                <span className="text-sm">← Back to Options</span>
              </button>
            </div>
          )}

          {/* Home Indicator (Safe Area) — hidden on desktop */}
          <div className="flex justify-center pb-2 md:hidden">
            <div className="w-32 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </>
  )
}
