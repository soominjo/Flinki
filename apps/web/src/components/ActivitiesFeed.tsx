import { useState } from 'react'
import { ActivityCard } from './ActivityCard'
import type { Activity } from '../lib/mockData'

interface ActivitiesFeedProps {
  activities: Activity[]
}

export function ActivitiesFeed({ activities }: ActivitiesFeedProps) {
  const [postText, setPostText] = useState('')
  const [posted, setPosted] = useState(false)

  function handlePost() {
    if (!postText.trim()) return
    setPosted(true)
    setPostText('')
    setTimeout(() => setPosted(false), 2500)
  }

  return (
    <div className="px-4 py-3 flex flex-col gap-3">
      {/* Quick Post box */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm flex flex-col gap-2 transition-[border-color,box-shadow] duration-150 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
        <div className="flex items-center gap-2.5">
          {/* Author avatar */}
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[11px] font-semibold">
            AR
          </div>
          <input
            type="text"
            value={postText}
            onChange={e => setPostText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePost()}
            placeholder="Share an update, milestone, or run…"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
          />
        </div>

        {/* Post button row */}
        <div className="flex justify-end">
          <button
            onClick={handlePost}
            disabled={!postText.trim()}
            className={[
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
              postText.trim()
                ? 'bg-violet-600 text-white hover:bg-violet-700 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            {posted ? '✓ Posted!' : 'Post'}
          </button>
        </div>
      </div>

      {/* Activity cards */}
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
