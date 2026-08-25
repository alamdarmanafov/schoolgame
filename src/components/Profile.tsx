import { useEffect, useRef, useState } from 'react'
import type { Profile as ProfileType } from '../types'
import { isValidEmail, isValidName, normalizeEmail } from '../lib/validate'

interface SaveResult {
  alreadyRegistered: boolean
  resolvedName: string
}

interface Props {
  profile: ProfileType | null
  onSave: (profile: ProfileType) => SaveResult
  onLogout: () => void
  onBack: () => void
  gated?: boolean
}

export default function Profile({ profile, onSave, onLogout, onBack, gated = false }: Props) {
  const [name, setName] = useState(profile?.name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (returnTimer.current) clearTimeout(returnTimer.current)
    }
  }, [])

  function handleSave() {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Adını daxil et.')
      return
    }
    if (!isValidName(trimmedName)) {
      setError('Ad yalnız hərflərdən ibarət olmalıdır (2-20 simvol, rəqəm və xüsusi işarə olmadan).')
      return
    }
    if (!isValidEmail(email)) {
      setError('Düzgün email formatı daxil et (məs. sen@example.com).')
      return
    }
    const normalizedEmail = normalizeEmail(email)
    setError('')
    const { alreadyRegistered, resolvedName } = onSave({ name: trimmedName, email: normalizedEmail })
    if (alreadyRegistered) {
      setName(resolvedName)
      setSuccessMessage(`Bu email artıq "${resolvedName}" adı ilə qeydiyyatdan keçib — hesabına daxil olundu.`)
    } else {
      setSuccessMessage('✓ Profil yadda saxlanıldı')
    }
    returnTimer.current = setTimeout(onBack, 1100)
  }

  function handleLogout() {
    onLogout()
    setName('')
    setEmail('')
    setSuccessMessage('')
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

      {gated && (
        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-700 ring-1 ring-amber-200">
          🔒 İmtahana başlamaq üçün əvvəlcə qeydiyyatdan keç.
        </div>
      )}

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
        {successMessage && !error && <p className="text-sm text-emerald-600">{successMessage}</p>}

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
