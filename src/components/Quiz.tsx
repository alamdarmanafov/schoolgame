import { useEffect, useMemo, useRef, useState } from 'react'
import { questionBank } from '../data/questions'
import { shuffle } from '../lib/shuffle'
import { pointsFor, QUESTION_SECONDS } from '../lib/scoring'
import type { Difficulty, Question, SubjectId } from '../types'
import { subjects } from '../data/subjects'

interface Props {
  subjectId: SubjectId
  difficulty: Difficulty
  onFinish: (result: { score: number; correct: number; total: number }) => void
  onQuit: () => void
}

interface PreparedQuestion extends Question {
  shuffledOptions: string[]
}

export default function Quiz({ subjectId, difficulty, onFinish, onQuit }: Props) {
  const subject = subjects.find((s) => s.id === subjectId)!

  const questions = useMemo<PreparedQuestion[]>(() => {
    const pool = questionBank[subjectId][difficulty]
    return shuffle(pool).map((q) => ({ ...q, shuffledOptions: shuffle(q.options) }))
  }, [subjectId, difficulty])

  const [index, setIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS)
  const [selected, setSelected] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)

  const current = questions[index]
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (locked) return
    if (timeLeft <= 0) {
      handleAnswer(null)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, locked])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  function handleAnswer(option: string | null) {
    if (locked) return
    setLocked(true)
    setSelected(option)

    const isCorrect = option === current.correct
    if (isCorrect) {
      const gained = pointsFor(timeLeft, streak + 1)
      setScore((s) => s + gained)
      setCorrectCount((c) => c + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }

    advanceTimer.current = setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1)
        setTimeLeft(QUESTION_SECONDS)
        setSelected(null)
        setLocked(false)
      } else {
        onFinish({
          score: score + (isCorrect ? pointsFor(timeLeft, streak + 1) : 0),
          correct: correctCount + (isCorrect ? 1 : 0),
          total: questions.length,
        })
      }
    }, 1100)
  }

  if (!current) return null

  const progressPct = ((index + 1) / questions.length) * 100
  const timePct = (timeLeft / QUESTION_SECONDS) * 100

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-8">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button onClick={onQuit} className="hover:text-slate-900">✕ Çıx</button>
        <span>{subject.emoji} {subject.name}</span>
        <span>{index + 1}/{questions.length}</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full bg-gradient-to-r ${subject.gradient} transition-all duration-300`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200">
            ⭐ {score}
          </span>
          {streak >= 2 && (
            <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-600 ring-1 ring-orange-200">
              🔥 {streak}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          ⏱ {timeLeft}s
        </div>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${timePct < 30 ? 'bg-red-500' : 'bg-emerald-500'}`}
          style={{ width: `${timePct}%` }}
        />
      </div>

      <div key={index} className="animate-pop mt-8 flex flex-1 flex-col">
        <h2 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{current.q}</h2>

        <div className="mt-6 grid gap-3">
          {current.shuffledOptions.map((opt) => {
            const isSelected = selected === opt
            const isCorrectOpt = opt === current.correct
            let cls = 'bg-white ring-slate-200 shadow-sm hover:bg-slate-50 text-slate-800'
            if (locked) {
              if (isCorrectOpt) cls = 'bg-emerald-50 ring-emerald-400 text-emerald-700'
              else if (isSelected) cls = 'bg-red-50 ring-red-400 text-red-700 animate-shake'
              else cls = 'bg-slate-50 ring-slate-100 text-slate-400'
            }
            return (
              <button
                key={opt}
                disabled={locked}
                onClick={() => handleAnswer(opt)}
                className={`rounded-xl px-5 py-4 text-left text-sm font-medium ring-1 transition sm:text-base ${cls}`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
