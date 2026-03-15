import { useState } from 'react'
import { showToast } from '../shared/Toaster'

// ---------------------------------------------------------------------------
// Post targets — goals and achievements the user can link a post to
// ---------------------------------------------------------------------------

export interface PostTarget {
  id: string
  type: 'goal' | 'achievement'
  label: string
  icon: string
  iconColor: string
  iconBg: string
}

export const MOCK_TARGETS: PostTarget[] = [
  {
    id: 'tg-1',
    type: 'goal',
    label: 'Berlin Marathon 2025',
    icon: 'flag',
    iconColor: 'text-accent-green',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
  },
  {
    id: 'tg-2',
    type: 'goal',
    label: 'Mont Blanc Summit',
    icon: 'landscape',
    iconColor: 'text-accent-blue',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    id: 'ach-1',
    type: 'achievement',
    label: 'London Marathon Finisher',
    icon: 'emoji_events',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-900/30',
  },
  {
    id: 'ach-2',
    type: 'achievement',
    label: 'UTMB 50K Finisher',
    icon: 'emoji_events',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-900/30',
  },
  {
    id: 'ach-3',
    type: 'achievement',
    label: 'Consistent Climber',
    icon: 'local_fire_department',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 dark:bg-orange-900/30',
  },
]

// ---------------------------------------------------------------------------
// Credibility layers: L1 → L2 → L3 → L4
// ---------------------------------------------------------------------------

interface CredibilityLayer {
  id: number
  label: string
  icon: string
  barColor: string
  textColor: string
  badgeBg: string
  badgeText: string
  barWidth: string
  nudge: string
}

const CREDIBILITY_LAYERS: Record<1 | 2 | 3 | 4, CredibilityLayer> = {
  1: {
    id: 1,
    label: 'Self-Reported',
    icon: 'edit_note',
    barColor: 'bg-slate-400',
    textColor: 'text-slate-500 dark:text-slate-400',
    badgeBg: 'bg-slate-200 dark:bg-slate-700',
    badgeText: 'text-slate-600 dark:text-slate-300',
    barWidth: '20%',
    nudge: 'Add photos, detailed notes, or tag a partner to increase trust.',
  },
  2: {
    id: 2,
    label: 'Media Evidence',
    icon: 'photo_camera',
    barColor: 'bg-blue-500',
    textColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/50',
    badgeText: 'text-blue-700 dark:text-blue-300',
    barWidth: '55%',
    nudge: 'Nice! Tag a training partner to reach the highest trust level.',
  },
  3: {
    id: 3,
    label: 'Device Data',
    icon: 'watch',
    barColor: 'bg-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/50',
    badgeText: 'text-sky-700 dark:text-sky-300',
    barWidth: '75%',
    nudge: 'Almost there! Tag a training partner to reach the highest trust level.',
  },
  4: {
    id: 4,
    label: 'Peer Confirmed',
    icon: 'group',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    barWidth: '100%',
    nudge: 'Max trust reached! Your post carries full peer-verified credibility.',
  },
}

// ---------------------------------------------------------------------------
// CreatePostModal
// ---------------------------------------------------------------------------

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPost?: (text: string, targetIds: string[], visibility: 'public' | 'private') => void
  currentUserAvatarUrl?: string
}

