import type { Album } from '../lib/mockData'

interface AlbumThumbProps {
  album: Album
}

function AlbumThumb({ album }: AlbumThumbProps) {
  // Shorten title for label
  const shortTitle = album.title.length > 10 ? album.title.slice(0, 10) + '…' : album.title

  return (
    <div className="flex flex-col items-center gap-1.5 snap-start shrink-0 w-[72px]">
      {/* Circular gradient thumbnail */}
      <div
        className={`w-[72px] h-[72px] rounded-full bg-gradient-to-br ${album.gradient} flex items-center justify-center text-2xl shadow-md ring-2 ring-white`}
      >
        {album.coverEmoji}
      </div>
      {/* Album title */}
      <span className="text-[10px] text-gray-600 font-medium text-center leading-tight w-full truncate px-0.5">
        {shortTitle}
      </span>
      {/* Item count */}
      <span className="text-[9px] text-gray-400 -mt-1">{album.itemCount} items</span>
    </div>
  )
}

interface VisualAlbumsProps {
  albums: Album[]
}

export function VisualAlbums({ albums }: VisualAlbumsProps) {
  return (
    <section className="px-4 pt-4 pb-2">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Visual Albums</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1">
        {/* "Add Album" button — always first */}
        <div className="flex flex-col items-center gap-1.5 snap-start shrink-0 w-[72px]">
          <button
            className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-colors"
            aria-label="Add album"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <span className="text-[10px] text-gray-400 font-medium">Add</span>
          <span className="text-[9px] text-transparent -mt-1">·</span>
        </div>

        {albums.map(album => (
          <AlbumThumb key={album.id} album={album} />
        ))}
      </div>
    </section>
  )
}
