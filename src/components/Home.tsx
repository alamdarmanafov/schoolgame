import { subjects } from '../data/subjects'
import { achievements } from '../data/achievements'
import type { Profile, SubjectId, Stats } from '../types'
import MuteButton from './MuteButton'

interface Props {
  onSelectSubject: (id: SubjectId) => void
  bestOverall: number
  profile: Profile | null
  stats: Stats
  onOpenProfile: () => void
  onOpenAchievements: () => void
}

export default function Home({
  onSelectSubject,
  bestOverall,
  profile,
  stats,
  onOpenProfile,
  onOpenAchievements,
}: Props) {
  const unlockedCount = achievements.filter((a) => stats.unlockedAchievements.includes(a.id)).length

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-5 py-10 text-center">
      <div className="flex w-full items-center justify-between">
        <button
          onClick={onOpenProfile}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900"
        >
          {profile ? `👤 ${profile.name}` : '👤 Qeydiyyatdan keç'}
        </button>
        <MuteButton />
      </div>

      <div className="mb-2 mt-4 text-5xl">🎓</div>
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Bilik Ustası</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 sm:text-base">
        Məktəblilər üçün fənlər üzrə bilik yoxlama oyunu. Fənn seç, çətinlik səviyyəsini
        seç və vaxta qarşı xal topla!
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {bestOverall > 0 && (
          <div className="rounded-full bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            🏆 Ən yüksək xalın: {bestOverall}
          </div>
        )}
        <button
          onClick={onOpenAchievements}
          className="rounded-full bg-violet-50 px-4 py-1.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200 transition hover:bg-violet-100"
        >
          🏅 Nailiyyətlər: {unlockedCount}/{achievements.length}
        </button>
      </div>

      <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectSubject(s.id)}
            className={`group flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${s.gradient} p-5 shadow-lg shadow-slate-300/50 ring-1 ring-black/5 transition-transform duration-150 hover:scale-105 active:scale-95`}
          >
            <span className="text-3xl drop-shadow">{s.emoji}</span>
            <span className="text-sm font-semibold text-white sm:text-base">{s.name}</span>
          </button>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-400">Riyaziyyat · Coğrafiya · Tarix · İngilis dili · Azərbaycan dili · Fizika · Kimya</p>
    </div>
  )
}
