import { subjects, difficultyMeta } from '../data/subjects'
import type { QuestionRecord, SubjectId } from '../types'

interface Props {
  subjectId: SubjectId
  history: QuestionRecord[]
  onBack: () => void
}

export default function ReviewAnswers({ subjectId, history, onBack }: Props) {
  const subject = subjects.find((s) => s.id === subjectId)!
  const wrongCount = history.filter((h) => !h.isCorrect).length

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
      <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900">
        ← Geri
      </button>

      <div className="text-center">
        <div className="text-4xl">📋</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Sualların təhlili</h2>
        <p className="mt-1 text-sm text-slate-500">
          {subject.emoji} {subject.name} · {history.length - wrongCount}/{history.length} düzgün
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {history.map((h, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 shadow-sm ring-1 ${
              h.isCorrect ? 'bg-white ring-slate-200' : 'bg-red-50/40 ring-red-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400">Sual {i + 1}</span>
              <span className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500">
                  {difficultyMeta[h.difficulty].label}
                </span>
                {h.isCorrect ? (
                  <span className="text-emerald-600">✓ Düzgün</span>
                ) : (
                  <span className="text-red-600">✗ Səhv</span>
                )}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">{h.q}</p>

            <div className="mt-2 flex flex-col gap-1 text-sm">
              {!h.isCorrect && (
                <p className="text-red-600">
                  Sənin cavabın: {h.selected ?? <span className="italic">vaxt bitdi</span>}
                </p>
              )}
              <p className="text-emerald-600">Düzgün cavab: {h.correct}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-8 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
      >
        ← Nəticəyə qayıt
      </button>
    </div>
  )
}
