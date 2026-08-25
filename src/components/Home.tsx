import { subjects } from '../data/subjects'
import { achievements } from '../data/achievements'
import type { Profile, SubjectId, Stats } from '../types'
import MuteButton from './MuteButton'
import ThemeToggle from './ThemeToggle'

interface Props {
  onSelectSubject: (id: SubjectId) => void
  bestOverall: number
  profile: Profile | null
  stats: Stats
  onOpenProfile: () => void
  onOpenAchievements: () => void
  onOpenLeaderboard: () => void
  onOpenRewards: () => void
}

export default function Home({
  onSelectSubject,
  bestOverall,
  profile,
  stats,
  onOpenProfile,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenRewards,
}: Props) {
  const unlockedCount = achievements.filter((a) => stats.unlockedAchievements.includes(a.id)).length

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-5 py-10 text-center">
      <div className="flex w-full items-center justify-between">
        <button
          onClick={onOpenProfile}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-white"
        >
          {profile ? `👤 ${profile.name}` : '👤 Qeydiyyatdan keç'}
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MuteButton />
        </div>
      </div>

      <div className="relative mt-4 flex flex-col items-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 opacity-25 blur-3xl dark:opacity-30" />
        <div className="mb-2 text-5xl">🎓</div>
        <h1 className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
          Bilik Ustası
        </h1>
      </div>
      <p className="mt-2 max-w-md text-sm text-slate-500 sm:text-base dark:text-slate-400">
        Məktəblilər üçün fənlər üzrə bilik yoxlama oyunu. Fənn seç, çətinlik səviyyəsini
        seç və vaxta qarşı xal topla!
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onOpenLeaderboard}
          className="rounded-full bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30 dark:hover:bg-amber-500/20"
        >
          🏆 Liderlik lövhəsi{bestOverall > 0 ? ` · ən yüksək: ${bestOverall}` : ''}
        </button>
        <button
          onClick={onOpenAchievements}
          className="rounded-full bg-violet-50 px-4 py-1.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200 transition hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/30 dark:hover:bg-violet-500/20"
        >
          🏅 Nailiyyətlər: {unlockedCount}/{achievements.length}
        </button>
        <button
          onClick={onOpenRewards}
          className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30 dark:hover:bg-emerald-500/20"
        >
          🎁 Mükafatlar
        </button>
      </div>

      {!profile && (
        <p className="mt-5 text-xs font-medium text-amber-600 dark:text-amber-400">
          🔒 Fənn seçəndə əvvəlcə qeydiyyatdan keçməyin istəniləcək.
        </p>
      )}

      <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectSubject(s.id)}
            className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${s.gradient} p-5 shadow-lg shadow-slate-300/50 ring-1 ring-black/5 transition-transform duration-150 hover:scale-105 active:scale-95 dark:shadow-black/40`}
          >
            {!profile && <span className="absolute right-2 top-2 text-sm">🔒</span>}
            <span className="text-3xl drop-shadow">{s.emoji}</span>
            <span className="text-sm font-semibold text-white sm:text-base">{s.name}</span>
          </button>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-400 dark:text-slate-600">Riyaziyyat · Coğrafiya · Tarix · İngilis dili · Azərbaycan dili · Fizika · Kimya</p>
    </div>
  )
}
