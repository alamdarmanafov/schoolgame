import { achievements } from '../data/achievements'
import type { Stats } from '../types'

interface Props {
  stats: Stats
  onBack: () => void
}

export default function Achievements({ stats, onBack }: Props) {
  const unlockedCount = achievements.filter((a) => stats.unlockedAchievements.includes(a.id)).length

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
      <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900">
        ← Geri
      </button>

      <div className="text-center">
        <div className="text-4xl">🏅</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Nailiyyətlər</h2>
        <p className="mt-1 text-sm text-slate-500">{unlockedCount}/{achievements.length} qazanılıb</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {achievements.map((a) => {
          const unlocked = stats.unlockedAchievements.includes(a.id)
          return (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-xl p-4 shadow-sm ring-1 transition ${
                unlocked ? 'bg-white ring-slate-200' : 'bg-slate-100 ring-slate-100'
              }`}
            >
              <span className={`text-3xl ${unlocked ? '' : 'opacity-30 grayscale'}`}>{a.emoji}</span>
              <div className="text-left">
                <div className={`text-sm font-semibold ${unlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                  {a.title}
                </div>
                <div className={`text-xs ${unlocked ? 'text-slate-500' : 'text-slate-400'}`}>{a.description}</div>
              </div>
              {unlocked && <span className="ml-auto text-emerald-500">✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
