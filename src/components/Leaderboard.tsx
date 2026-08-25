import { useMemo, useState } from 'react'
import { subjects, difficultyMeta } from '../data/subjects'
import type { Difficulty, HighScore, Profile, SubjectId } from '../types'

interface Props {
  highScores: HighScore[]
  profile: Profile | null
  onBack: () => void
}

type SubjectFilter = 'all' | SubjectId
type DifficultyFilter = 'all' | Difficulty

function isMine(entry: HighScore, profile: Profile | null): boolean {
  if (!profile) return false
  if (entry.email) return entry.email.toLowerCase() === profile.email.toLowerCase()
  return entry.name.trim().toLowerCase() === profile.name.trim().toLowerCase()
}

export default function Leaderboard({ highScores, profile, onBack }: Props) {
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')

  const ranked = useMemo(() => {
    return highScores
      .filter((h) => subjectFilter === 'all' || h.subject === subjectFilter)
      .filter((h) => difficultyFilter === 'all' || h.difficulty === difficultyFilter)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
  }, [highScores, subjectFilter, difficultyFilter])

  const myRank = useMemo(() => {
    const idx = ranked.findIndex((h) => isMine(h, profile))
    return idx === -1 ? null : idx + 1
  }, [ranked, profile])

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
      <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900">
        ← Geri
      </button>

      <div className="text-center">
        <div className="text-4xl">🏆</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Liderlik lövhəsi</h2>
        <p className="mt-1 text-sm text-slate-500">Bu cihazda saxlanan bütün nəticələr üzrə sıralama</p>
      </div>

      {profile && (
        <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200">
          {myRank ? `Sənin yerin: #${myRank}` : 'Bu filtrdə hələ nəticən yoxdur — bir oyun tamamla!'}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value as SubjectFilter)}
          className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 outline-none"
        >
          <option value="all">Bütün fənlər</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
          className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 outline-none"
        >
          <option value="all">Bütün səviyyələr</option>
          <option value="asan">{difficultyMeta.asan.label}</option>
          <option value="orta">{difficultyMeta.orta.label}</option>
          <option value="cetin">{difficultyMeta.cetin.label}</option>
        </select>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        {ranked.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-400">Bu filtr üzrə hələ nəticə yoxdur.</p>
        )}
        {ranked.map((h, i) => {
          const rank = i + 1
          const mine = isMine(h, profile)
          const subject = subjects.find((s) => s.id === h.subject)!
          const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null
          return (
            <div
              key={`${h.name}-${h.date}-${i}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm shadow-sm ring-1 ${
                mine ? 'bg-indigo-50 ring-indigo-300' : 'bg-white ring-slate-200'
              }`}
            >
              <span className={`w-7 shrink-0 text-center font-semibold ${mine ? 'text-indigo-700' : 'text-slate-400'}`}>
                {medal ?? rank}
              </span>
              <div className="min-w-0 flex-1 text-left">
                <div className={`truncate font-semibold ${mine ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {h.name} {mine && <span className="text-xs font-normal text-indigo-500">(Sən)</span>}
                </div>
                <div className="truncate text-xs text-slate-400">
                  {subject.emoji} {subject.name} · {difficultyMeta[h.difficulty].label}
                </div>
              </div>
              <span className={`shrink-0 font-bold ${mine ? 'text-indigo-700' : 'text-slate-900'}`}>{h.score}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
