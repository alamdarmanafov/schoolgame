const THEME_KEY = 'az-school-quiz-theme'

export function isDark(): boolean {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'dark'
  } catch {
    return false
  }
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  try {
    window.localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  } catch {
    // ignore
  }
}

export function initTheme() {
  applyTheme(isDark())
}
