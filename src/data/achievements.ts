import type { Achievement } from '../types'

export const achievements: Achievement[] = [
  {
    id: 'first-quiz',
    title: 'İlk Addım',
    description: 'İlk oyununu tamamladın',
    emoji: '🎯',
    check: (s) => s.totalPlayed >= 1,
  },
  {
    id: 'perfect',
    title: 'Mükəmməl!',
    description: 'Bir oyunda bütün sualları düzgün cavabladın',
    emoji: '💯',
    check: (s) => s.perfectScores >= 1,
  },
  {
    id: 'streak-master',
    title: 'Seriya Ustası',
    description: 'Bir oyunda 5 ardıcıl düzgün cavab verdin',
    emoji: '🔥',
    check: (s) => s.maxStreak >= 5,
  },
  {
    id: 'five-games',
    title: 'Davamlı Öyrənən',
    description: '5 oyun tamamladın',
    emoji: '📖',
    check: (s) => s.totalPlayed >= 5,
  },
  {
    id: 'all-subjects',
    title: 'Hər Şeyi Bilən',
    description: 'Bütün 7 fəndən ən azı bir oyun oynadın',
    emoji: '🌟',
    check: (s) => s.subjectsPlayed.length >= 7,
  },
  {
    id: 'ten-games',
    title: 'Bilik Toplayıcısı',
    description: '10 oyun tamamladın',
    emoji: '📚',
    check: (s) => s.totalPlayed >= 10,
  },
  {
    id: 'five-gold',
    title: 'Qızıl Kolleksiyası',
    description: '5 dəfə Qızıl bilik ustası nişanı qazandın',
    emoji: '🥇',
    check: (s) => s.goldBadges >= 5,
  },
]
