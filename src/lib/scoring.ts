export function badgeFor(correct: number, total: number): { emoji: string; label: string } {
  if (total === 0) return { emoji: '❓', label: 'Nəticə yoxdur' }
  const ratio = correct / total
  if (ratio >= 0.9) return { emoji: '🥇', label: 'Qızıl bilik ustası' }
  if (ratio >= 0.7) return { emoji: '🥈', label: 'Gümüş bilik ustası' }
  if (ratio >= 0.5) return { emoji: '🥉', label: 'Bürünc bilik həvəskarı' }
  return { emoji: '💪', label: 'Davam et, bacararsan!' }
}

export const QUESTION_SECONDS = 20
export const POINTS_PER_CORRECT = 1
