import { useEffect, useRef, useState } from 'react'
import type { Profile as ProfileType } from '../types'

interface Props {
  profile: ProfileType | null
  onSave: (profile: ProfileType) => void
  onLogout: () => void
  onBack: () => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Profile({ profile, onSave, onLogout, onBack }: Props) {
  const [name, setName] = useState(profile?.name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (returnTimer.current) clearTimeout(returnTimer.current)
    }
  }, [])

  function handleSave() {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    if (!trimmedName) {
      setError('Adını daxil et.')
      return
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Düzgün email formatı daxil et.')
      return
    }
    setError('')
    onSave({ name: trimmedName, email: trimmedEmail })
    setSaved(true)
    returnTimer.current = setTimeout(onBack, 900)
  }

  function handleLogout() {
    onLogout()
    setName('')
    setEmail('')
    setSaved(false)
    onBack()
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
      <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900">
        ← Geri
      </button>

      <div className="text-center">
        <div className="text-4xl">👤</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Qeydiyyat</h2>
        <p className="mt-1 text-sm text-slate-500">
          Adını və emailini daxil et — bu cihazda saxlanılır və reytinq lövhəsində istifadə olunur.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-semibold text-slate-500">Ad</span>
          <input
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adını yaz"
            className="rounded-lg bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs font-semibold text-slate-500">Email</span>
          <input
            value={email}
            type="email"
            maxLength={60}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sen@example.com"
            className="rounded-lg bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && !error && <p className="text-sm text-emerald-600">✓ Profil yadda saxlanıldı</p>}

        <button
          onClick={handleSave}
          className="mt-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Yadda saxla
        </button>

        {profile && (
          <button
            onClick={handleLogout}
            className="mt-4 rounded-lg px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Çıxış et
          </button>
        )}
      </div>
    </div>
  )
}
