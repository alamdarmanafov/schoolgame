import { useState } from 'react'
import { badgeFor } from '../lib/scoring'
import { subjects, difficultyMeta } from '../data/subjects'
import type { Difficulty, HighScore, SubjectId } from '../types'

interface Props {
  subjectId: SubjectId
  difficulty: Difficulty
  score: number
  correct: number
  total: number
  highScores: HighScore[]
  onSave: (name: string) => void
  onPlayAgain: () => void
  onHome: () => void
}

export default function Results({
  subjectId,
  difficulty,
  score,
  correct,
  total,
  highScores,
  onSave,
  onPlayAgain,
  onHome,
}: Props) {
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const subject = subjects.find((s) => s.id === subjectId)!
  const badge = badgeFor(correct, total)

  const relevant = highScores
    .filter((h) => h.subject === subjectId && h.difficulty === difficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed || saved) return
    onSave(trimmed)
    setSaved(true)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center px-5 py-10 text-center">
      <div className="animate-pop text-6xl">{badge.emoji}</div>
      <h2 className="mt-3 text-2xl font-bold text-white">{badge.label}</h2>
      <p className="mt-1 text-sm text-slate-400">
        {subject.emoji} {subject.name} · {difficultyMeta[difficulty].label}
      </p>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-2xl font-extrabold text-white">{score}</div>
          <div className="text-xs text-slate-400">Xal</div>
        </div>
        <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="text-2xl font-extrabold text-white">{correct}/{total}</div>
          <div className="text-xs text-slate-400">Düzgün cavab</div>
        </div>
      </div>

      {!saved ? (
        <div className="mt-6 flex w-full gap-2">
          <input
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Adını yaz və reytinqə əlavə et"
            className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-white/30"
          />
          <button
            onClick={handleSave}
            className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Saxla
          </button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-emerald-400">✓ Nəticən reytinqə əlavə olundu</p>
      )}

      {relevant.length > 0 && (
        <div className="mt-8 w-full text-left">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            🏆 Bu bölmənin liderləri
          </h3>
          <div className="flex flex-col gap-1.5">
            {relevant.map((h, i) => (
              <div
                key={`${h.name}-${h.date}-${i}`}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/5"
              >
                <span className="flex items-center gap-2 text-slate-200">
                  <span className="text-slate-500">#{i + 1}</span> {h.name}
                </span>
                <span className="font-semibold text-white">{h.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex w-full gap-3">
        <button
          onClick={onPlayAgain}
          className={`flex-1 rounded-xl bg-gradient-to-br ${subject.gradient} px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95`}
        >
          🔁 Yenidən oyna
        </button>
        <button
          onClick={onHome}
          className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
        >
          🏠 Əsas menyu
        </button>
      </div>
    </div>
  )
}
