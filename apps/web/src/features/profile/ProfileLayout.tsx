// ---------------------------------------------------------------------------
// ProfileLayout — the above-the-fold profile UI + tab content.
// Extracted from App.tsx so the entry point stays lean.
// ---------------------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react'
import { ProfileHeader } from './ProfileHeader'
import { TrainingGoalsSection } from './TrainingGoals'
import type { TrainingGoal } from './TrainingGoals'

import { ActivitiesFeed, SuggestedAthletesStrip } from '../activities/ActivitiesFeed'
import type { ActivityPost } from '../activities/ActivitiesFeed'
import { TrainingSquad } from './TrainingSquad'
import { ProfileAnalyticsCard } from '../stats/PerformanceDashboard'
import { CareerTimeline } from '../career/CareerTimeline'
import type { ExperienceItem, Certification } from '../career/CareerTimeline'
import { AchievementsList } from '../../components/AchievementsList'
import { CompletionCelebrationModal } from '../achievements/AddAchievementModal'
import { mockUser, mockAchievements } from '../../lib/mockData'
import type { NavTab } from '../navigation/BottomNav'

// ---------------------------------------------------------------------------
// Mock data — owned here so App.tsx stays clean
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
      { label: 'Time', value: '1:08:45' },
    ],
    description: 'Great preparation run for the upcoming Berlin Marathon. Feeling strong!',
    mediaUrls: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=85&w=1080&h=810',
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=85&w=1080&h=810',
    ],
    kudosCount: 14,
    commentCount: 12,
    goalLink: { id: 'tg-1', title: 'Berlin Marathon 2025', icon: 'flag' },
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
    ],
    description: 'Just wrapped up a weekend climb at Enchanted Rock. Views never get old.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1080&h=810',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=85&w=1080&h=810',
    ],
    kudosCount: 31,
    commentCount: 7,
    goalLink: { id: 'tg-2', title: 'Mont Blanc Summit', icon: 'landscape' },
  },
]

const mockExperience: ExperienceItem[] = [
  {
    id: 'ex-1',
    role: 'Sponsored Athlete',
    organization: 'Nike Run Club',
    dateRange: 'Jan 2022 - Present • 2 yrs 4 mos',
    location: 'Global',
    description:
      'Selected as 1 of 12 NRC Elite athletes globally. Lead community pace groups at flagship events, develop personalised training plans for 500+ members, and represent the brand at major World Marathon Majors including Boston, London, and Tokyo.',
    logoUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'ex-2',
    role: 'Lead Climbing Instructor',
    organization: 'Vertical World',
    dateRange: 'Jun 2020 - Dec 2021 • 1 yr 7 mos',
    location: 'Seattle, WA',
    description:
      'Designed and delivered progressive lead climbing curricula for beginner to advanced groups. Certified 48 students in top-rope and lead belay techniques. Maintained a flawless safety record across 300+ sessions and grew the adult programme by 40%.',
    logoUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=150&q=80&fit=crop',
  },
]

const mockCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'Level 2 CrossFit Trainer',
    issuer: 'CrossFit Inc.',
    icon: 'verified_user',
    issuedDate: 'Jan 2023',
    expiresDate: 'Jan 2026',
    status: 'active',
    credentialId: 'CF-L2-2023-07842',
  },
  {
    id: 'cert-2',
    title: 'Advanced Wilderness First Aid',
    issuer: 'NOLS — National Outdoor Leadership School',
    icon: 'medical_services',
    issuedDate: 'Mar 2022',
    expiresDate: 'Mar 2025',
    status: 'active',
    credentialId: 'NOLS-WFA-2022-11293',
    imageUrl:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=150&h=150',
  },
]

// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

