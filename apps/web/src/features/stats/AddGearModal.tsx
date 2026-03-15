import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { showToast } from '../shared/Toaster'

interface AddGearModalProps {
  isOpen: boolean
  onClose: () => void
}

const fieldClass =
  'bg-slate-100 dark:bg-slate-800 rounded-xl p-3 w-full border-none outline-none text-sm ' +
  'text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ' +
  'focus:ring-2 focus:ring-primary-brand'

export function AddGearModal({ isOpen, onClose }: AddGearModalProps) {
  const [hasPhoto, setHasPhoto] = useState(false)
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [lifespan, setLifespan] = useState('')
  const [unit, setUnit] = useState('km')
  const [isSaving, setIsSaving] = useState(false)

  const canAdd = brand.trim().length > 0 && model.trim().length > 0

  useEffect(() => {
    if (!isOpen) {
      setHasPhoto(false)
      setBrand('')
      setModel('')
      setLifespan('')
      setUnit('km')
      setIsSaving(false)
    }
  }, [isOpen])

  function handleAdd() {
    if (!canAdd || isSaving) return
    setIsSaving(true)
    setTimeout(() => {
      showToast(`${brand.trim()} ${model.trim()} added to your locker!`)
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-overlay bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-2xl flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-gear-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="add-gear-title" className="text-lg font-bold text-slate-900 dark:text-white">
            Add to Gear Locker
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Photo upload */}
        <div className="mb-5">
          {!hasPhoto ? (
            <button
              type="button"
              onClick={() => setHasPhoto(true)}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-8 text-slate-500 hover:border-primary-brand hover:bg-primary-brand/5 hover:text-primary-brand dark:hover:bg-primary-brand/10 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
              <span className="text-sm font-medium">Upload Gear Photo</span>
            </button>
          ) : (
            <div className="flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-primary-brand overflow-hidden cursor-pointer"
                onClick={() => setHasPhoto(false)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setHasPhoto(false)
                  }
                }}
                aria-label="Remove photo"
              >
                <img
                  src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150&q=80"
                  alt="Gear preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          <input
            placeholder="Brand (e.g. Nike)"
            className={fieldClass}
            value={brand}
            onChange={e => setBrand(e.target.value)}
          />
          <input
            placeholder="Model (e.g. Alphafly 3)"
            className={fieldClass}
            value={model}
            onChange={e => setModel(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="Max Lifespan"
              className={fieldClass}
              value={lifespan}
              onChange={e => setLifespan(e.target.value)}
            />
            <select className={fieldClass} value={unit} onChange={e => setUnit(e.target.value)}>
              <option value="km">km</option>
              <option value="miles">miles</option>
              <option value="races">races</option>
              <option value="hours">hours</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className={[
            'w-full mt-6 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2',
            canAdd
              ? 'bg-primary-brand text-white hover:bg-primary-brand/90 shadow-lg shadow-primary-brand/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed',
          ].join(' ')}
          onClick={handleAdd}
          disabled={!canAdd || isSaving}
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined text-xl animate-spin">
                progress_activity
              </span>
              Saving...
            </>
          ) : (
            'Add to Locker'
          )}
        </button>
      </div>
    </div>,
    document.body
  )
}
