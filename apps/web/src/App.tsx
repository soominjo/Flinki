import { useRef, useState } from 'react'
import './style.css'

// Feature components
import { ProfileHeader } from './features/profile/ProfileHeader'
import { TrainingGoalsSection } from './features/profile/TrainingGoals'
import type { TrainingGoal, AlbumThumb } from './features/profile/TrainingGoals'
import { ActivitiesFeed } from './features/activities/ActivitiesFeed'
import type { ActivityPost } from './features/activities/ActivitiesFeed'
import { CareerTimeline } from './features/career/CareerTimeline'
import type { ExperienceItem, Certification } from './features/career/CareerTimeline'
import { ShareModal } from './features/shared/ShareModal'
import { AddAchievementModal } from './features/achievements/AddAchievementModal'
import { PerformanceDashboard } from './features/stats/PerformanceDashboard'
import type { YearStats } from './features/stats/PerformanceDashboard'
import { BottomNav } from './features/navigation/BottomNav'
import type { NavTab } from './features/navigation/BottomNav'
import { RightSidebar } from './features/sidebar/RightSidebar'

// Shared component
import { AchievementsList } from './components/AchievementsList'

// Mock data
import { mockUser, mockAchievements } from './lib/mockData'

// ---------------------------------------------------------------------------
// Mock data — profile sections
// ---------------------------------------------------------------------------

