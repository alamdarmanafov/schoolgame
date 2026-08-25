import { difficultyMeta, subjects } from '../data/subjects'
import type { Difficulty, SubjectId } from '../types'

interface Props {
  subjectId: SubjectId
  onSelectDifficulty: (d: Difficulty) => void
  onBack: () => void
}

const order: Difficulty[] = ['asan', 'orta', 'cetin']

export default function DifficultySelect({ subjectId, onSelectDifficulty, onBack }: Props) {
  const subject = subjects.find((s) => s.id === subjectId)!

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center px-5 py-10 text-center">
      <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900">
        ← Geri
      </button>
      <div className="text-4xl">{subject.emoji}</div>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{subject.name}</h2>
      <p className="mt-1 text-sm text-slate-500">Başlanğıc səviyyəni seç</p>
      <p className="mt-1 max-w-xs text-xs text-slate-400">
        Çətinlik cavablarına görə avtomatik dəyişəcək: düzgün cavab versən bir pillə yuxarı, səhv cavab versən bir pillə aşağı düşəcək.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        {order.map((d) => (
          <button
            key={d}
            onClick={() => onSelectDifficulty(d)}
            className="flex items-center justify-between rounded-xl bg-white px-5 py-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
          >
            <span className="font-semibold text-slate-900">{difficultyMeta[d].label}</span>
            <span className="text-xs text-slate-400">{difficultyMeta[d].grade}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
