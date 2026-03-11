import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ShareModalView = 'options' | 'qr' | 'embed' | 'highlight'

export interface ShareModalProps {
  open: boolean
  onClose: () => void
  initialView?: ShareModalView
  /** User data for the Mini Profile Card Preview */
  name: string
  avatarUrl?: string
  /** First line below name, e.g. "Marathoner • 12 Achievements" */
  tagline: string
  /** Second line, e.g. "Training for Berlin 2025" */
  trainingFor?: string
  /** Top achievement for the Highlight Card */
  topAchievement?: {
    title: string
    /** Key result metric, e.g. "2:58:32" */
    result: string
    imageUrl?: string
    icon?: string
  }
  onShowQRCode?: () => void
  onShareWhatsApp?: () => void
  onShareInstagram?: () => void
  onShareStrava?: () => void
}

// ---------------------------------------------------------------------------
// Sub-view: QR Code
// ---------------------------------------------------------------------------

function QRView({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-6 pb-8">
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
      </div>

      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://flink.app/profile/alexcarter"
        alt="QR code to connect"
        className="mx-auto rounded-2xl shadow-md mb-5 border border-slate-100 dark:border-slate-700"
      />

      <div className="text-center mb-6">
        <p className="text-slate-900 dark:text-white font-bold text-base">Scan to Connect</p>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
          Show this code to another athlete to instantly connect on Flinki.
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="text-sm">Back to Options</span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-view: Embed Code Generator
// ---------------------------------------------------------------------------

function EmbedView({ name, onBack }: { name: string; onBack: () => void }) {
  const [copied, setCopied] = useState(false)

  // Sanitise name for use in the URL slug (lowercase, hyphens)
  const slug = name.toLowerCase().replace(/\s+/g, '')

  const embedCode = `<iframe
  src="https://flink.app/embed/${slug}"
  width="400"
  height="280"
  style="border:none;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.12)"
  title="${name} · Flinki Verified Profile"
  loading="lazy"
></iframe>`

  function handleCopy() {
    navigator.clipboard.writeText(embedCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-6 pb-8">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-sm font-semibold mb-5"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back
      </button>

      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
        Paste this snippet into your portfolio, LinkedIn "About" section, or personal site to
        display your verified Flinki profile as a live widget.
      </p>

      {/* Code block */}
      <div className="relative rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden mb-4">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-[16px]">code</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              HTML Embed
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={[
              'flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-bold transition-all duration-200',
              copied
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-white/10 text-slate-300 hover:bg-white/20',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[13px]">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Code content */}
        <pre className="px-4 py-4 text-[11px] leading-relaxed text-slate-300 overflow-x-auto font-mono whitespace-pre">
          {embedCode}
        </pre>
      </div>

      {/* Mock embed preview */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 mb-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Preview
        </p>
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-brand to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {name
                .split(' ')
                .map(w => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[11px] text-primary-brand">
                  verified
                </span>
                <span className="text-[10px] text-primary-brand font-bold">Verified on Flinki</span>
              </div>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] font-black bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-2 py-1 rounded-lg">
                L6
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {['Marathon', 'Ultra Trail', 'Climbing'].map(tag => (
              <span
                key={tag}
                className="text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Copy CTA */}
      <button
        type="button"
        onClick={handleCopy}
        className={[
          'w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all duration-200',
          copied
            ? 'bg-emerald-500 text-white'
            : 'bg-primary-brand text-white hover:bg-primary-brand/90 active:scale-[0.98]',
        ].join(' ')}
      >
        <span className="material-symbols-outlined text-[18px]">
          {copied ? 'check_circle' : 'content_copy'}
        </span>
        {copied ? 'Code Copied!' : 'Copy Embed Code'}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-view: Profile Highlight Card
// ---------------------------------------------------------------------------

interface HighlightViewProps {
  name: string
  avatarUrl?: string
  tagline: string
  topAchievement?: ShareModalProps['topAchievement']
  onBack: () => void
  onShareWhatsApp?: () => void
  onShareInstagram?: () => void
  onShareStrava?: () => void
}

function HighlightView({
  name,
  avatarUrl,
  topAchievement,
  onBack,
  onShareWhatsApp,
  onShareInstagram,
  onShareStrava,
}: HighlightViewProps) {
  const [copied, setCopied] = useState(false)

  const ach = topAchievement ?? {
    title: 'London Marathon Finisher',
    result: '2:58:32',
    imageUrl:
      'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&q=85&w=800&h=800',
    icon: '🏅',
  }

  function handleCopyLink() {
    navigator.clipboard.writeText('https://flink.app/profile/alexcarter/highlight').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-6 pb-8">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-sm font-semibold mb-5"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back
      </button>

      <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
        Your Instagram-ready achievement card — verified, visual, and built to impress.
      </p>

      {/* ── The highlight card itself ── */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl mb-5 select-none">
        {/* Background image */}
        {ach.imageUrl ? (
          <img
            src={ach.imageUrl}
            alt={ach.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-brand via-blue-600 to-indigo-700" />
        )}

        {/* Deep gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-brand/20 to-transparent" />

        {/* Top-left: Flinki branding */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[16px]">verified</span>
          </div>
          <span className="text-white/90 text-[11px] font-black tracking-widest uppercase">
            Flinki
          </span>
        </div>

        {/* Top-right: Trust badge */}
        <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-amber-400/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="material-symbols-outlined text-amber-900 text-[13px]">emoji_events</span>
          <span className="text-amber-900 text-[10px] font-black">L6 VERIFIED</span>
        </div>

        {/* Centre: main achievement icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-7xl opacity-20 select-none">{ach.icon ?? '🏅'}</div>
        </div>

        {/* Bottom overlay: achievement data */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Result metric — hero number */}
          <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">
            Official Result
          </p>
          <p className="text-white text-5xl font-black tabular-nums leading-none mb-3">
            {ach.result}
          </p>

          {/* Achievement title */}
          <p className="text-white font-bold text-lg leading-tight mb-4">{ach.title}</p>

          {/* Author row */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full border-2 border-white/50 overflow-hidden bg-white/20 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {name
                    .split(' ')
                    .map(w => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{name}</p>
              <p className="text-white/60 text-[10px]">flink.app/profile/alexcarter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social sharing buttons */}
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Share to Socials
      </p>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <button
          type="button"
          onClick={onShareInstagram}
          className="flex flex-col items-center gap-1.5 bg-gradient-to-br from-pink-500 to-orange-400 text-white rounded-2xl py-3.5 font-bold text-[11px] hover:opacity-90 active:scale-[0.97] transition-all shadow-md shadow-pink-500/20"
        >
          <span className="material-symbols-outlined text-[22px]">photo_camera</span>
          Instagram
        </button>

        <button
          type="button"
          onClick={onShareWhatsApp}
          className="flex flex-col items-center gap-1.5 bg-emerald-500 text-white rounded-2xl py-3.5 font-bold text-[11px] hover:opacity-90 active:scale-[0.97] transition-all shadow-md shadow-emerald-500/20"
        >
          <span className="material-symbols-outlined text-[22px]">chat</span>
          WhatsApp
        </button>

        <button
          type="button"
          onClick={onShareStrava}
          className="flex flex-col items-center gap-1.5 bg-orange-500 text-white rounded-2xl py-3.5 font-bold text-[11px] hover:opacity-90 active:scale-[0.97] transition-all shadow-md shadow-orange-500/20"
        >
          <span className="material-symbols-outlined text-[22px]">directions_run</span>
          Strava
        </button>
      </div>

      {/* Copy link fallback */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={[
          'w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all duration-200 text-sm',
          copied
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
        ].join(' ')}
      >
        <span className="material-symbols-outlined text-[18px]">
          {copied ? 'check_circle' : 'link'}
        </span>
        {copied ? 'Link Copied!' : 'Copy Highlight Link'}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main ShareModal
// ---------------------------------------------------------------------------

export function ShareModal({
  open,
  onClose,
  initialView,
  name,
  avatarUrl,
  tagline,
  trainingFor,
  topAchievement,
  onShowQRCode,
  onShareWhatsApp,
  onShareInstagram,
  onShareStrava,
}: ShareModalProps) {
  const [modalView, setModalView] = useState<ShareModalView>('options')
  const [isExporting, setIsExporting] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    setModalView(initialView ?? 'options')
  }, [initialView, open])

  function handleExportPDF() {
    setIsExporting(true)
    setTimeout(() => {
      const blob = new Blob(['Mock PDF Content for Flinki Prototype'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name.replace(/\s+/g, '_')}_Flinki_Snapshot.pdf`
      a.click()
      URL.revokeObjectURL(url)
      onClose()
      setIsExporting(false)
      alert('PDF Snapshot downloaded!')
    }, 1500)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText('https://flink.app/profile/alexcarter').catch(() => {})
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet (mobile) / Centered dialog (desktop) */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none md:inset-0 md:items-center md:justify-center">
        <div className="w-full max-w-[400px] flex flex-col bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl animate-slide-up pointer-events-auto md:relative md:rounded-2xl md:max-w-md md:max-h-[90vh] md:overflow-y-auto">
          {/* Drag handle */}
          <div className="flex justify-center p-3 md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pt-2 pb-4">
            <h4 className="text-slate-900 dark:text-white text-lg font-bold text-center">
              {modalView === 'options' && 'Share your Flinki Profile'}
              {modalView === 'qr' && 'QR Code'}
              {modalView === 'embed' && 'Embed on Portfolio'}
              {modalView === 'highlight' && 'Profile Highlight Card'}
            </h4>
          </div>

          {/* Mini profile preview — shown only on options view */}
          {modalView === 'options' && (
            <div className="px-6 mb-6">
              <div className="bg-gradient-to-r from-primary-brand to-blue-600 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg">
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
                <div className="overflow-hidden flex-1">
                  <p className="font-bold text-base truncate">{name}</p>
                  <p className="text-xs text-white/80 leading-tight">
                    {tagline}
                    {trainingFor && (
                      <>
                        <br />
                        {trainingFor}
                      </>
                    )}
                  </p>
                </div>
                <span className="material-symbols-outlined text-white/40 shrink-0">qr_code_2</span>
              </div>
            </div>
          )}

          {/* ── Views ── */}

          {/* Task 4: Redesigned Options Menu — 5 key outputs */}
          {modalView === 'options' && (
            <div className="px-6 pb-8 space-y-2.5">
              {/* 1. PDF Snapshot */}
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full flex items-center gap-4 bg-primary-brand text-white font-semibold p-4 rounded-2xl shadow-md shadow-primary-brand/20 hover:bg-primary-brand/90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  {isExporting ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      progress_activity
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">download</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">
                    {isExporting ? 'Generating…' : 'PDF Snapshot'}
                  </p>
                  <p className="text-[11px] text-white/70">Download your credential report</p>
                </div>
                <span className="material-symbols-outlined text-white/50 text-[20px]">
                  chevron_right
                </span>
              </button>

              {/* 2. QR Code */}
              <button
                type="button"
                onClick={() => {
                  setModalView('qr')
                  onShowQRCode?.()
                }}
                className="w-full flex items-center gap-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-primary-brand/10 dark:bg-primary-brand/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-primary-brand">
                    qr_code
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">QR Code</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Scan to connect instantly
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">
                  chevron_right
                </span>
              </button>

              {/* 3. Copy Profile Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={[
                  'w-full flex items-center gap-4 font-semibold p-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all',
                  linkCopied
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
                ].join(' ')}
              >
                <div
                  className={[
                    'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                    linkCopied
                      ? 'bg-emerald-100 dark:bg-emerald-900/40'
                      : 'bg-primary-brand/10 dark:bg-primary-brand/20',
                  ].join(' ')}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${linkCopied ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary-brand'}`}
                  >
                    {linkCopied ? 'check_circle' : 'link'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={`text-sm font-bold ${linkCopied ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}
                  >
                    {linkCopied ? 'Link Copied!' : 'Copy Profile Link'}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Share your public profile URL
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">
                  chevron_right
                </span>
              </button>

              {/* 4. Embed on Portfolio */}
              <button
                type="button"
                onClick={() => setModalView('embed')}
                className="w-full flex items-center gap-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-violet-600 dark:text-violet-400">
                    integration_instructions
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">Embed on Portfolio</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Add a verified widget to your website
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">
                  chevron_right
                </span>
              </button>

              {/* 5. Highlight Card */}
              <button
                type="button"
                onClick={() => setModalView('highlight')}
                className="w-full flex items-center gap-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold p-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-amber-600 dark:text-amber-400">
                    auto_awesome
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">Highlight Card</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Create a shareable social graphic
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[20px]">
                  chevron_right
                </span>
              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={onClose}
                className="w-full pt-3 text-slate-400 font-semibold text-sm hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Task 1: QR view */}
          {modalView === 'qr' && <QRView onBack={() => setModalView('options')} />}

          {/* Task 2: Embed view */}
          {modalView === 'embed' && (
            <EmbedView name={name} onBack={() => setModalView('options')} />
          )}

          {/* Task 3: Highlight view */}
          {modalView === 'highlight' && (
            <HighlightView
              name={name}
              avatarUrl={avatarUrl}
              tagline={tagline}
              topAchievement={topAchievement}
              onBack={() => setModalView('options')}
              onShareWhatsApp={onShareWhatsApp}
              onShareInstagram={onShareInstagram}
              onShareStrava={onShareStrava}
            />
          )}

          {/* Home indicator */}
          <div className="flex justify-center pb-2 md:hidden">
            <div className="w-32 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </>
  )
}
