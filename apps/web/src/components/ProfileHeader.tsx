import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/Avatar'
import type { UserProfile } from '../lib/mockData'

interface ProfileHeaderProps {
  user: UserProfile
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="w-full">
      {/* Cover Photo */}
      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600">
        {user.coverUrl && (
          <img src={user.coverUrl} alt="Cover" className="h-full w-full object-cover" />
        )}
        {/* subtle texture overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Profile Identity Section */}
      <div className="px-4 pb-3">
        {/* Avatar — overlaps the cover photo */}
        <div className="-mt-10 mb-2">
          <Avatar className="h-20 w-20 ring-4 ring-white shadow-md">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-violet-100 text-violet-700 text-xl font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <h1 className="text-xl font-bold text-gray-900 leading-tight">{user.name}</h1>

        {/* Tags */}
        {user.tags.length > 0 && (
          <p className="mt-0.5 text-sm text-gray-500 font-medium">{user.tags.join(' • ')}</p>
        )}

        {/* Location */}
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{user.location}</span>
        </div>
      </div>
    </div>
  )
}
