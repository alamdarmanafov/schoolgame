import { subjects } from '../data/subjects'
import type { SubjectId } from '../types'

interface Props {
  onSelectSubject: (id: SubjectId) => void
  bestOverall: number
}

export default function Home({ onSelectSubject, bestOverall }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-5 py-10 text-center">
      <div className="mb-2 text-5xl">🎓</div>
      <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Bilik Ustası</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 sm:text-base">
        Məktəblilər üçün fənlər üzrə bilik yoxlama oyunu. Fənn seç, çətinlik səviyyəsini
        seç və vaxta qarşı xal topla!
      </p>

      {bestOverall > 0 && (
        <div className="mt-4 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          🏆 Ən yüksək xalın: {bestOverall}
        </div>
      )}

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
