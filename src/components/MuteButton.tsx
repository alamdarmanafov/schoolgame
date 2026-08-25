import { useState } from 'react'
import { isMuted, setMuted, playClick } from '../lib/sound'

interface Props {
  size?: 'sm' | 'md'
}

export default function MuteButton({ size = 'md' }: Props) {
  const [muted, setMutedState] = useState(() => isMuted())

  function toggle() {
    const next = !muted
    setMuted(next)
    setMutedState(next)
    if (!next) playClick()
  }

  const dim = size === 'sm' ? 'h-6 w-6 text-xs' : 'h-9 w-9 text-base'

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Səsi aç' : 'Səsi bağla'}
      className={`flex ${dim} items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