function Sk({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

function ActivitiesSkeleton() {
  return (
    <div className="p-6 space-y-5">
      {/* Quick post creator */}
      <div className="flex items-center gap-3">
        <Sk className="h-10 w-10 rounded-full shrink-0" />
        <Sk className="flex-1 h-10 rounded-full" />
      </div>
      {/* Post cards */}
      {[0, 1].map(i => (
        <div
          key={i}
          className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          <div className="p-4 flex gap-3">
            <Sk className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Sk className="h-3.5 w-32" />
              <Sk className="h-3 w-24" />
            </div>
          </div>
          <Sk className="mx-4 h-36 rounded-xl mb-4" />
          <div className="px-4 pb-4 flex gap-4">
            <Sk className="h-4 w-20" />
            <Sk className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function AchievementsSkeleton() {
  return (
    <div className="px-6 pt-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sk className="h-6 w-6 rounded-lg" />
        <Sk className="h-5 w-44" />
      </div>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="flex gap-4 items-center py-3 border-b border-slate-100 dark:border-slate-800"
        >
          <Sk className="h-14 w-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Sk className="h-3.5 w-40" />
            <Sk className="h-3 w-28" />
            <Sk className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CareerSkeleton() {
  return (
    <div className="px-4 pt-5 space-y-5">
      <div className="flex justify-between items-center">
        <Sk className="h-5 w-48" />
        <Sk className="h-8 w-28 rounded-xl" />
      </div>
      {[0, 1].map(i => (
        <div key={i} className="flex gap-4">
          <Sk className="h-16 w-16 rounded-2xl shrink-0" />
          <div className="flex-1 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-2">
            <Sk className="h-4 w-36" />
            <Sk className="h-3 w-28" />
            <Sk className="h-3 w-20" />
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center pt-2">
        <Sk className="h-5 w-52" />
        <Sk className="h-8 w-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3"
          >
            <Sk className="h-16 w-16 rounded-2xl mx-auto" />
            <Sk className="h-3.5 w-full" />
            <Sk className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialSkeleton() {
  return (
    <div className="px-4 pt-5 space-y-5">
      <Sk className="h-5 w-44 mb-2" />
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-4">
        {[0, 1].map(i => (
          <div key={i} className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Sk className="h-3 w-24" />
              <Sk className="h-7 w-20" />
            </div>
            <Sk className="h-10 w-24 rounded-xl" />
          </div>
        ))}
      </div>
      <Sk className="h-5 w-32 mt-2" />
      <div className="flex gap-4 overflow-hidden">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <Sk className="h-14 w-14 rounded-full" />
            <Sk className="h-3 w-12" />
          </div>
        ))}
      </div>
      <Sk className="h-5 w-40 mt-2" />
      <div className="flex gap-3 overflow-hidden">
        {[0, 1, 2, 3].map(i => (
          <Sk key={i} className="h-28 w-28 rounded-2xl shrink-0" />
        ))}
      </div>
    </div>
  )
}

const TAB_SKELETONS: Record<string, React.ReactNode> = {
  Activities: <ActivitiesSkeleton />,
  Achievements: <AchievementsSkeleton />,
  'Career & Quals': <CareerSkeleton />,
  Social: <SocialSkeleton />,
}

// TabContent — mounts fresh on every tab change (via key={activeTab}).
// Shows a skeleton for SKELETON_MS ms, then fades in real content.
const SKELETON_MS = 380

function TabContent({ tabKey, children }: { tabKey: string; children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), SKELETON_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="animate-tab-content">
      {ready ? children : TAB_SKELETONS[tabKey] ?? children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProfileLayoutProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  onOpenShare: () => void
  onOpenQR: () => void
  onAddGoal: () => void
  onAddCredential: () => void
  onMessage?: () => void
}

// ---------------------------------------------------------------------------
// ProfileLayout
// ---------------------------------------------------------------------------

export function ProfileLayout({
  activeTab,
  onTabChange,
  onOpenShare,
  onOpenQR,
  onAddGoal,
  onAddCredential,
  onMessage,
}: ProfileLayoutProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  const [completionGoal, setCompletionGoal] = useState<{ id: string; title: string } | null>(null)

  function handleInternalTabChange(tab: NavTab) {
    onTabChange(tab)
    setTimeout(() => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <>
      {/* Profile header + bio/actions */}
      <ProfileHeader
        user={mockUser}
        onBack={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMessage={onMessage}
        onShareBio={onOpenShare}
        onQRCode={onOpenQR}
      />

      {/* Currently Training For — always visible above tabs */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
        <TrainingGoalsSection
          goals={mockTrainingGoals}
          onAddGoal={onAddGoal}
          onMarkComplete={(goalId, goalTitle) =>
            setCompletionGoal({ id: goalId, title: goalTitle })
          }
        />
      </div>

      {/* Sticky profile tab strip */}
      <div
        ref={tabsRef}
        className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100/80 dark:border-slate-800/80 flex px-2 gap-1"
      >
        {(['Achievements', 'Activities', 'Career & Quals', 'Social'] as const).map(tab => {
          const label = tab === 'Career & Quals' ? 'Career' : tab
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => handleInternalTabChange(tab)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'relative flex-1 py-3 text-xs font-semibold transition-all duration-200 rounded-none',
                isActive
                  ? 'text-primary-brand'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
              ].join(' ')}
            >
              {label}
              {/* Active indicator — sliding underline */}
              <span
                className={[
                  'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary-brand transition-all duration-300',
                  isActive ? 'w-3/4' : 'w-0',
                ].join(' ')}
              />
            </button>
          )
        })}
      </div>

      {/* Tab content — keyed so TabContent remounts on change (fresh skeleton + fade-in) */}
      <TabContent key={activeTab} tabKey={activeTab}>
        {activeTab === 'Achievements' && (
          <div className="flex flex-col pb-8">
            <div className="px-6 pt-5 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-xl">
                workspace_premium
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Completed Achievements
              </h3>
            </div>
            <AchievementsList achievements={mockAchievements} />
          </div>
        )}

        {activeTab === 'Activities' && <ActivitiesFeed posts={mockActivityPosts} />}

        {activeTab === 'Career & Quals' && (
          <CareerTimeline
            experience={mockExperience}
            certifications={mockCertifications}
            onAddCredential={onAddCredential}
          />
        )}

        {activeTab === 'Social' && (
          <div className="flex flex-col pb-10 space-y-2">
            <div className="px-6 pt-5 pb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-violet-500 text-xl">analytics</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Community Reach</h3>
            </div>
            <ProfileAnalyticsCard />
            <div className="px-6 pt-3 pb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-500 text-xl">group</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Your Squad</h3>
            </div>
            <TrainingSquad />
            <div className="px-6 pt-3 pb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-brand text-xl">
                person_search
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Discover Athletes
              </h3>
            </div>
            <div className="px-4">
              <SuggestedAthletesStrip />
            </div>
          </div>
        )}
      </TabContent>

      {/* ── Completion Celebration Modal ── */}
      <CompletionCelebrationModal
        open={!!completionGoal}
        goalTitle={completionGoal?.title ?? ''}
        onClose={() => setCompletionGoal(null)}
        onLogAchievement={() => {
          setCompletionGoal(null)
          onAddGoal()
        }}
      />
    </>
  )
}

// Re-export for convenience so App.tsx can still derive share props from these
export { mockTrainingGoals, mockCertifications }
