interface AlbumThumb {
  id: string
  title: string
  imageUrl?: string
}

const mockAlbumThumbs: AlbumThumb[] = [
  { id: 'all', title: 'All' },
  {
    id: 'alb-cycling',
    title: 'Cycling',
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
  {
    id: 'alb-running',
    title: 'Running',
    imageUrl:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
  {
    id: 'alb-climbing',
    title: 'Climbing',
    imageUrl:
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=85&w=1080&h=1080',
  },
]

interface AlbumsSidebarProps {
  selectedAlbumId: string
  onSelectAlbum: (id: string) => void
}

export function AlbumsSidebar({ selectedAlbumId, onSelectAlbum }: AlbumsSidebarProps) {
  return (
    <div className="flex flex-col gap-1 px-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Albums
        </h3>
        <button
          type="button"
          className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-brand/10 text-primary-brand hover:bg-primary-brand/20 transition-colors"
          onClick={() => alert('Add new album')}
          aria-label="Add album"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
        </button>
      </div>

      {/* Album list */}
      {mockAlbumThumbs.map(album => (
        <AlbumRow
          key={album.id}
          album={album}
          isSelected={album.id === selectedAlbumId}
          onSelect={onSelectAlbum}
        />
      ))}

      {/* Show all photos */}
      <button
        type="button"
        className="mt-1 px-4 text-xs font-semibold text-primary-brand hover:underline text-left"
        onClick={() => alert('Show all photos')}
      >
        Show all →
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Album row item
// ---------------------------------------------------------------------------

interface AlbumRowProps {
  album: AlbumThumb
  isSelected: boolean
  onSelect: (id: string) => void
}

function AlbumRow({ album, isSelected, onSelect }: AlbumRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(album.id)}
      aria-pressed={isSelected}
      className={[
        'flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all text-left',
        isSelected
          ? 'bg-primary-brand/10 text-primary-brand'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
      ].join(' ')}
    >
      {/* Thumbnail */}
      <div
        className={[
          'w-9 h-9 rounded-lg bg-cover bg-center shrink-0 shadow-sm',
          album.imageUrl ? '' : 'bg-primary-brand/20 flex items-center justify-center',
        ].join(' ')}
        style={album.imageUrl ? { backgroundImage: `url('${album.imageUrl}')` } : undefined}
        role="img"
        aria-label={album.title}
      >
        {!album.imageUrl && (
          <span className="material-symbols-outlined text-primary-brand text-[16px]">
            photo_library
          </span>
        )}
      </div>

      {/* Title */}
      <span
        className={[
          'text-sm font-semibold truncate',
          isSelected ? 'text-primary-brand' : 'text-slate-800 dark:text-slate-200',
        ].join(' ')}
      >
        {album.title}
      </span>

      {isSelected && (
        <span className="ml-auto material-symbols-outlined text-primary-brand text-[16px] shrink-0">
          chevron_right
        </span>
      )}
    </button>
  )
}
