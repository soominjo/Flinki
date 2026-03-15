import { useState } from 'react'
import './style.css'

import { BottomNav } from './features/navigation/BottomNav'
import type { NavTab } from './features/navigation/BottomNav'
import { AlbumsSidebar } from './features/sidebar/AlbumsSidebar'
import { PerformanceDashboard } from './features/stats/PerformanceDashboard'
import type { YearStats } from './features/stats/PerformanceDashboard'
import { ProfileLayout, mockTrainingGoals } from './features/profile/ProfileLayout'
import { ShareModal, type ShareModalView } from './features/shared/ShareModal'
import { AddAchievementModal } from './features/achievements/AddAchievementModal'
import { Toaster } from './features/shared/Toaster'

import { mockUser, mockAchievements } from './lib/mockData'
import { DirectMessageDrawer } from './features/messaging/DirectMessageDrawer'
import { MessageInbox } from './features/messaging/MessageInbox'
import { NotificationsPanel } from './features/notifications/NotificationsPanel'

// ---------------------------------------------------------------------------
// Mock data — Performance Dashboard
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
        name: 'Salomon Active Skin 8',
        metricLabel: '12 races',
        capLabel: 'Est. 30 race life',
        progress: 40,
        progressColor: 'bg-primary-brand',
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('Achievements')
  const [selectedAlbumId, setSelectedAlbumId] = useState('all')
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareInitialView, setShareInitialView] = useState<ShareModalView>('options')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDMOpen, setIsDMOpen] = useState(false)
  const [isInboxOpen, setIsInboxOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  function handleTabChange(tab: NavTab) {
    if (tab === 'Train') {
      setIsAddOpen(true)
    } else if (tab === 'Messages') {
      setIsInboxOpen(true)
    } else if (tab === 'Notifications') {
      setIsNotificationsOpen(true)
    } else {
      setActiveTab(tab)
    }
  }

  const centerContent =
    activeTab === 'Stats' ? (
      <PerformanceDashboard
        statsByYear={mockStatsByYear}
        onBack={() => setActiveTab('Achievements')}
      />
    ) : (
      <ProfileLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenShare={() => {
          setShareInitialView('options')
          setIsShareOpen(true)
        }}
        onOpenQR={() => {
          setShareInitialView('qr')
          setIsShareOpen(true)
        }}
        onAddGoal={() => setIsAddOpen(true)}
        onAddCredential={() => setIsAddOpen(true)}
        onMessage={() => setIsDMOpen(true)}
      />
    )

  return (
    <div className="min-h-screen bg-background-light dark:bg-slate-900 font-display md:grid md:grid-cols-[80px_1fr] lg:grid-cols-[280px_minmax(auto,900px)] lg:justify-center mx-auto">
      {/* Left column — unified sidebar (nav + albums slot) on md+, fixed bottom bar on mobile */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        notificationCount={notificationCount}
        desktopBottomContent={
          <AlbumsSidebar selectedAlbumId={selectedAlbumId} onSelectAlbum={setSelectedAlbumId} />
        }
      />

      {/* Center column — profile or stats */}
      <div className="w-full max-w-[900px] mx-auto min-h-screen border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col pb-16 md:pb-0">
        {centerContent}
      </div>

      {/* Overlays */}
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
        topAchievement={{
          title: mockAchievements[0].title,
          result: '2:58:32',
          imageUrl: mockAchievements[0].imageUrl,
          icon: mockAchievements[0].icon,
        }}
      />

      <AddAchievementModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={data => {
          console.log('New achievement submitted:', data)
          setIsAddOpen(false)
        }}
      />

      <MessageInbox
        open={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        onOpenThread={() => {
          setIsInboxOpen(false)
          setIsDMOpen(true)
        }}
      />

      <NotificationsPanel
        open={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onUnreadCountChange={setNotificationCount}
      />

      <DirectMessageDrawer open={isDMOpen} onClose={() => setIsDMOpen(false)} user={mockUser} />

      <Toaster />
    </div>
  )
}
