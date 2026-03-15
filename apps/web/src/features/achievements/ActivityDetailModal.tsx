// ---------------------------------------------------------------------------
// ActivityDetailModal — Level 2 detail view for a single training session
// Opens when a user taps a session node in the AchievementWaterfall timeline
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Data types & mock data
// ---------------------------------------------------------------------------

export interface TrainingSession {
  id: string
  date: string // e.g. "Apr 21, 2024"
  activityType: string // e.g. "Race Day", "Long Run"
  icon: string // material symbol name
  distance?: string
  duration?: string
  deviceSync?: 'Flinki'
  photos?: string[] // image URLs
  notes?: string
}

export const TRAINING_SESSIONS: Record<string, TrainingSession[]> = {
  'ach-1': [
    {
      id: 'ts-1-1',
      date: 'Apr 21, 2024',
      activityType: 'Race Day',
      icon: 'emoji_events',
      distance: '42.2 km',
      duration: '2:58:32',
      deviceSync: 'Flinki',
      photos: [
        'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&q=85&w=800&h=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=85&w=800&h=600',
      ],
      notes:
        'London Marathon 2024. Hit my sub-3 goal despite heavy rain in the final 10K. Crossed Tower Bridge feeling strong.',
    },
    {
      id: 'ts-1-2',
      date: 'Apr 14, 2024',
      activityType: 'Long Run',
      icon: 'directions_run',
      distance: '32 km',
      duration: '3:12:00',
      deviceSync: 'Flinki',
      notes:
        'Last big effort before taper. Felt controlled — held marathon pace for the final 10K.',
    },
    {
      id: 'ts-1-3',
      date: 'Apr 7, 2024',
      activityType: 'Interval Session',
      icon: 'speed',
      distance: '14 km',
      duration: '1:10:00',
      deviceSync: 'Flinki',
      notes: '6 × 1 mile repeats at 4:05/km. Confidence booster heading into race week.',
    },
    {
      id: 'ts-1-4',
      date: 'Mar 24, 2024',
      activityType: 'Long Run',
      icon: 'directions_run',
      distance: '35 km',
      duration: '3:30:00',
      deviceSync: 'Flinki',
      notes: 'Peak week longest effort. Legs heavy by km 28 but pushed through.',
    },
    {
      id: 'ts-1-5',
      date: 'Mar 10, 2024',
      activityType: 'Tempo Run',
      icon: 'speed',
      distance: '18 km',
      duration: '1:28:00',
      deviceSync: 'Flinki',
      notes: '12 km at threshold effort. HR stayed in zone 4 throughout.',
    },
  ],
  'ach-2': [
    {
      id: 'ts-2-1',
      date: 'Aug 30, 2024',
      activityType: 'Race Day',
      icon: 'emoji_events',
      distance: '50 km',
      duration: '7:42:11',
      deviceSync: 'Flinki',
      photos: [
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=85&w=800&h=600',
      ],
      notes:
        'UTMB 50K. Top 200 finish. The Col du Bonhomme section was brutal but the views were worth every step.',
    },
    {
      id: 'ts-2-2',
      date: 'Aug 18, 2024',
      activityType: 'Trail Long Run',
      icon: 'landscape',
      distance: '28 km',
      duration: '3:55:00',
      deviceSync: 'Flinki',
      notes: 'Race-simulation effort on hilly trails near Chamonix. Practised nutrition strategy.',
    },
    {
      id: 'ts-2-3',
      date: 'Aug 4, 2024',
      activityType: 'Trail Run',
      icon: 'landscape',
      distance: '22 km',
      duration: '2:50:00',
      deviceSync: 'Flinki',
      notes: 'Technical descent practice. Quad strength holding up well.',
    },
    {
      id: 'ts-2-4',
      date: 'Jul 21, 2024',
      activityType: 'Back-to-Back Long Run',
      icon: 'directions_run',
      distance: '20 km',
      duration: '2:35:00',
      deviceSync: 'Flinki',
      notes: 'Day 2 of back-to-back long run weekend. Simulating fatigued-leg race conditions.',
    },
  ],
  'ach-3': [
    {
      id: 'ts-3-1',
      date: 'May 20, 2024',
      activityType: 'Fingerboard Session',
      icon: 'fitness_center',
      duration: '1:30:00',
      deviceSync: 'Flinki',
      notes: 'Day 30. 7/3 hangs on 18mm edge. Measurable strength improvement over the month.',
    },
    {
      id: 'ts-3-2',
      date: 'May 13, 2024',
      activityType: 'Bouldering Session',
      icon: 'landscape',
      duration: '2:00:00',
      deviceSync: 'Flinki',
      notes: 'Sent a V6 that had been a project for two weeks. Footwork clicked finally.',
    },
    {
      id: 'ts-3-3',
      date: 'May 6, 2024',
      activityType: 'Lead Climbing',
      icon: 'landscape',
      duration: '1:45:00',
      deviceSync: 'Flinki',
      notes: '5.11c onsight. Feeling confident on crimps.',
    },
    {
      id: 'ts-3-4',
      date: 'Apr 29, 2024',
      activityType: 'Hangboard + Core',
      icon: 'fitness_center',
      duration: '1:15:00',
      deviceSync: 'Flinki',
      notes: 'Focused accessory work: 3-finger drag, pinch, and antagonist training.',
    },
    {
      id: 'ts-3-5',
      date: 'Apr 21, 2024',
      activityType: 'Bouldering Session',
      icon: 'landscape',
      duration: '1:30:00',
      deviceSync: 'Flinki',
      notes: 'Day 1 of the 30-day streak. Set the intention to train every day through May.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Helper — device sync badge config
// ---------------------------------------------------------------------------

const DEVICE_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Flinki: {
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800',
    icon: 'monitoring',
  },
}

// ---------------------------------------------------------------------------
// ActivityDetailModal component
// ---------------------------------------------------------------------------

interface ActivityDetailModalProps {
  session: TrainingSession
  onClose: () => void
}

export function ActivityDetailModal({ session, onClose }: ActivityDetailModalProps) {
  const device = session.deviceSync ? DEVICE_CONFIG[session.deviceSync] : null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Sheet */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="h-10 w-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary-brand text-[20px]">
              {session.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight truncate">
              {session.activityType}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{session.date}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-slate-500 text-[18px]">close</span>
          </button>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          {/* Stats grid */}
          {(session.distance || session.duration) && (
            <div className="px-5 pt-5">
              <div className="grid grid-cols-2 gap-3">
                {session.distance && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary-brand text-[16px]">
                        route
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Distance
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      {session.distance}
                    </p>
                  </div>
                )}
                {session.duration && (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3.5 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary-brand text-[16px]">
                        timer
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Duration
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                      {session.duration}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Device sync badge */}
          {device && session.deviceSync && (
            <div className="px-5 pt-4">
              <div
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 ${device.bg}`}
              >
                <span className={`material-symbols-outlined text-[15px] ${device.color}`}>
                  {device.icon}
                </span>
                <span className={`text-[11px] font-bold ${device.color}`}>
                  {session.deviceSync}
                </span>
                <span className={`text-[10px] font-semibold opacity-70 ${device.color}`}>
                  · Synced
                </span>
                {/* L3 trust pill */}
                <span className="ml-1 text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                  L3
                </span>
              </div>
            </div>
          )}

          {/* Photos */}
          {session.photos && session.photos.length > 0 && (
            <div className="px-5 pt-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="material-symbols-outlined text-slate-400 text-[15px]">
                  photo_library
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Photos
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {session.photos.map((url, i) => (
                  <div
                    key={i}
                    className="shrink-0 h-36 w-52 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800"
                  >
                    <img
                      src={url}
                      alt={`Session photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {session.notes && (
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-[15px]">notes</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Notes
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {session.notes}
              </p>
            </div>
          )}

          <div className="h-4" />
        </div>

        {/* ── Footer close button ─────────────────────────────────────────── */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
