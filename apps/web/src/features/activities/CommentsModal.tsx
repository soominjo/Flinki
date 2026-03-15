interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
}

const dummyComments = [
  {
    id: 'c1',
    name: 'Jordan Lee',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    text: 'Solid pace! That final climb is no joke.',
  },
  {
    id: 'c2',
    name: 'Sam Chen',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    text: 'Congrats on the PR. See you at the next group run?',
  },
  {
    id: 'c3',
    name: 'Alex Rivera',
    avatarUrl:
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=80&h=80&q=80',
    text: 'Thanks both! Jordan – definitely feeling that climb today.',
  },
]

export function CommentsModal({ isOpen, onClose }: CommentsModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 flex items-end md:items-center justify-center"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="absolute bottom-0 w-full md:relative md:w-full md:max-w-md md:rounded-2xl bg-white dark:bg-slate-900 rounded-t-3xl h-[70vh] md:h-[60vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comments-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 id="comments-title" className="text-lg font-bold text-slate-900 dark:text-white">
            Comments
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
            aria-label="Close comments"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable comments */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {dummyComments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div
                className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url('${comment.avatarUrl}')` }}
                role="img"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {comment.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky input */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shrink-0">
          <div
            className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=80&h=80&q=80')`,
            }}
            role="img"
            aria-hidden
          />
          <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0"
            />
            <button
              type="button"
              className="text-sm font-bold text-primary-brand hover:underline"
              onClick={() => alert('Comment posted!')}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
