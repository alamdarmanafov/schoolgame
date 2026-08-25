import { useState } from 'react'
import Home from './components/Home'
import DifficultySelect from './components/DifficultySelect'
import Quiz from './components/Quiz'
import Results from './components/Results'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Difficulty, HighScore, SubjectId } from './types'

type Screen = 'home' | 'difficulty' | 'quiz' | 'results'

interface RoundResult {
  score: number
  correct: number
  total: number
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [subjectId, setSubjectId] = useState<SubjectId | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [result, setResult] = useState<RoundResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [highScores, setHighScores] = useLocalStorage<HighScore[]>('az-school-quiz-scores', [])

  const bestOverall = highScores.reduce((max, h) => Math.max(max, h.score), 0)

  function handleSelectSubject(id: SubjectId) {
    setSubjectId(id)
    setScreen('difficulty')
  }

  function handleSelectDifficulty(d: Difficulty) {
    setDifficulty(d)
    setAttempt((a) => a + 1)
    setScreen('quiz')
  }

  function handleFinish(r: RoundResult) {
    setResult(r)
    setScreen('results')
  }

  function handleSaveScore(name: string) {
    if (!subjectId || !difficulty || !result) return
    const entry: HighScore = {
      name,
      subject: subjectId,
      difficulty,
      score: result.score,
      date: new Date().toISOString(),
    }
    setHighScores((prev) => [...prev, entry])
  }

  function goHome() {
    setScreen('home')
    setSubjectId(null)
    setDifficulty(null)
    setResult(null)
  }

  function playAgain() {
    setResult(null)
    setAttempt((a) => a + 1)
    setScreen('quiz')
  }

  return (
    <div className="min-h-screen bg-[#f4f5fb]">
      {screen === 'home' && <Home onSelectSubject={handleSelectSubject} bestOverall={bestOverall} />}

      {screen === 'difficulty' && subjectId && (
        <DifficultySelect
          subjectId={subjectId}
          onSelectDifficulty={handleSelectDifficulty}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'quiz' && subjectId && difficulty && (
        <Quiz
          key={attempt}
          subjectId={subjectId}
          difficulty={difficulty}
          onFinish={handleFinish}
          onQuit={goHome}
        />
      )}

      {screen === 'results' && subjectId && difficulty && result && (
        <Results
          subjectId={subjectId}
          difficulty={difficulty}
          score={result.score}
          correct={result.correct}
          total={result.total}
          highScores={highScores}
          onSave={handleSaveScore}
          onPlayAgain={playAgain}
          onHome={goHome}
        />
      )}
    </div>
  )
}
