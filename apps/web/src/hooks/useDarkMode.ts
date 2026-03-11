import { useEffect, useState } from 'react'

const STORAGE_KEY = 'flinki-dark-mode'

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, String(isDark))
  }, [isDark])

  return [isDark, setIsDark] as const
}
