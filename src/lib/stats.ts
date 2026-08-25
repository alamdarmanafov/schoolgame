import type { Stats, SubjectId } from '../types'
import { achievements } from '../data/achievements'

export const initialStats: Stats = {
  totalPlayed: 0,
  subjectsPlayed: [],
  perfectScores: 0,
  goldBadges: 0,
  maxStreak: 0,
  unlockedAchievements: [],
}

interface RoundSummary {
  subjectId: SubjectId
  correct: number
  total: number
  maxStreak: number
}

export function updateStats(prev: Stats, round: RoundSummary): { stats: Stats; newlyUnlocked: string[] } {
  const ratio = round.total > 0 ? round.correct / round.total : 0
  const next: Stats = {
    totalPlayed: prev.totalPlayed + 1,
    subjectsPlayed: prev.subjectsPlayed.includes(round.subjectId)
      ? prev.subjectsPlayed
      : [...prev.subjectsPlayed, round.subjectId],
    perfectScores: prev.perfectScores + (ratio === 1 ? 1 : 0),
    goldBadges: prev.goldBadges + (ratio >= 0.9 ? 1 : 0),
    maxStreak: Math.max(prev.maxStreak, round.maxStreak),
    unlockedAchievements: prev.unlockedAchievements,
  }

  const newlyUnlocked = achievements
    .filter((a) => !next.unlockedAchievements.includes(a.id) && a.check(next))
    .map((a) => a.id)

  next.unlockedAchievements = [...next.unlockedAchievements, ...newlyUnlocked]

  return { stats: next, newlyUnlocked }
}
