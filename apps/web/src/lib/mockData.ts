// =============================================================================
// Mock Data for Flinki Prototype
// =============================================================================

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  imageUrl?: string
  unlockedAt: string
  category: 'skill' | 'milestone' | 'social'
}

export interface ActivityStat {
  label: string
  value: string
}

export interface Activity {
  id: string
  type: 'connection' | 'achievement' | 'goal' | 'post' | 'endorsement' | 'workout'
  actor: string
  actorAvatar?: string
  actorInitials?: string
  message: string
  timeAgo: string
  stats?: ActivityStat[]
  imageCount?: number // number of placeholder images in the carousel
  imageGradients?: string[] // Tailwind gradient classes per image
  kudos?: number // initial kudos count
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number // 0-100
  deadline: string
  category: 'career' | 'skill' | 'education' | 'personal'
  status: 'active' | 'completed' | 'paused'
}

export interface Album {
  id: string
  title: string
  itemCount: number
  gradient: string // Tailwind gradient classes
  coverEmoji: string
}

export interface CareerItem {
  id: string
  company: string
  role: string
  logoUrl?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
  skills: string[]
}

export interface UserProfile {
  id: string
  name: string
  username: string
  headline: string
  tags: string[]
  avatarUrl?: string
  coverUrl?: string
  location: string
  connections: number
  level: number
  xp: number
  xpToNextLevel: number
}

// ---------------------------------------------------------------------------

export const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Alex Rivera',
  username: 'alexrivera',
  headline: 'Product Designer · Building the future of work',
  tags: ['Marathoner', 'Climber', 'Designer'],
  avatarUrl:
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=85&w=800&h=800',
  coverUrl:
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=85&w=1920&h=640',
  location: 'Austin, TX',
  connections: 312,
  level: 14,
  xp: 2340,
  xpToNextLevel: 3000,
}

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'London Marathon Finisher',
    description:
      "Completed the iconic London Marathon in under 3 hours, battling intense rain in the final 10K. One of the six World Marathon Majors—crossing the Tower Bridge and the Mall with the crowd roaring is something I'll never forget.",
    icon: '🏅',
    imageUrl:
      'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&q=85&w=1080&h=1080',
    unlockedAt: '2024-04-21',
    category: 'milestone',
  },
  {
    id: 'ach-2',
    title: 'UTMB 50K Finisher',
    description:
      "Conquered 50km of rugged Mont Blanc trails in one of the world's most prestigious ultra races. The altitude, the technical descents, and the camaraderie at every aid station made it the hardest and most rewarding day on the trails.",
    icon: '⛰️',
    imageUrl:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=85&w=1080&h=1080',
    unlockedAt: '2024-08-30',
    category: 'milestone',
  },
  {
    id: 'ach-3',
    title: 'Consistent Climber',
    description:
      'Logged training for 30 days straight without missing a session. Morning hangs, evening fingerboards, and weekend sends—every day added up to stronger fingers and a clearer head.',
    icon: '🔥',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=85&w=1080&h=1080',
    unlockedAt: '2024-05-20',
    category: 'milestone',
  },
  {
    id: 'ach-4',
    title: 'First Connection',
    description:
      'Made your first professional connection on Flinki. That single tap opened the door to training partners, race tips, and a community that actually shows up.',
    icon: '🤝',
    imageUrl:
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=85&w=1080&h=1080',
    unlockedAt: '2024-01-15',
    category: 'social',
  },
  {
    id: 'ach-5',
    title: 'Endorsed',
    description:
      'Received your first skill endorsement from a fellow athlete. Having someone vouch for your pacing, navigation, or coaching means more than any badge.',
    icon: '⭐',
    imageUrl:
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=85&w=1080&h=1080',
    unlockedAt: '2024-06-01',
    category: 'social',
  },
]

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'workout',
    actor: 'Alex Rivera',
    actorInitials: 'AR',
    message: 'Morning trail run — Barton Creek Greenbelt 🌄',
    timeAgo: '2h ago',
    kudos: 14,
    stats: [
      { label: 'Distance', value: '8.4 km' },
      { label: 'Time', value: '52:18' },
      { label: 'Pace', value: '6:14 /km' },
      { label: 'Elev.', value: '210 m' },
    ],
    imageCount: 3,
    imageGradients: [
      'from-orange-300 to-rose-400',
      'from-amber-300 to-yellow-400',
      'from-green-300 to-teal-400',
    ],
  },
  {
    id: 'act-2',
    type: 'achievement',
    actor: 'You',
    actorInitials: 'AR',
    message: 'Unlocked "Goal Crusher" — completed 5 goals this quarter. 🎯',
    timeAgo: '1h ago',
    kudos: 6,
  },
  {
    id: 'act-3',
    type: 'post',
    actor: 'Morgan Chen',
    actorInitials: 'MC',
    message:
      'Just wrapped up a weekend climb at Enchanted Rock. The views from the top never get old. 🧗‍♂️',
    timeAgo: '5h ago',
    kudos: 31,
    imageCount: 2,
    imageGradients: ['from-sky-300 to-indigo-400', 'from-violet-300 to-purple-500'],
  },
  {
    id: 'act-4',
    type: 'endorsement',
    actor: 'Sam Torres',
    actorInitials: 'ST',
    message: 'Sam Torres endorsed you for UX Research. 👏',
    timeAgo: '3h ago',
    kudos: 4,
  },
  {
    id: 'act-5',
    type: 'workout',
    actor: 'Jordan Lee',
    actorInitials: 'JL',
    message: 'Brick session done — bike → run combo this morning 💪',
    timeAgo: 'Yesterday',
    kudos: 22,
    stats: [
      { label: 'Bike', value: '32 km' },
      { label: 'Run', value: '5 km' },
      { label: 'Total', value: '1h 48m' },
      { label: 'Cal.', value: '890' },
    ],
  },
  {
    id: 'act-6',
    type: 'goal',
    actor: 'You',
    actorInitials: 'AR',
    message: 'Updated progress on "Launch Portfolio v3" → 65% complete.',
    timeAgo: 'Yesterday',
    kudos: 3,
  },
]