const mockTrainingGoals: TrainingGoal[] = [
  {
    id: 'tg-1',
    title: 'Berlin 2025',
    progress: 60,
    colorClass: 'text-accent-green',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
  {
    id: 'tg-2',
    title: 'Mont Blanc',
    progress: 35,
    colorClass: 'text-accent-blue',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
]

const mockAlbumThumbs: AlbumThumb[] = [
  { id: 'all', title: 'All' },
  {
    id: 'alb-cycling',
    title: 'Cycling',
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
  {
    id: 'alb-running',
    title: 'Running',
    imageUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
  {
    id: 'alb-climbing',
    title: 'Climbing',
    imageUrl:
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
]

const mockActivityPosts: ActivityPost[] = [
  {
    id: 'ap-1',
    authorName: 'Alex Rivera',
    authorInitials: 'AR',
    authorAvatarUrl:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=85&w=200&h=200',
    activityType: 'Morning Run',
    timeAgo: '2 hours ago',
    activityIcon: 'directions_run',
    stats: [
      { label: 'Distance', value: '12.5 km' },
      { label: 'Pace', value: '5:30/km' },
      { label: 'Elevation', value: '150m' },
    ],
    description: 'Great preparation run for the upcoming Berlin Marathon. Feeling strong!',
    mediaUrls: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=85&w=1080&h=810',
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=85&w=1080&h=810',
    ],
    kudosCount: 14,
    commentCount: 12,
  },
  {
    id: 'ap-2',
    authorName: 'Morgan Chen',
    authorInitials: 'MC',
    authorAvatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=200&h=200',
    activityType: 'Trail Run',
    timeAgo: '5 hours ago',
    activityIcon: 'landscape',
    stats: [
      { label: 'Distance', value: '8.4 km' },
      { label: 'Time', value: '52:18' },
      { label: 'Elev.', value: '210m' },
    ],
    description: 'Just wrapped up a weekend climb at Enchanted Rock. Views never get old.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1080&h=810',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=85&w=1080&h=810',
    ],
    kudosCount: 31,
    commentCount: 7,
  },
]

const mockExperience: ExperienceItem[] = [
  {
    id: 'ex-1',
    role: 'Sponsored Athlete',
    organization: 'Nike Run Club',
    dateRange: 'Jan 2022 - Present • 2 yrs 4 mos',
    logoUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'ex-2',
    role: 'Lead Climbing Instructor',
    organization: 'Vertical World',
    dateRange: 'Jun 2020 - Dec 2021 • 1 yr 7 mos',
    logoUrl:
      'https://images.unsplash.com/photo-1560264280-08b166ce6ba2?auto=format&fit=crop&q=80&w=150&h=150',
  },
]

const mockCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'Level 2 CrossFit Trainer',
    issuer: 'CrossFit Inc.',
    icon: 'verified_user',
  },
  {
    id: 'cert-2',
    title: 'Advanced Wilderness First Aid',
    issuer: 'NOLS (National Outdoor Leadership School)',
    icon: 'medical_services',
    imageUrl:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=150&h=150',
  },
]

// ---------------------------------------------------------------------------
// Mock data — Performance Dashboard (heatmap values match reference HTML)
// ---------------------------------------------------------------------------

const mockStatsByYear: Record<string, YearStats> = {
  '2025': {
    year: '2025',
    distance: '1,240',
    distanceUnit: 'km',
    elevation: '12,000',
    elevationUnit: 'm',
    activeDays: 142,
    heatmap: [
      'bg-emerald-500',
      'bg-emerald-200',
      'bg-emerald-700',
      'bg-slate-200',
      'bg-emerald-400',
      'bg-emerald-600',
      'bg-emerald-100',
      'bg-slate-200',
      'bg-emerald-300',
      'bg-emerald-500',
      'bg-emerald-800',
      'bg-emerald-400',
      'bg-emerald-200',
      'bg-emerald-400',
      'bg-emerald-100',
      'bg-emerald-300',
      'bg-emerald-600',
      'bg-emerald-400',
      'bg-emerald-200',
      'bg-emerald-500',
      'bg-slate-200',
      'bg-emerald-300',
      'bg-emerald-100',
      'bg-emerald-200',
      'bg-emerald-500',
      'bg-emerald-800',
      'bg-emerald-400',
      'bg-emerald-300',
      'bg-emerald-100',
      'bg-emerald-600',
      'bg-emerald-400',
      'bg-emerald-200',
      'bg-emerald-500',
      'bg-slate-200',
      'bg-emerald-300',
      'bg-emerald-100',
      'bg-emerald-200',
      'bg-emerald-400',
      'bg-emerald-100',
      'bg-emerald-600',
      'bg-emerald-400',
      'bg-emerald-200',
      'bg-emerald-500',
      'bg-slate-200',
      'bg-emerald-300',
      'bg-emerald-100',
      'bg-emerald-200',
      'bg-emerald-500',
    ],
    trainingLoad: {
      weeklyEffort: 342,
      status: 'Productive',
      bars: [45, 75, 60, 90, 55, 80, 65],
      days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
    personalRecords: [
      {
        id: 'pr-1',
        icon: 'directions_run',
        activity: 'Marathon',
        time: '2:55:10',
        verified: true,
        isPrimary: true,
      },
      { id: 'pr-2', icon: 'directions_run', activity: '5K Run', time: '18:42', verified: true },
      {
        id: 'pr-3',
        icon: 'directions_bike',
        activity: '100K Cycle',
        time: '3:12:05',
        verified: true,
      },
    ],
    gear: [
      {
        id: 'gear-1',
        name: 'Nike Alphafly 3',
        metricLabel: '350km',
        capLabel: '800km cap',
        progress: 43,
        progressColor: 'bg-primary-brand',
      },
      {
        id: 'gear-2',
        name: 'Specialized Tarmac SL8',
        metricLabel: '1,240km',
        capLabel: '5,000km cap',
        progress: 25,
        progressColor: 'bg-primary-brand',
      },
      {
        id: 'gear-3',
        name: 'Garmin Forerunner 965',
        metricLabel: '98% Battery',
        capLabel: 'Updated 2h ago',
        progress: 98,
        progressColor: 'bg-emerald-500',
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// Tab configuration
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('Achievements')
  const [selectedAlbumId, setSelectedAlbumId] = useState('all')
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareInitialView, setShareInitialView] = useState<'options' | 'qr'>('options')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  function handleTabChange(tab: NavTab) {
    if (tab === 'Train') {
      setIsAddOpen(true)
    } else {
      setActiveTab(tab)
      if (tab !== 'Stats') {
        setTimeout(
          () => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          50
        )
      }
    }
  }

  // Stats tab — render inside the responsive grid center column
  const mainContent =
    activeTab === 'Stats' ? (
      <PerformanceDashboard
        statsByYear={mockStatsByYear}
        onBack={() => setActiveTab('Achievements')}
      />
    ) : (
      <>
        {/* Profile header + bio/actions */}
        <ProfileHeader
          user={mockUser}
          onShareBio={() => {
            setShareInitialView('options')
            setIsShareOpen(true)
          }}
          onQRCode={() => {
            setShareInitialView('qr')
            setIsShareOpen(true)
          }}
        />

        {/* ── Achievement Timeline ── focal point directly under the header */}
        <section className="mt-5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="px-6 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-xl">emoji_events</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Achievements</h3>
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {mockAchievements.length} earned
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTab('Achievements')
                setTimeout(
                  () => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                  50
                )
              }}
              className="text-xs font-semibold text-primary-brand"
            >
              See all
            </button>
          </div>

          {/* Horizontal badge timeline strip */}
          <div className="flex gap-5 overflow-x-auto no-scrollbar px-6 pb-1">
            {mockAchievements.map(ach => {
              const styles = {
                milestone: {
                  ring: 'ring-amber-400',
                  dot: 'bg-amber-400',
                  pill: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                },
                social: {
                  ring: 'ring-emerald-400',
                  dot: 'bg-emerald-400',
                  pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                },
                skill: {
                  ring: 'ring-violet-400',
                  dot: 'bg-violet-400',
                  pill: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
                },
              } as const
              const s = styles[ach.category]
              return (
                <button
                  key={ach.id}
                  type="button"
                  className="flex-none flex flex-col items-center gap-2 w-[72px] group"
                  onClick={() => {
                    setActiveTab('Achievements')
                    setTimeout(
                      () => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                      50
                    )
                  }}
                >
                  {/* Badge circle */}
                  <div
                    className={[
                      'h-[72px] w-[72px] rounded-full overflow-hidden flex items-center justify-center text-2xl',
                      'bg-slate-100 dark:bg-slate-800 shadow-md',
                      'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900',
                      'group-hover:scale-105 transition-transform',
                      s.ring,
                    ].join(' ')}
                  >
                    {ach.imageUrl ? (
                      <img
                        src={ach.imageUrl}
                        alt={ach.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{ach.icon}</span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight line-clamp-2">
                    {ach.title}
                  </p>

                  {/* Date + category pill */}
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${s.pill}`}>
                    {new Date(ach.unlockedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: '2-digit',
                    })}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Training goals + albums */}
        <TrainingGoalsSection
          goals={mockTrainingGoals}
          albums={mockAlbumThumbs}
          selectedAlbumId={selectedAlbumId}
          onSelectAlbum={setSelectedAlbumId}
          onAddGoal={() => setIsAddOpen(true)}
        />

        {/* ── Sticky profile tab strip ── */}
        <div
          ref={tabsRef}
          className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex"
        >
          {(['Achievements', 'Activities', 'Career & Quals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
              className={[
                'flex-1 py-3 text-sm font-semibold transition-colors border-b-2',
                activeTab === tab
                  ? 'text-primary-brand border-primary-brand'
                  : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300',
              ].join(' ')}
            >
              {tab === 'Career & Quals' ? 'Career' : tab}
            </button>
          ))}
        </div>

        {/* ── Tab content — keyed so React remounts on change, triggering animation ── */}
        <div key={activeTab} className="animate-tab-content">
          {activeTab === 'Achievements' && <AchievementsList achievements={mockAchievements} />}

          {activeTab === 'Activities' && <ActivitiesFeed posts={mockActivityPosts} />}

          {activeTab === 'Career & Quals' && (
            <CareerTimeline
              experience={mockExperience}
              certifications={mockCertifications}
              onAddCredential={() => setIsAddOpen(true)}
            />
          )}
        </div>
      </>
    )

  return (
    <div className="min-h-screen bg-background-light dark:bg-slate-900 font-display md:grid md:grid-cols-[80px_1fr] lg:grid-cols-[250px_minmax(auto,700px)_250px] lg:justify-center mx-auto">
      {/* ── Left column — sidebar nav on md+, fixed bottom bar on mobile ── */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── Center column — all profile content ── */}
      <div className="w-full max-w-[700px] mx-auto min-h-screen border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col pb-16 md:pb-0">
        {mainContent}
      </div>

      {/* ── Right column — desktop sidebar ── */}
      <RightSidebar />

      {/* ── Overlays ── */}
      <ShareModal
        open={isShareOpen}
        initialView={shareInitialView}
        onClose={() => {
          setIsShareOpen(false)
          setShareInitialView('options')
        }}
        name={mockUser.name}
        avatarUrl={mockUser.avatarUrl}
        tagline={`${mockUser.tags.join(' • ')} • ${mockAchievements.length} Achievements`}
        trainingFor={`Training for ${mockTrainingGoals[0]?.title}`}
      />

      <AddAchievementModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={data => {
          console.log('New achievement submitted:', data)
          setIsAddOpen(false)
        }}
      />
    </div>
  )
}
