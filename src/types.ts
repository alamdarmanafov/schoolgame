export type SubjectId =
  | 'riyaziyyat'
  | 'cografiya'
  | 'tarix'
  | 'ingilis'
  | 'azdili'
  | 'fizika'
  | 'kimya'

export type Difficulty = 'asan' | 'orta' | 'cetin'

export interface Question {
  q: string
  options: string[]
  correct: string
}

export type QuestionBank = Record<SubjectId, Record<Difficulty, Question[]>>

export interface Subject {
  id: SubjectId
  name: string
  emoji: string
  gradient: string
}

export interface HighScore {
  name: string
  email?: string
  subject: SubjectId
  difficulty: Difficulty
  score: number
  date: string
}

export interface Profile {
  name: string
  email: string
}

export interface Stats {
  totalPlayed: number
  subjectsPlayed: SubjectId[]
  perfectScores: number
  goldBadges: number
  maxStreak: number
  unlockedAchievements: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  check: (stats: Stats) => boolean
}

export interface QuestionRecord {
  q: string
  options: string[]
  selected: string | null
  correct: string
  isCorrect: boolean
  difficulty: Difficulty
}
