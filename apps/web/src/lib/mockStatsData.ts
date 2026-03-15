export interface PersonalBest {
  id: string
  sport: string
  time: string
  icon: string
  verified: boolean
  theme: string
  date: string
  source: string
}

export const personalBests: PersonalBest[] = [
  {
    id: 'pr-1',
    sport: 'Marathon',
    time: '2:55:10',
    icon: 'directions_run',
    verified: true,
    theme: 'from-primary via-indigo-400 to-emerald-400',
    date: 'Oct 6, 2024',
    source: 'Berlin Marathon — Official Chip Time',
  },
  {
    id: 'pr-2',
    sport: '5K Run',
    time: '18:42',
    icon: 'directions_run',
    verified: true,
    theme: 'from-primary/30 to-indigo-200',
    date: 'Mar 15, 2025',
    source: 'Parkrun — GPS Verified',
  },
  {
    id: 'pr-3',
    sport: '100K Cycle',
    time: '3:12:05',
    icon: 'directions_bike',
    verified: true,
    theme: 'from-primary/30 to-indigo-200',
    date: 'Jul 22, 2024',
    source: 'Strava — Auto-Detected',
  },
]

export const gearLocker = [
  {
    id: 'gear-1',
    brand: 'Nike',
    model: 'Alphafly 3',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150&q=80',
    currentMetric: 350,
    maxMetric: 800,
    metricUnit: 'km cap',
    color: 'bg-primary',
  },
  {
    id: 'gear-2',
    brand: 'Specialized',
    model: 'Tarmac SL8',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=150&q=80',
    currentMetric: 1240,
    maxMetric: 5000,
    metricUnit: 'km cap',
    color: 'bg-primary',
  },
  {
    id: 'gear-3',
    brand: 'Salomon',
    model: 'S/Lab Sense 8 Set',
    image: 'https://images.unsplash.com/photo-1622126807280-5b96d3c6c97c?w=150&q=80',
    currentMetric: 18,
    maxMetric: 50,
    metricUnit: 'races used',
    color: 'bg-sky-500',
  },
]
