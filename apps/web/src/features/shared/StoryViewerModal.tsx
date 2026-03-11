import React, { useEffect, useState } from 'react'

interface StoryViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  imageUrl: string
}

export function StoryViewerModal({ isOpen, onClose, title, imageUrl }: StoryViewerModalProps) {
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!isOpen) setIsLiked(false)
  }, [isOpen])

  if (!isOpen) return null

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      alert('Message sent to ' + title)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex justify-center items-center animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full h-full md:h-[90vh] md:max-w-[400px] md:rounded-2xl overflow-hidden bg-black flex flex-col shadow-2xl">
        {/* Progress / header strip */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="flex gap-1 p-4 pt-safe">
            <div className="h-1 flex-1 rounded-full bg-white" />
            <div className="h-1 flex-1 rounded-full bg-white/30" />
            <div className="h-1 flex-1 rounded-full bg-white/30" />
          </div>

          <div className="px-4 pb-3 flex items-center justify-between">
            <div className="text-white font-bold text-sm drop-shadow-md line-clamp-1">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full"
              aria-label="Close story"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Story image */}
        <div className="flex-1 min-h-0">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
        </div>

        {/* Comment / react bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent pb-safe">
          <div className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2.5 flex items-center focus-within:bg-white/30 transition-colors">
            <input
              type="text"
              placeholder="Send message..."
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/80 focus:ring-0 text-sm"
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="active:scale-90 transition-transform drop-shadow-lg"
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <span
              className={`material-symbols-outlined text-3xl ${
                isLiked ? 'text-red-500 fill-red-500 animate-in zoom-in duration-200' : 'text-white'
              }`}
            >
              favorite
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
