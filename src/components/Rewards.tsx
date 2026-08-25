import { useMemo } from 'react'
import { partners } from '../data/partners'
import { startOfMonth, startOfWeek, topScorer } from '../lib/rewards'
import { downloadCertificate, monthLabel } from '../lib/certificate'
import type { HighScore, Profile } from '../types'

interface Props {
  highScores: HighScore[]
  profile: Profile | null
  onBack: () => void
}

function WinnerCard({
  label,
  emoji,
  winner,
  mine,
}: {
  label: string
  emoji: string
  winner: { name: string; total: number } | null
  mine: boolean
}) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="text-3xl">{emoji}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</div>
      {winner ? (
        <>
          <div className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
            {winner.name} {mine && <span className="text-sm font-normal text-indigo-500 dark:text-indigo-400">(Sən)</span>}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{winner.total} xal</div>
        </>
      ) : (
        <div className="mt-2 text-sm text-slate-400 dark:text-slate-500">Hələ heç kim xal toplamayıb</div>
      )}
    </div>
  )
}

export default function Rewards({ highScores, profile, onBack }: Props) {
  const weeklyWinner = useMemo(() => topScorer(highScores, startOfWeek(new Date())), [highScores])
  const monthlyWinner = useMemo(() => topScorer(highScores, startOfMonth(new Date())), [highScores])

  const myKey = profile ? (profile.email || profile.name).trim().toLowerCase() : null
  const isMineWeekly = !!weeklyWinner && weeklyWinner.key === myKey
  const isMineMonthly = !!monthlyWinner && monthlyWinner.key === myKey
  const iWon = isMineWeekly || isMineMonthly

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-10">
      <button onClick={onBack} className="mb-6 self-start text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Geri
      </button>

      <div className="text-center">
        <div className="text-4xl">🎁</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Mükafatlar</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Həftənin və ayın ən çox xal toplayanı tərəfdaş məkanlardan endirim qazanır!
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <WinnerCard label="Bu həftənin qalibi" emoji="🥇" winner={weeklyWinner} mine={isMineWeekly} />
        <WinnerCard label="Bu ayın qalibi" emoji="🏆" winner={monthlyWinner} mine={isMineMonthly} />
      </div>

      {iWon && (
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30">
          🎉 Təbriklər, sən qalibsən! Aşağıdakı tərəfdaşlardan endirim qazanmaq üçün bu ekranın şəklini məktəbinə/təşkilatçıya göstər.
        </div>
      )}

      {monthlyWinner && (
        <button
          onClick={() =>
            downloadCertificate({
              name: monthlyWinner.name,
              score: monthlyWinner.total,
              periodLabel: monthLabel(new Date()),
            })
          }
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500"
        >
          🎓 Ayın qalibi sertifikatını yüklə
        </button>
      )}

      <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Tərəfdaşlar</h3>
      <div className="mt-3 flex flex-col gap-3">
        {partners.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-2xl shadow-sm`}
            >
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Qalib üçün {p.discount}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        Bunlar nümunə tərəfdaş yerləridir — real biznes loqoları və kupon kodları əlavə etmək üçün bizimlə əlaqə saxlayın.
      </p>
    </div>
  )
}
