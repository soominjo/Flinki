import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { showToast } from '../shared/Toaster'

interface AddCredentialModalProps {
  isOpen: boolean
  onClose: () => void
}

const MOCK_LOGO_URL =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=120&h=120&q=80'

const fieldClass =
  'bg-slate-100 dark:bg-slate-800 rounded-xl p-3 w-full border-none outline-none text-sm ' +
  'text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ' +
  'focus:ring-2 focus:ring-primary-brand'

export function AddCredentialModal({ isOpen, onClose }: AddCredentialModalProps) {
  const [hasImage, setHasImage] = useState(false)
  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const canSave = title.trim().length > 0 && organization.trim().length > 0

  useEffect(() => {
    if (!isOpen) {
      setHasImage(false)
      setTitle('')
      setOrganization('')
      setDateRange('')
      setIsSaving(false)
    }
  }, [isOpen])

  function handleSave() {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setTimeout(() => {
      showToast('Credential added to your profile!')
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
        aria-labelledby="add-credential-title"
      >
        <div className="flex items-center justify-between">
          <h2
            id="add-credential-title"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Add Experience or Credential
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Logo dropzone */}
        <div className="mt-4">
          {!hasImage ? (
            <button
              type="button"
              onClick={() => setHasImage(true)}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-8 text-slate-500 dark:text-slate-400 hover:border-primary-brand hover:bg-primary-brand/5 hover:text-primary-brand dark:hover:bg-primary-brand/10 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
              <span className="text-sm font-medium">Upload Logo</span>
            </button>
          ) : (
            <div className="flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer"
                onClick={() => setHasImage(false)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setHasImage(false)
                  }
                }}
                aria-label="Remove logo"
              >
                <img
                  src={MOCK_LOGO_URL}
                  alt="Uploaded logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-4">
          <input
            placeholder="Title (e.g., Lead Instructor)"
            className={fieldClass}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            placeholder="Organization / Company"
            className={fieldClass}
            value={organization}
            onChange={e => setOrganization(e.target.value)}
          />
          <input
            placeholder="MM/YYYY – Present"
            className={fieldClass}
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={[
            'w-full mt-6 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2',
            canSave
              ? 'bg-primary-brand text-white hover:bg-primary-brand/90 shadow-lg shadow-primary-brand/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed',
          ].join(' ')}
          onClick={handleSave}
          disabled={!canSave || isSaving}
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined text-xl animate-spin">
                progress_activity
              </span>
              Saving...
            </>
          ) : (
            'Save Credential'
          )}
        </button>
      </div>
    </div>,
    document.body
  )
}
