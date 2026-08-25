import { useState } from 'react'
import { applyTheme, isDark } from '../lib/theme'
import { playClick } from '../lib/sound'

interface Props {
  size?: 'sm' | 'md'
}

export default function ThemeToggle({ size = 'md' }: Props) {
  const [dark, setDark] = useState(() => isDark())

  function toggle() {
    const next = !dark
    applyTheme(next)
    setDark(next)
    playClick()
  }

  const dim = size === 'sm' ? 'h-6 w-6 text-xs' : 'h-9 w-9 text-base'

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Açıq temaya keç' : 'Tünd temaya keç'}
      className={`flex ${dim} items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700 dark:hover:text-slate-100`}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