export function CreatePostModal({
  isOpen,
  onClose,
  onPost,
  currentUserAvatarUrl,
}: CreatePostModalProps) {
  const [text, setText] = useState('')
  const [selectedTargets, setSelectedTargets] = useState<PostTarget[]>([])
  const [showTargetPicker, setShowTargetPicker] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [taggedPartner, setTaggedPartner] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [isSaving, setIsSaving] = useState(false)

  const currentLayerKey: 1 | 2 | 3 | 4 = taggedPartner ? 4 : hasPhoto ? 2 : 1
  const layer = CREDIBILITY_LAYERS[currentLayerKey]

  const canPost = text.trim().length > 0 && selectedTargets.length > 0

  function toggleTarget(target: PostTarget) {
    setSelectedTargets(prev =>
      prev.some(t => t.id === target.id) ? prev.filter(t => t.id !== target.id) : [...prev, target]
    )
  }

  function removeTarget(id: string) {
    setSelectedTargets(prev => prev.filter(t => t.id !== id))
  }

  function handlePost() {
    if (!canPost || isSaving) return
    setIsSaving(true)
    setTimeout(() => {
      onPost?.(
        text.trim(),
        selectedTargets.map(t => t.id),
        visibility
      )
      showToast('Post shared!')
      resetState()
      onClose()
    }, 800)
  }

  function resetState() {
    setText('')
    setSelectedTargets([])
    setShowTargetPicker(false)
    setHasPhoto(false)
    setTaggedPartner(null)
    setVisibility('public')
    setIsSaving(false)
  }

  function handleClose() {
    resetState()
    onClose()
  }

  if (!isOpen) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 flex items-end md:items-center justify-center"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-label="Create post"
    >
      {/* Sheet */}
      <div
        className="w-full md:max-w-lg md:rounded-2xl bg-white dark:bg-slate-900 rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
              style={
                currentUserAvatarUrl
                  ? { backgroundImage: `url('${currentUserAvatarUrl}')` }
                  : undefined
              }
              role="img"
              aria-label="Your avatar"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                New Post
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Build your credibility record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* ── Task 4.1: Multi-Target Selector ── */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-[14px] text-primary-brand">
                  add_link
                </span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Linking to
                  <span className="text-red-400 ml-0.5">*</span>
                </p>
              </div>

              {selectedTargets.length > 0 ? (
                /* Selected chips row + Add button */
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTargets.map(target => (
                    <div
                      key={target.id}
                      className="flex items-center gap-1.5 rounded-xl border border-primary-brand/30 bg-primary-brand/5 dark:bg-primary-brand/10 pl-2 pr-1 py-1.5"
                    >
                      <div
                        className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ${target.iconBg}`}
                      >
                        <span
                          className={`material-symbols-outlined text-[11px] ${target.iconColor}`}
                        >
                          {target.icon}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-white max-w-[120px] truncate">
                        {target.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTarget(target.id)}
                        className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${target.label}`}
                      >
                        <span className="material-symbols-outlined text-[13px] text-slate-500 dark:text-slate-400">
                          close
                        </span>
                      </button>
                    </div>
                  ))}

                  {/* Add another target */}
                  <button
                    type="button"
                    onClick={() => setShowTargetPicker(true)}
                    className="flex items-center gap-1 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-[11px] font-bold text-slate-400 hover:border-primary-brand hover:text-primary-brand hover:bg-primary-brand/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px]">add</span>
                    Add
                  </button>
                </div>
              ) : (
                /* Empty prompt */
                <button
                  type="button"
                  onClick={() => setShowTargetPicker(true)}
                  className="w-full flex items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 px-4 py-3 text-left hover:border-primary-brand hover:bg-primary-brand/5 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-brand/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary-brand transition-colors">
                      flag
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 group-hover:text-primary-brand transition-colors">
                      Choose a goal or achievement
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Required — every post builds on a target
                    </p>
                  </div>
                </button>
              )}

              {/* Target picker dropdown — stays open for multi-select */}
              {showTargetPicker && (
                <div className="mt-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Targets
                      {selectedTargets.length > 0 && (
                        <span className="ml-1.5 bg-primary-brand text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                          {selectedTargets.length}
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowTargetPicker(false)}
                      className={[
                        'text-sm font-bold transition-colors',
                        selectedTargets.length > 0
                          ? 'text-primary-brand hover:text-primary-brand/80'
                          : 'text-slate-400 hover:text-slate-600',
                      ].join(' ')}
                    >
                      {selectedTargets.length > 0 ? (
                        'Done'
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      )}
                    </button>
                  </div>

                  <div className="p-2">
                    <p className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Active Goals
                    </p>
                    {MOCK_TARGETS.filter(t => t.type === 'goal').map(target => (
                      <TargetOption
                        key={target.id}
                        target={target}
                        isSelected={selectedTargets.some(t => t.id === target.id)}
                        onSelect={() => toggleTarget(target)}
                      />
                    ))}

                    <p className="px-3 py-1.5 mt-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Achievements
                    </p>
                    {MOCK_TARGETS.filter(t => t.type === 'achievement').map(target => (
                      <TargetOption
                        key={target.id}
                        target={target}
                        isSelected={selectedTargets.some(t => t.id === target.id)}
                        onSelect={() => toggleTarget(target)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Text area ── */}
            <div>
              <textarea
                className="w-full bg-transparent border-none outline-none text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed min-h-[80px]"
                placeholder="What happened? Share your training update, result, or reflection..."
                rows={4}
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
              />
            </div>

            {/* ── Task 4.2: Visibility Controls ── */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-[14px] text-slate-400">
                  visibility
                </span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Visibility
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Public */}
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={[
                    'flex flex-col items-start gap-1 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200',
                    visibility === 'public'
                      ? 'border-primary-brand bg-primary-brand text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-brand/40',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">public</span>
                    <span className="text-[12px] font-bold">Public Post</span>
                  </div>
                  <span
                    className={`text-[10px] leading-tight ${visibility === 'public' ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}
                  >
                    Feed + Waterfall
                  </span>
                </button>

                {/* Private */}
                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={[
                    'flex flex-col items-start gap-1 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200',
                    visibility === 'private'
                      ? 'border-slate-700 dark:border-slate-200 bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">lock</span>
                    <span className="text-[12px] font-bold">Private Activity</span>
                  </div>
                  <span
                    className={`text-[10px] leading-tight ${visibility === 'private' ? 'text-white/70 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}
                  >
                    Waterfall only
                  </span>
                </button>
              </div>
            </div>

            {/* ── Task 4.3: Live Credibility Meter with enhanced nudges ── */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4">
              {/* Label row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">
                    verified
                  </span>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Post Strength
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors duration-500 ${layer.textColor}`}
                >
                  <span className="material-symbols-outlined text-[13px]">{layer.icon}</span>L
                  {layer.id} — {layer.label}
                </span>
              </div>

              {/* Bar track */}
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${layer.barColor}`}
                  style={{ width: layer.barWidth }}
                />
              </div>

              {/* Layer legend — L1, L2, L3, L4 */}
              <div className="flex items-center gap-2 mb-4">
                {([1, 2, 3, 4] as const).map(key => {
                  const l = CREDIBILITY_LAYERS[key]
                  const isActive = currentLayerKey >= key
                  return (
                    <div
                      key={key}
                      className={`flex-1 flex flex-col items-center gap-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-30'}`}
                    >
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? l.badgeBg : 'bg-slate-100 dark:bg-slate-700'}`}
                      >
                        <span
                          className={`material-symbols-outlined text-[14px] transition-colors duration-500 ${isActive ? l.textColor : 'text-slate-400'}`}
                        >
                          {l.icon}
                        </span>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 text-center leading-tight">
                        L{key}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Contextual nudge message */}
              <div className="flex items-start gap-2 rounded-xl bg-white dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 px-3 py-2.5 mb-3">
                <span
                  className={`material-symbols-outlined text-[14px] shrink-0 mt-0.5 ${layer.textColor}`}
                >
                  {currentLayerKey === 4 ? 'check_circle' : 'tips_and_updates'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {layer.nudge}
                </p>
              </div>

              {/* Boost buttons */}
              <div className="flex flex-wrap gap-2">
                {/* Upload Photo → L2 */}
                {!hasPhoto ? (
                  <button
                    type="button"
                    onClick={() => setHasPhoto(true)}
                    className="flex items-center gap-1.5 rounded-full border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px]">add_a_photo</span>
                    Upload Photo
                    <span className="text-[8px] font-black bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded">
                      L2
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-3 py-1.5 text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                    Photo attached
                    <button
                      type="button"
                      onClick={() => setHasPhoto(false)}
                      className="ml-0.5 opacity-50 hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                )}

                {/* Tag Partner → L4 */}
                {!taggedPartner ? (
                  <button
                    type="button"
                    onClick={() => setTaggedPartner('Jordan P.')}
                    className="flex items-center gap-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 text-[11px] font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px]">person_add</span>
                    Tag Partner
                    <span className="text-[8px] font-black bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                      L4
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[13px]">group</span>@
                    {taggedPartner}
                    <button
                      type="button"
                      onClick={() => setTaggedPartner(null)}
                      className="ml-0.5 opacity-50 hover:opacity-100"
                      aria-label="Remove tag"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {/* Attachment shortcuts */}
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <button
              type="button"
              aria-label="Add photo"
              onClick={() => setHasPhoto(true)}
              className="transition-colors hover:text-blue-500"
            >
              <span
                className={`material-symbols-outlined text-xl ${hasPhoto ? 'text-blue-500' : ''}`}
              >
                photo_camera
              </span>
            </button>
            <button
              type="button"
              aria-label="Tag partner"
              onClick={() => setTaggedPartner('Jordan P.')}
              className="transition-colors hover:text-emerald-500"
            >
              <span
                className={`material-symbols-outlined text-xl ${taggedPartner ? 'text-emerald-500' : ''}`}
              >
                alternate_email
              </span>
            </button>
          </div>

          {/* Post button — shows (Private) label when applicable */}
          <button
            type="button"
            onClick={handlePost}
            disabled={!canPost || isSaving}
            title={
              selectedTargets.length === 0
                ? 'Choose a goal or achievement first'
                : !text.trim()
                  ? 'Write something first'
                  : undefined
            }
            className={[
              'flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
              canPost && !isSaving
                ? 'bg-primary-brand text-white shadow-md shadow-primary-brand/25 hover:bg-primary-brand/90 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed',
            ].join(' ')}
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                Posting...
              </>
            ) : (
              <>
                {visibility === 'private' && canPost && (
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                )}
                {visibility === 'private' ? 'Post (Private)' : 'Post'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TargetOption — row inside the picker dropdown (multi-select aware)
// ---------------------------------------------------------------------------

function TargetOption({
  target,
  isSelected,
  onSelect,
}: {
  target: PostTarget
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
        isSelected
          ? 'bg-primary-brand/5 dark:bg-primary-brand/10'
          : 'hover:bg-slate-50 dark:hover:bg-slate-700',
      ].join(' ')}
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${target.iconBg}`}
      >
        <span className={`material-symbols-outlined text-[18px] ${target.iconColor}`}>
          {target.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
          {target.label}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">{target.type}</p>
      </div>
      {/* Multi-select checkbox indicator */}
      <div
        className={[
          'h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200',
          isSelected
            ? 'border-primary-brand bg-primary-brand'
            : 'border-slate-300 dark:border-slate-600',
        ].join(' ')}
      >
        {isSelected && (
          <span className="material-symbols-outlined text-white text-[13px]">check</span>
        )}
      </div>
    </button>
  )
}
