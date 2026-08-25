import type { Subject } from '../types'

export const subjects: Subject[] = [
  { id: 'riyaziyyat', name: 'Riyaziyyat', emoji: '\u{1F522}', gradient: 'from-sky-500 to-blue-600' },
  { id: 'cografiya', name: 'Coğrafiya', emoji: '\u{1F30D}', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'tarix', name: 'Tarix', emoji: '\u{1F3DB}\u{FE0F}', gradient: 'from-amber-500 to-orange-600' },
  { id: 'ingilis', name: 'İngilis dili', emoji: '\u{1F1EC}\u{1F1E7}', gradient: 'from-rose-500 to-pink-600' },
  { id: 'azdili', name: 'Azərbaycan dili', emoji: '\u{1F4D6}', gradient: 'from-violet-500 to-purple-600' },
  { id: 'fizika', name: 'Fizika', emoji: '\u{26A1}', gradient: 'from-cyan-500 to-blue-700' },
  { id: 'kimya', name: 'Kimya', emoji: '\u{1F9EA}', gradient: 'from-lime-500 to-green-600' },
]

export const difficultyMeta: Record<string, { label: string; grade: string }> = {
  asan: { label: 'Asan', grade: '5–6-cı sinif' },
  orta: { label: 'Orta', grade: '7–9-cu sinif' },
  cetin: { label: 'Çətin', grade: '10–11-ci sinif' },
}
