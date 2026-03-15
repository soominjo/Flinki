interface ImagePreviewModalProps {
  imageUrl: string | null
  onClose: () => void
}

export function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  if (!imageUrl) return null

  return (
    <div
      className="fixed inset-0 z-viewer bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-slate-300 z-10 cursor-pointer p-2"
        aria-label="Close preview"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <img
        src={imageUrl}
        alt="Preview"
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}
