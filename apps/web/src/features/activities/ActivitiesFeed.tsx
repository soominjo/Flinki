import { useState } from 'react'
import { CommentsModal } from './CommentsModal'
import { CreatePostModal } from './CreatePostModal'
import { SuggestedProfileModal } from '../sidebar/SuggestedProfileModal'

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
  /** Optional goal/achievement this post is building towards */
  goalLink?: {
    id: string
    title: string
    icon?: string
  }
}

// ---------------------------------------------------------------------------
// Suggested Athletes horizontal strip
// ---------------------------------------------------------------------------

const SUGGESTED_ATHLETES = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=85',
    tags: 'Marathoner • Climber • Designer',
    bio: 'Passionate trail runner based in Austin. Always looking for weekend long-run partners!',
  },
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=85',
    tags: 'Ultra Runner • Coach',
    bio: 'Ultra runner and running coach. Love helping others crush their first 50K or 100-miler.',
  },
  {
    id: 'nina-patel',
    name: 'Nina Patel',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=400&q=85',
    tags: 'Triathlete • Nutritionist',
    bio: 'Triathlete and sports nutritionist. Balancing swim-bike-run with helping athletes fuel properly.',
  },
  {
    id: 'jordan-pierce',
    name: 'Jordan Pierce',
    avatar:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&h=400&q=85',
    tags: 'Cyclist • Duathlete',
    bio: 'Weekend warrior turned competitive cyclist. Always chasing the next KOM.',
  },
]

type SuggestedAthlete = (typeof SUGGESTED_ATHLETES)[0]

export function SuggestedAthletesStrip() {
  const [requestedIds, setRequestedIds] = useState<Record<string, boolean>>({})
  const [previewAthlete, setPreviewAthlete] = useState<SuggestedAthlete | null>(null)

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Suggested Athletes</h4>
          <button
            type="button"
            className="text-xs font-semibold text-primary-brand hover:underline"
            onClick={() => alert('See all suggestions')}
          >
            See all
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {SUGGESTED_ATHLETES.map(athlete => {
            const isRequested = requestedIds[athlete.id] === true
            return (
              <div
                key={athlete.id}
                className="flex-none w-28 flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
              >
                <button
                  type="button"
                  onClick={() => setPreviewAthlete(athlete)}
                  className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
                  aria-label={`View ${athlete.name}'s profile`}
                >
                  <img
                    src={athlete.avatar}
                    alt={athlete.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                    loading="lazy"
                  />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 text-center leading-tight line-clamp-2">
                    {athlete.name}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 text-center leading-tight line-clamp-2">
                    {athlete.tags}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={isRequested}
                  onClick={() => setRequestedIds(prev => ({ ...prev, [athlete.id]: true }))}
                  className={[
                    'w-full text-[10px] font-bold px-2 py-1.5 rounded-full transition-colors',
                    isRequested
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-primary-brand text-white hover:brightness-110',
                  ].join(' ')}
                >
                  {isRequested ? 'Pending' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <SuggestedProfileModal athlete={previewAthlete} onClose={() => setPreviewAthlete(null)} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Quick Post Creator — collapsed pill only, opens modal on click
// ---------------------------------------------------------------------------

interface QuickPostCreatorProps {
  currentUserAvatarUrl?: string
  onOpenModal: () => void
}

function QuickPostCreator({ currentUserAvatarUrl, onOpenModal }: QuickPostCreatorProps) {
  return (
    <div
      className="flex items-center gap-3 mb-6 cursor-pointer"
      onClick={onOpenModal}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpenModal()}
      aria-label="Create a new post"
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

      {/* "Building towards" goal badge — top of card content */}
      {post.goalLink && (
        <div className="px-4 pt-1 pb-2">
          <button
            type="button"
            onClick={() => alert(`Goal: ${post.goalLink!.title}`)}
            className="inline-flex items-center gap-1.5 bg-primary-brand/8 dark:bg-primary-brand/15 border border-primary-brand/15 dark:border-primary-brand/25 text-primary-brand rounded-full px-3 py-1 hover:bg-primary-brand/15 transition-colors"
          >
            <span className="text-[13px]">🎯</span>
            <span className="text-[11px] font-bold">Building towards: {post.goalLink.title}</span>
          </button>
        </div>
      )}

      {/* Workout Stats */}
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
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [menuOpenPostId, setMenuOpenPostId] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-4">
      <QuickPostCreator
        currentUserAvatarUrl={currentUserAvatarUrl}
        onOpenModal={() => setIsCreatePostOpen(true)}
      />

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

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        currentUserAvatarUrl={currentUserAvatarUrl}
        onPost={text => {
          onPost?.(text)
          setIsCreatePostOpen(false)
        }}
      />
    </div>
  )
}
