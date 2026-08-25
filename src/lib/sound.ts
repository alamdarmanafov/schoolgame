const MUTE_KEY = 'az-school-quiz-muted'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function isMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function setMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    // ignore
  }
}

function beep(freq: number, duration: number, type: OscillatorType = 'sine', startDelay = 0, volume = 0.15) {
  if (isMuted()) return
  const audioCtx = getCtx()
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = volume
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  const t = audioCtx.currentTime + startDelay
  osc.start(t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.stop(t + duration)
}

export function playCorrect() {
  beep(660, 0.1)
  beep(880, 0.14, 'sine', 0.09)
}

export function playWrong() {
  beep(220, 0.28, 'sawtooth', 0, 0.1)
}

export function playComplete() {
  ;[523, 659, 784, 1046].forEach((f, i) => beep(f, 0.16, 'sine', i * 0.12))
}

export function playClick() {
  beep(440, 0.05, 'triangle', 0, 0.06)
}

export function playAchievement() {
  ;[784, 988, 1175].forEach((f, i) => beep(f, 0.2, 'triangle', i * 0.1, 0.12))
}
