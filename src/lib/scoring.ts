export function badgeFor(correct: number, total: number): { emoji: string; label: string } {
  if (total === 0) return { emoji: '❓', label: 'Nəticə yoxdur' }
  const ratio = correct / total
  if (ratio >= 0.9) return { emoji: '🥇', label: 'Qızıl bilik ustası' }
  if (ratio >= 0.7) return { emoji: '🥈', label: 'Gümüş bilik ustası' }
  if (ratio >= 0.5) return { emoji: '🥉', label: 'Bürünc bilik həvəskarı' }
  return { emoji: '💪', label: 'Davam et, bacararsan!' }
}

export const QUESTION_SECONDS = 20

export function pointsFor(remainingSeconds: number, streak: number): number {
  const base = 100
  const speedBonus = remainingSeconds * 4
  const streakBonus = streak >= 3 ? (streak - 2) * 15 : 0
  return base + speedBonus + streakBonus
}
