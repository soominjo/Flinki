import { useRef, useState } from 'react'
import { AchievementsList } from './AchievementsList'
import { ActivitiesFeed } from './ActivitiesFeed'
import { CareerTimeline } from './CareerTimeline'
import type { Achievement, Activity, CareerItem } from '../lib/mockData'

type Tab = 'Achievements' | 'Activity' | 'Career'

const TABS: Tab[] = ['Achievements', 'Activity', 'Career']

const tabIcons: Record<Tab, React.ReactNode> = {
  Achievements: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Activity: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  ),
  Career: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
}

interface ProfileTabsProps {
  achievements: Achievement[]
  activities: Activity[]
  careerItems: CareerItem[]
}

export function ProfileTabs({ achievements, activities, careerItems }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Achievements')
  const wrapperRef = useRef<HTMLDivElement>(null)

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    // Scroll the tab bar into view when switching so content doesn't appear
    // stranded below the fold on a short tab after being scrolled deep in a long one.
    wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div ref={wrapperRef}>
      {/* Sticky tab navigation bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-[0_1px_0_0_#f3f4f6]">
        <div className="flex">
          {TABS.map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={[
                  'relative flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400',
                  isActive ? 'text-violet-700' : 'text-gray-400 hover:text-gray-600',
                ].join(' ')}
              >
                {tabIcons[tab]}
                {tab}
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-violet-600" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content — min-h keeps the frame stable when switching between short/tall tabs */}
      <div className="min-h-[320px]">
        {activeTab === 'Achievements' && <AchievementsList achievements={achievements} />}
        {activeTab === 'Activity' && <ActivitiesFeed activities={activities} />}
        {activeTab === 'Career' && <CareerTimeline items={careerItems} />}
      </div>
    </div>
  )
}
