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
  subject: SubjectId
  difficulty: Difficulty
  score: number
  date: string
}
