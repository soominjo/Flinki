import type { CareerItem } from '../lib/mockData'

function getCompanyInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const companyColors = [
  'from-violet-500 to-indigo-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-rose-500',
]

interface CareerTimelineProps {
  items: CareerItem[]
}

export function CareerTimeline({ items }: CareerTimelineProps) {
  return (
    <div className="px-4 py-3">
      <div className="relative flex flex-col gap-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const colorClass = companyColors[index % companyColors.length]

          return (
            <div key={item.id} className="flex gap-3">
              {/* Timeline spine */}
              <div className="flex flex-col items-center">
                {/* Company logo circle */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorClass} text-white text-xs font-bold shadow-md`}
                >
                  {getCompanyInitials(item.company)}
                </div>
                {/* Vertical connector line */}
                {!isLast && (
                  <div className="w-px flex-1 bg-gray-200 my-1" style={{ minHeight: '24px' }} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 min-w-0 ${isLast ? 'pb-2' : 'pb-5'}`}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{item.role}</p>
                    <p className="text-xs text-gray-500">{item.company}</p>
                  </div>
                  {item.isCurrent && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Current
                    </span>
                  )}
                </div>

                {/* Dates */}
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {item.startDate} — {item.isCurrent ? 'Present' : item.endDate}
                </p>

                {/* Description */}
                <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{item.description}</p>

                {/* Skills chips */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.skills.map(skill => (
                    <span
                      key={skill}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-600 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Certificate link placeholder */}
                {item.isCurrent === false && (
                  <button className="mt-2 flex items-center gap-1 text-[11px] text-violet-500 hover:text-violet-700 font-medium transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" />
                      <path d="M9 11.2h5.7" />
                    </svg>
                    View Certificate
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
