export interface Partner {
  id: string
  name: string
  emoji: string
  discount: string
  gradient: string
}

// Placeholder partners — swap the name/emoji/discount with your real
// partner's branding and logo once you have an actual agreement with them.
export const partners: Partner[] = [
  { id: 'restaurant', name: 'Tərəfdaş Restoran', emoji: '🍽️', discount: '20% endirim', gradient: 'from-orange-500 to-red-600' },
  { id: 'bookstore', name: 'Tərəfdaş Kitab Mağazası', emoji: '📚', discount: '15% endirim', gradient: 'from-sky-500 to-indigo-600' },
  { id: 'entertainment', name: 'Tərəfdaş Əyləncə Mərkəzi', emoji: '🎮', discount: '25% endirim', gradient: 'from-fuchsia-500 to-purple-600' },
]
