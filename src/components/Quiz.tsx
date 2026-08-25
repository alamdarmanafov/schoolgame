import { useEffect, useMemo, useRef, useState } from 'react'
import { questionBank } from '../data/questions'
import { shuffle } from '../lib/shuffle'
import { POINTS_PER_CORRECT, QUESTION_SECONDS } from '../lib/scoring'
import { playCorrect, playWrong } from '../lib/sound'
import type { Difficulty, Question, QuestionRecord, SubjectId } from '../types'
import { subjects, difficultyMeta } from '../data/subjects'
import MuteButton from './MuteButton'

const TOTAL_QUESTIONS = 20
const LEVELS: Difficulty[] = ['asan', 'orta', 'cetin']

const LEVEL_STYLE: Record<Difficulty, string> = {
  asan: 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
  orta: 'bg-amber-50 text-amber-600 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30',
  cetin: 'bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30',
}

interface Props {
  subjectId: SubjectId
  difficulty: Difficulty
  onFinish: (result: {
    score: number
    correct: number
    total: number
    maxStreak: number
    history: QuestionRecord[]
  }) => void
  onQuit: () => void
}

interface PreparedQuestion extends Question {
  shuffledOptions: string[]
  difficulty: Difficulty
}

export default function Quiz({ subjectId, difficulty, onFinish, onQuit }: Props) {
  const subject = subjects.find((s) => s.id === subjectId)!

  const pools = useMemo(
    () => ({
      asan: shuffle(questionBank[subjectId].asan),
      orta: shuffle(questionBank[subjectId].orta),
      cetin: shuffle(questionBank[subjectId].cetin),
    }),
    [subjectId],
  )
  const pointers = useRef<Record<Difficulty, number>>({ asan: 0, orta: 0, cetin: 0 })

  function pickQuestion(level: Difficulty): PreparedQuestion {
    const pool = pools[level]
    const idx = pointers.current[level] % pool.length
    pointers.current[level] += 1
    const q = pool[idx]
    return { ...q, shuffledOptions: shuffle(q.options), difficulty: level }
  }

  const [levelIndex, setLevelIndex] = useState(LEVELS.indexOf(difficulty))
  const [current, setCurrent] = useState<PreparedQuestion>(() => pickQuestion(difficulty))
  const [questionNumber, setQuestionNumber] = useState(1)
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS)
  const [selected, setSelected] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const history = useRef<QuestionRecord[]>([])

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
    let finalMaxStreak = maxStreak
    let nextLevelIndex = levelIndex

    history.current.push({
      q: current.q,
      options: current.shuffledOptions,
      selected: option,
      correct: current.correct,
      isCorrect,
      difficulty: current.difficulty,
    })

    if (isCorrect) {
      playCorrect()
      setScore((s) => s + POINTS_PER_CORRECT)
      setCorrectCount((c) => c + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      finalMaxStreak = Math.max(maxStreak, newStreak)
      setMaxStreak(finalMaxStreak)
      nextLevelIndex = Math.min(levelIndex + 1, LEVELS.length - 1)
    } else {
      playWrong()
      setStreak(0)
      nextLevelIndex = Math.max(levelIndex - 1, 0)
    }
    setLevelIndex(nextLevelIndex)

    advanceTimer.current = setTimeout(() => {
      if (questionNumber < TOTAL_QUESTIONS) {
        setCurrent(pickQuestion(LEVELS[nextLevelIndex]))
        setQuestionNumber((n) => n + 1)
        setTimeLeft(QUESTION_SECONDS)
        setSelected(null)
        setLocked(false)
      } else {
        onFinish({
          score: score + (isCorrect ? POINTS_PER_CORRECT : 0),
          correct: correctCount + (isCorrect ? 1 : 0),
          total: TOTAL_QUESTIONS,
          maxStreak: finalMaxStreak,
          history: history.current,
        })
      }
    }, 1100)
  }

  const progressPct = (questionNumber / TOTAL_QUESTIONS) * 100
  const timePct = (timeLeft / QUESTION_SECONDS) * 100

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-8">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <button onClick={onQuit} className="hover:text-slate-900 dark:hover:text-white">✕ Çıx</button>
        <span>{subject.emoji} {subject.name}</span>
        <div className="flex items-center gap-3">
          <span>{questionNumber}/{TOTAL_QUESTIONS}</span>
          <MuteButton size="sm" />
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full bg-gradient-to-r ${subject.gradient} transition-all duration-300`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
            ⭐ {score}
          </span>
          <span className={`rounded-full px-3 py-1 font-semibold ring-1 ${LEVEL_STYLE[current.difficulty]}`}>
            {difficultyMeta[current.difficulty].label}
          </span>
          {streak >= 2 && (
            <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-600 ring-1 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/30">
              🔥 {streak}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          ⏱ {timeLeft}s
        </div>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${timePct < 30 ? 'bg-red-500' : 'bg-emerald-500'}`}
          style={{ width: `${timePct}%` }}
        />
      </div>

      <div key={questionNumber} className="animate-pop mt-8 flex flex-1 flex-col">
        <h2 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl dark:text-slate-100">{current.q}</h2>

        <div className="mt-6 grid gap-3">
          {current.shuffledOptions.map((opt) => {
            const isSelected = selected === opt
            const isCorrectOpt = opt === current.correct
            let cls = 'bg-white ring-slate-200 shadow-sm hover:bg-slate-50 text-slate-800 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700/60 dark:text-slate-200'
            if (locked) {
              if (isCorrectOpt) cls = 'bg-emerald-50 ring-emerald-400 text-emerald-700 dark:bg-emerald-500/10 dark:ring-emerald-500/50 dark:text-emerald-400'
              else if (isSelected) cls = 'bg-red-50 ring-red-400 text-red-700 animate-shake dark:bg-red-500/10 dark:ring-red-500/50 dark:text-red-400'
              else cls = 'bg-slate-50 ring-slate-100 text-slate-400 dark:bg-slate-800/50 dark:ring-slate-800 dark:text-slate-600'
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
