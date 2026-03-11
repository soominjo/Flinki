import { useState } from 'react'
import { CommentsModal } from './CommentsModal'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export interface WorkoutStat {
  label: string
  value: string
}

export interface ActivityPost {
  id: string
  authorName: string
  authorAvatarUrl?: string
  /** Fallback 2-letter initials if no avatar URL */
  authorInitials?: string
  /** Human-readable activity label, e.g. "Morning Run" */
  activityType: string
  timeAgo: string
  /** Material Symbols icon name, e.g. "directions_run" */
  activityIcon: string
  stats?: WorkoutStat[]
  description?: string
  mediaUrls?: string[]
  kudosCount: number
  commentCount: number
}

// ---------------------------------------------------------------------------
// Post targets — goals and achievements the user can link a post to
// ---------------------------------------------------------------------------

interface PostTarget {
  id: string
  type: 'goal' | 'achievement'
  label: string
  icon: string
  iconColor: string
  iconBg: string
}

const MOCK_TARGETS: PostTarget[] = [
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
// Trust layer configs used by the composer nudges
// ---------------------------------------------------------------------------

const COMPOSER_LAYERS = {
  1: {
    label: 'Self-Reported',
    color: 'text-slate-500 dark:text-slate-400',
    bar: 'bg-slate-400',
    icon: 'edit_note',
    barWidth: '16.7%',
  },
  2: {
    label: 'Media Evidence',
    color: 'text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-400',
    icon: 'photo_camera',
    barWidth: '33.3%',
  },
  4: {
    label: 'Peer Confirmed',
    color: 'text-cyan-600 dark:text-cyan-400',
    bar: 'bg-cyan-400',
    icon: 'group',
    barWidth: '66.7%',
  },
} as const

type ComposerLayer = keyof typeof COMPOSER_LAYERS

// ---------------------------------------------------------------------------
// Quick Post Creator
// ---------------------------------------------------------------------------

interface QuickPostCreatorProps {
  currentUserAvatarUrl?: string
  onPost?: (text: string) => void
}

function QuickPostCreator({ currentUserAvatarUrl, onPost }: QuickPostCreatorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [text, setText] = useState('')
  const [selectedTarget, setSelectedTarget] = useState<PostTarget | null>(null)
  const [showTargetPicker, setShowTargetPicker] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false)
  const [taggedPartner, setTaggedPartner] = useState<string | null>(null)

  const currentLayer: ComposerLayer = taggedPartner ? 4 : hasPhoto ? 2 : 1
  const layerCfg = COMPOSER_LAYERS[currentLayer]
  const hasContent = text.trim().length > 0

  function handlePost() {
    if (!hasContent) return
    onPost?.(text.trim())
    setText('')
    setSelectedTarget(null)
    setHasPhoto(false)
    setTaggedPartner(null)
    setIsExpanded(false)
  }

  function handleCancel() {
    setText('')
    setSelectedTarget(null)
    setHasPhoto(false)
    setTaggedPartner(null)
    setIsExpanded(false)
    setShowTargetPicker(false)
  }

  /* ── Collapsed pill ── */
  if (!isExpanded) {
    return (
      <div
        className="flex items-center gap-3 mb-6 cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div
          className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
          style={
            currentUserAvatarUrl ? { backgroundImage: `url('${currentUserAvatarUrl}')` } : undefined
          }
          role="img"
          aria-label="Your avatar"
        />
        <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5 gap-2">
          <span className="material-symbols-outlined text-slate-400 text-[18px]">add_link</span>
          <span className="flex-1 text-xs text-slate-400 dark:text-slate-500">
            Post towards an achievement or goal...
          </span>
          <span className="bg-primary-brand/10 text-primary-brand text-[9px] font-black px-2 py-0.5 rounded-full">
            L1+
          </span>
        </div>
      </div>
    )
  }

  /* ── Expanded composer ── */
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
            style={
              currentUserAvatarUrl
                ? { backgroundImage: `url('${currentUserAvatarUrl}')` }
                : undefined
            }
            role="img"
            aria-label="Your avatar"
          />
          <span className="text-sm font-bold text-slate-900 dark:text-white">New Post</span>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Cancel"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="px-4 pt-3">
        {/* ── Task 4.2: Target Linker ── */}
        {selectedTarget ? (
          /* Selected chip */
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Linking to:
            </span>
            <button
              type="button"
              onClick={() => setShowTargetPicker(true)}
              className="flex items-center gap-1.5 bg-primary-brand/10 text-primary-brand rounded-full px-3 py-1 text-[12px] font-semibold hover:bg-primary-brand/15 transition-colors"
            >
              <span className={`material-symbols-outlined text-[14px] ${selectedTarget.iconColor}`}>
                {selectedTarget.icon}
              </span>
              {selectedTarget.label}
              <span className="material-symbols-outlined text-[14px] opacity-60">expand_more</span>
            </button>
          </div>
        ) : (
          /* Prompt to choose */
          <button
            type="button"
            onClick={() => setShowTargetPicker(true)}
            className="w-full mb-3 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-3 py-2.5 text-xs text-slate-400 dark:text-slate-500 hover:border-primary-brand hover:text-primary-brand transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add_link</span>
            Link to a goal or achievement...
          </button>
        )}

        {/* Target picker dropdown */}
        {showTargetPicker && (
          <div className="mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Target
              </p>
              <button
                type="button"
                onClick={() => setShowTargetPicker(false)}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="p-2 space-y-0.5 max-h-52 overflow-y-auto">
              {MOCK_TARGETS.map(target => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => {
                    setSelectedTarget(target)
                    setShowTargetPicker(false)
                  }}
                  className={[
                    'w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                    selectedTarget?.id === target.id
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
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                      {target.type}
                    </p>
                  </div>
                  {selectedTarget?.id === target.id && (
                    <span className="material-symbols-outlined text-primary-brand shrink-0">
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text area */}
        <textarea
          className="w-full bg-transparent border-none outline-none text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed"
          placeholder="What happened? Share your training update, result, or reflection..."
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
        />
      </div>

      {/* ── Task 4.3: Social Nudges — layer strength meter (shown once text exists) ── */}
      {hasContent && (
        <div className="mx-4 mb-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3">
          {/* Label row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-slate-400">layers</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Post Strength
              </span>
            </div>
            <span className={`text-[10px] font-bold flex items-center gap-1 ${layerCfg.color}`}>
              <span className="material-symbols-outlined text-[12px]">{layerCfg.icon}</span>L
              {currentLayer} — {layerCfg.label}
            </span>
          </div>

          {/* Strength bar */}
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${layerCfg.bar}`}
              style={{ width: layerCfg.barWidth }}
            />
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2 font-medium">
            Boost credibility:
          </p>

          {/* Nudge chips */}
          <div className="flex flex-wrap gap-2">
            {/* Photo nudge → L2 */}
            {!hasPhoto ? (
              <button
                type="button"
                onClick={() => {
                  setHasPhoto(true)
                  alert('Camera roll opened (mock)')
                }}
                className="flex items-center gap-1.5 rounded-full border border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 px-3 py-1 text-[11px] font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[13px]">add_a_photo</span>+ Photo
                <span className="text-[8px] font-black bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-300 px-1.5 py-0.5 rounded">
                  L2
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 px-3 py-1 text-[11px] font-semibold">
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

            {/* Tag partner nudge → L4 */}
            {!taggedPartner ? (
              <button
                type="button"
                onClick={() => setTaggedPartner('Jordan P.')}
                className="flex items-center gap-1.5 rounded-full border border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 px-3 py-1 text-[11px] font-semibold hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[13px]">person_add</span>+ Tag
                Partner
                <span className="text-[8px] font-black bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-300 px-1.5 py-0.5 rounded">
                  L4
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 px-3 py-1 text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[13px]">group</span>@{taggedPartner}
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
      )}

      {/* Footer: attachment shortcuts + Post button */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
          <button type="button" aria-label="Add photo" onClick={() => setHasPhoto(true)}>
            <span
              className={`material-symbols-outlined text-xl transition-colors ${hasPhoto ? 'text-violet-500' : ''}`}
            >
              photo_camera
            </span>
          </button>
          <button
            type="button"
            aria-label="Add location"
            onClick={() => alert('Fetching location...')}
          >
            <span className="material-symbols-outlined text-xl">location_on</span>
          </button>
          <button
            type="button"
            aria-label="Tag someone"
            onClick={() => setTaggedPartner('Jordan P.')}
          >
            <span
              className={`material-symbols-outlined text-xl transition-colors ${taggedPartner ? 'text-cyan-500' : ''}`}
            >
              alternate_email
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handlePost}
          disabled={!hasContent}
          className={[
            'px-5 py-2 rounded-xl text-sm font-bold transition-all',
            hasContent
              ? 'bg-primary-brand text-white shadow-md shadow-primary-brand/25 hover:bg-primary-brand/90 active:scale-95'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed',
          ].join(' ')}
        >
          Post
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Workout Stats Bar
// ---------------------------------------------------------------------------

function WorkoutStatsBar({ stats }: { stats: WorkoutStat[] }) {
  return (
    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 flex justify-between border-y border-slate-100 dark:border-slate-800">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={[
            'text-center flex-1',
            // Add left+right border on every middle item (not first, not last)
            i > 0 && i < stats.length - 1 ? 'border-x border-slate-200 dark:border-slate-700' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <p className="text-xs font-bold text-slate-900 dark:text-white">{stat.value}</p>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Media Carousel
// ---------------------------------------------------------------------------

function MediaCarousel({ mediaUrls }: { mediaUrls: string[] }) {
  return (
    <div className="px-4 pb-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory rounded-xl aspect-video">
        {mediaUrls.map((url, i) => (
          <div
            key={i}
            className="flex-none w-[90%] md:w-[80%] snap-center bg-slate-200 dark:bg-slate-700 bg-cover bg-center rounded-xl"
            style={{ backgroundImage: `url('${url}')` }}
            role="img"
            aria-label={`Media ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Activity Post Card
// ---------------------------------------------------------------------------

interface ActivityPostCardProps {
  post: ActivityPost
  onOpenComments?: () => void
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
}

function ActivityPostCard({
  post,
  onOpenComments,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}: ActivityPostCardProps) {
  const [kudoed, setKudoed] = useState(false)
  const [kudosCount, setKudosCount] = useState(post.kudosCount)

  function handleKudos() {
    setKudoed(prev => {
      const next = !prev
      setKudosCount(c => c + (next ? 1 : -1))
      return next
    })
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Card Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          {/* Author avatar */}
          <div
            className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
            style={
              post.authorAvatarUrl
                ? { backgroundImage: `url('${post.authorAvatarUrl}')` }
                : undefined
            }
            role="img"
            aria-label={post.authorName}
          />
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">{post.authorName}</h5>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {post.activityType} • {post.timeAgo}
            </p>
          </div>
        </div>

        {/* Activity icon + overflow menu */}
        <div className="relative flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined text-lg">{post.activityIcon}</span>
          <button type="button" aria-label="More options" onClick={onMenuToggle}>
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                onClick={() => {
                  alert('Edit post modal opening...')
                  onMenuClose()
                }}
              >
                Edit Post
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => {
                  alert('Post deleted')
                  onMenuClose()
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Workout Stats — shown above description, matching reference layout */}
      {post.stats && post.stats.length > 0 && <WorkoutStatsBar stats={post.stats} />}

      {/* Description */}
      {post.description && (
        <div className="p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {post.description}
          </p>
        </div>
      )}

      {/* Media Carousel */}
      {post.mediaUrls && post.mediaUrls.length > 0 && <MediaCarousel mediaUrls={post.mediaUrls} />}

      {/* Action Bar */}
      <div className="px-4 py-3 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-4">
          {/* Kudos */}
          <button
            className={`flex items-center gap-1.5 ${kudoed ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`}
            onClick={handleKudos}
            aria-label="Give kudos"
            aria-pressed={kudoed}
          >
            <span
              className={`material-symbols-outlined text-lg ${kudoed ? 'fill-1' : ''}`}
              style={kudoed ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              local_fire_department
            </span>
            <span className="text-xs font-bold">
              {kudosCount > 0 ? `${kudosCount} Kudos` : 'Kudos'}
            </span>
          </button>

          {/* Comments */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
            onClick={onOpenComments}
          >
            <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
            <span className="text-xs font-bold">
              {post.commentCount > 0 ? `${post.commentCount} Comments` : 'Comment'}
            </span>
          </button>
        </div>

        {/* Share */}
        <button
          type="button"
          className="text-primary-brand hover:opacity-80 transition-opacity"
          aria-label="Share"
          onClick={() => alert(`Share "${post.activityType}" by ${post.authorName}`)}
        >
          <span className="material-symbols-outlined text-lg">share</span>
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActivitiesFeed — composed section
// ---------------------------------------------------------------------------

interface ActivitiesFeedProps {
  posts: ActivityPost[]
  currentUserAvatarUrl?: string
  onPost?: (text: string) => void
}

export function ActivitiesFeed({ posts, currentUserAvatarUrl, onPost }: ActivitiesFeedProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [menuOpenPostId, setMenuOpenPostId] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-4">
      <QuickPostCreator currentUserAvatarUrl={currentUserAvatarUrl} onPost={onPost} />

      <div className="space-y-6">
        {posts.map(post => (
          <ActivityPostCard
            key={post.id}
            post={post}
            onOpenComments={() => setIsCommentsOpen(true)}
            isMenuOpen={menuOpenPostId === post.id}
            onMenuToggle={() => setMenuOpenPostId(prev => (prev === post.id ? null : post.id))}
            onMenuClose={() => setMenuOpenPostId(null)}
          />
        ))}
      </div>

      <CommentsModal isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
    </div>
  )
}
