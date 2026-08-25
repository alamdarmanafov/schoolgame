import type { HighScore } from '../types'

export interface TopScorer {
  key: string
  name: string
  total: number
}

export function startOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function topScorer(highScores: HighScore[], since: Date): TopScorer | null {
  const totals = new Map<string, TopScorer>()

  for (const h of highScores) {
    const date = new Date(h.date)
    if (date < since) continue
    const key = (h.email || h.name).trim().toLowerCase()
    const entry = totals.get(key) ?? { key, name: h.name, total: 0 }
    entry.total += h.score
    entry.name = h.name
    totals.set(key, entry)
  }

  let best: TopScorer | null = null
  for (const v of totals.values()) {
    if (!best || v.total > best.total) best = v
  }
  return best
}