export const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Launch Portfolio v3',
    description: 'Redesign and launch my personal portfolio with new case studies.',
    progress: 65,
    deadline: '2025-07-31',
    category: 'career',
    status: 'active',
  },
  {
    id: 'goal-2',
    title: 'Complete Figma Advanced Course',
    description: 'Finish all modules in the Figma Advanced Design course.',
    progress: 90,
    deadline: '2025-05-15',
    category: 'skill',
    status: 'active',
  },
  {
    id: 'goal-3',
    title: 'Read 12 Books This Year',
    description: 'One book per month focused on design, psychology, and business.',
    progress: 42,
    deadline: '2025-12-31',
    category: 'personal',
    status: 'active',
  },
  {
    id: 'goal-4',
    title: 'Get UX Certification',
    description: 'Complete the Google UX Design Certificate on Coursera.',
    progress: 100,
    deadline: '2024-11-01',
    category: 'education',
    status: 'completed',
  },
]

export const mockCareerItems: CareerItem[] = [
  {
    id: 'career-1',
    company: 'Hytel',
    role: 'Senior Product Designer',
    startDate: 'Jan 2023',
    isCurrent: true,
    description: 'Leading design for the core product experience across web and mobile platforms.',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
  },
  {
    id: 'career-2',
    company: 'Bright Studio',
    role: 'Product Designer',
    startDate: 'Jun 2020',
    endDate: 'Dec 2022',
    isCurrent: false,
    description: 'Designed end-to-end experiences for B2B SaaS clients across fintech and edtech.',
    skills: ['Sketch', 'Figma', 'Usability Testing', 'Wireframing'],
  },
  {
    id: 'career-3',
    company: 'Freelance',
    role: 'UI/UX Designer',
    startDate: 'Mar 2018',
    endDate: 'May 2020',
    isCurrent: false,
    description: 'Worked with early-stage startups to establish brand identity and product design.',
    skills: ['Branding', 'UI Design', 'Adobe XD'],
  },
]

export const mockAlbums: Album[] = [
  {
    id: 'album-1',
    title: 'Trail Runs',
    itemCount: 24,
    gradient: 'from-orange-400 to-rose-500',
    coverEmoji: '🏃',
  },
  {
    id: 'album-2',
    title: 'Summit Days',
    itemCount: 11,
    gradient: 'from-sky-400 to-indigo-500',
    coverEmoji: '🧗',
  },
  {
    id: 'album-3',
    title: 'Austin Life',
    itemCount: 38,
    gradient: 'from-amber-400 to-yellow-300',
    coverEmoji: '🌆',
  },
  {
    id: 'album-4',
    title: 'Design Work',
    itemCount: 17,
    gradient: 'from-violet-400 to-purple-600',
    coverEmoji: '🎨',
  },
  {
    id: 'album-5',
    title: 'Reading Log',
    itemCount: 9,
    gradient: 'from-emerald-400 to-teal-500',
    coverEmoji: '📖',
  },
]
