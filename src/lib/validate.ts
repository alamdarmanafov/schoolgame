// Whitelist-based validation for the registration form. Since this app has
// no backend, these checks are purely client-side hygiene: they stop
// malformed data and HTML/script-like input from ever entering
// localStorage or being rendered, rather than guarding a server boundary.

const EMAIL_RE = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/

// Letters (incl. Azerbaijani: ə ö ü ç ş ğ ı İ), spaces, hyphens, apostrophes.
const NAME_RE = /^[\p{L}][\p{L} '-]{1,19}$/u

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidEmail(raw: string): boolean {
  const email = raw.trim()
  return email.length <= 60 && EMAIL_RE.test(email)
}

export function isValidName(raw: string): boolean {
  const name = raw.trim()
  return NAME_RE.test(name)
}
