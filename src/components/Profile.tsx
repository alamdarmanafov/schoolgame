import { useEffect, useRef, useState } from 'react'
import type { Profile as ProfileType } from '../types'
import { isValidEmail, isValidName, normalizeEmail } from '../lib/validate'

interface SaveResult {
  alreadyRegistered: boolean
  resolvedName: string
}

interface Props {
  profile: ProfileType | null
  registeredEmails: Record<string, string>
  onSave: (profile: ProfileType) => SaveResult
  onLogout: () => void
  onBack: () => void
  gated?: boolean
}

type Mode = 'login' | 'register'

export default function Profile({ profile, registeredEmails, onSave, onLogout, onBack, gated = false }: Props) {
  const hasAnyAccounts = Object.keys(registeredEmails).length > 0
  const [mode, setMode] = useState<Mode>(hasAnyAccounts ? 'login' : 'register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (returnTimer.current) clearTimeout(returnTimer.current)
    }
  }, [])

  const matchedName = registeredEmails[normalizeEmail(email)]

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setSuccessMessage('')
  }

  function handleLoginSubmit() {
    if (!isValidEmail(email)) {
      setError('Düzgün email formatı daxil et (məs. sen@example.com).')
      return
    }
    const key = normalizeEmail(email)
    const existing = registeredEmails[key]
    if (!existing) {
      setError('Bu email qeydiyyatdan keçməyib. "Qeydiyyat" bölməsini istifadə et.')
      return
    }
    setError('')
    const { resolvedName } = onSave({ name: existing, email: key })
    setSuccessMessage(`✓ Xoş gəldin, ${resolvedName}!`)
    returnTimer.current = setTimeout(onBack, 900)
  }

  function handleRegisterSubmit() {
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
    const key = normalizeEmail(email)
    if (registeredEmails[key]) {
      setError(`Bu email artıq "${registeredEmails[key]}" adı ilə qeydiyyatdan keçib. "Daxil ol" bölməsini istifadə et.`)
      return
    }
    setError('')
    onSave({ name: trimmedName, email: key })
    setSuccessMessage('✓ Qeydiyyat tamamlandı')
    returnTimer.current = setTimeout(onBack, 1100)
  }

  function handleLogout() {
    onLogout()
    setName('')
    setEmail('')
    setSuccessMessage('')
    onBack()
  }

  if (profile) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
        <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900">
          ← Geri
        </button>

        <div className="text-center">
          <div className="text-4xl">👤</div>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Hesabın</h2>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <div className="rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700">{profile.name}</div>
          <div className="rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-500">{profile.email}</div>

          <button
            onClick={handleLogout}
            className="mt-4 rounded-lg px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Çıxış et
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
      <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900">
        ← Geri
      </button>

      <div className="text-center">
        <div className="text-4xl">👤</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">{mode === 'login' ? 'Daxil ol' : 'Qeydiyyat'}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {mode === 'login'
            ? 'Qeydiyyatdan keçdiyin emaili yaz — adın avtomatik tanınacaq.'
            : 'Adını və emailini daxil et — bu cihazda saxlanılır və reytinq lövhəsində istifadə olunur.'}
        </p>
      </div>

      {gated && (
        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-700 ring-1 ring-amber-200">
          🔒 İmtahana başlamaq üçün əvvəlcə daxil ol və ya qeydiyyatdan keç.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => switchMode('login')}
          className={`rounded-lg py-2 text-sm font-semibold transition ${
            mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Daxil ol
        </button>
        <button
          onClick={() => switchMode('register')}
          className={`rounded-lg py-2 text-sm font-semibold transition ${
            mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Qeydiyyat
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {mode === 'register' && (
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
        )}

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

        {mode === 'login' && matchedName && (
          <p className="text-sm text-indigo-600">👋 Salam, {matchedName}! Bu hesabla davam et.</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {successMessage && !error && <p className="text-sm text-emerald-600">{successMessage}</p>}

        <button
          onClick={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit}
          className="mt-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500"
        >
          {mode === 'login' ? 'Daxil ol' : 'Qeydiyyatdan keç'}
        </button>
      </div>
    </div>
  )
}
