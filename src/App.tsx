import { useState } from 'react'
import Home from './components/Home'
import DifficultySelect from './components/DifficultySelect'
import Quiz from './components/Quiz'
import Results from './components/Results'
import Profile from './components/Profile'
import Achievements from './components/Achievements'
import Leaderboard from './components/Leaderboard'
import Rewards from './components/Rewards'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialStats, updateStats } from './lib/stats'
import type { Difficulty, HighScore, Profile as ProfileType, SubjectId, Stats } from './types'

type Screen = 'home' | 'difficulty' | 'quiz' | 'results' | 'profile' | 'achievements' | 'leaderboard' | 'rewards'

interface RoundResult {
  score: number
  correct: number
  total: number
  maxStreak: number
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [subjectId, setSubjectId] = useState<SubjectId | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [result, setResult] = useState<RoundResult | null>(null)
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])
  const [attempt, setAttempt] = useState(0)
  const [pendingSubject, setPendingSubject] = useState<SubjectId | null>(null)
  const [highScores, setHighScores] = useLocalStorage<HighScore[]>('az-school-quiz-scores', [])
  const [profile, setProfile] = useLocalStorage<ProfileType | null>('az-school-quiz-profile', null)
  const [stats, setStats] = useLocalStorage<Stats>('az-school-quiz-stats', initialStats)
  const [registeredEmails, setRegisteredEmails] = useLocalStorage<Record<string, string>>(
    'az-school-quiz-registry',
    {},
  )

  const bestOverall = highScores.reduce((max, h) => Math.max(max, h.score), 0)

  function handleSelectSubject(id: SubjectId) {
    if (!profile) {
      setPendingSubject(id)
      setScreen('profile')
      return
    }
    setSubjectId(id)
    setScreen('difficulty')
  }

  function handleProfileBack() {
    if (pendingSubject && profile) {
      setSubjectId(pendingSubject)
      setPendingSubject(null)
      setScreen('difficulty')
    } else {
      setPendingSubject(null)
      setScreen('home')
    }
  }

  function handleSelectDifficulty(d: Difficulty) {
    setDifficulty(d)
    setAttempt((a) => a + 1)
    setScreen('quiz')
  }

  function handleFinish(r: RoundResult) {
    setResult(r)
    if (subjectId) {
      const { stats: nextStats, newlyUnlocked: unlocked } = updateStats(stats, {
        subjectId,
        correct: r.correct,
        total: r.total,
        maxStreak: r.maxStreak,
      })
      setStats(nextStats)
      setNewlyUnlocked(unlocked)
    }
    setScreen('results')
  }

  function handleSaveScore(name: string) {
    if (!subjectId || !difficulty || !result) return
    const entry: HighScore = {
      name,
      email: profile?.email,
      subject: subjectId,
      difficulty,
      score: result.score,
      date: new Date().toISOString(),
    }
    setHighScores((prev) => [...prev, entry])
  }

  function handleSaveProfile(p: ProfileType): { alreadyRegistered: boolean; resolvedName: string } {
    const key = p.email.trim().toLowerCase()
    const name = p.name.trim()
    const existingName = registeredEmails[key]

    if (existingName) {
      setProfile({ name: existingName, email: key })
      return { alreadyRegistered: true, resolvedName: existingName }
    }

    setRegisteredEmails((prev) => ({ ...prev, [key]: name }))
    setProfile({ name, email: key })
    return { alreadyRegistered: false, resolvedName: name }
  }

  function handleLogout() {
    setProfile(null)
    setStats(initialStats)
  }

  function goHome() {
    setScreen('home')
    setSubjectId(null)
    setDifficulty(null)
    setResult(null)
    setNewlyUnlocked([])
  }

  function playAgain() {
    setResult(null)
    setNewlyUnlocked([])
    setAttempt((a) => a + 1)
    setScreen('quiz')
  }

  return (
    <div className="min-h-screen bg-[#f4f5fb]">
      {screen === 'home' && (
        <Home
          onSelectSubject={handleSelectSubject}
          bestOverall={bestOverall}
          profile={profile}
          stats={stats}
          onOpenProfile={() => setScreen('profile')}
          onOpenAchievements={() => setScreen('achievements')}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenRewards={() => setScreen('rewards')}
        />
      )}

      {screen === 'profile' && (
        <Profile
          profile={profile}
          onSave={handleSaveProfile}
          onLogout={handleLogout}
          onBack={handleProfileBack}
          gated={!!pendingSubject}
        />
      )}

      {screen === 'achievements' && <Achievements stats={stats} onBack={() => setScreen('home')} />}

      {screen === 'leaderboard' && (
        <Leaderboard highScores={highScores} profile={profile} onBack={() => setScreen('home')} />
      )}

      {screen === 'rewards' && (
        <Rewards highScores={highScores} profile={profile} onBack={() => setScreen('home')} />
      )}

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
          profile={profile}
          newlyUnlocked={newlyUnlocked}
          onSave={handleSaveScore}
          onPlayAgain={playAgain}
          onHome={goHome}
        />
      )}
    </div>
  )
}
