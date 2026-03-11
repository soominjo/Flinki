import type { Achievement } from '../lib/mockData'
import { AchievementWaterfall } from '../features/achievements/AchievementWaterfall'

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      {achievements.map(ach => (
        <AchievementWaterfall key={ach.id} achievement={ach} />
      ))}
    </div>
  )
}
