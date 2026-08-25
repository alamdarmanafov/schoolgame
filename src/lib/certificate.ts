const AZ_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
]

export function monthLabel(d: Date): string {
  return `${AZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export interface CertificateParams {
  name: string
  score: number
  periodLabel: string
}

export function generateCertificateDataUrl({ name, score, periodLabel }: CertificateParams): string {
  const W = 1200
  const H = 800
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#f5f5ff')
  bg.addColorStop(1, '#fdf4ff')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Outer gradient border
  const border = ctx.createLinearGradient(0, 0, W, H)
  border.addColorStop(0, '#4f46e5')
  border.addColorStop(0.5, '#7c3aed')
  border.addColorStop(1, '#c026d3')
  ctx.strokeStyle = border
  ctx.lineWidth = 14
  roundRect(ctx, 30, 30, W - 60, H - 60, 24)
  ctx.stroke()

  // Inner thin border
  ctx.strokeStyle = '#c7d2fe'
  ctx.lineWidth = 2
  roundRect(ctx, 54, 54, W - 108, H - 108, 18)
  ctx.stroke()

  const cx = W / 2

  // Medal: ribbon
  const medalY = 168
  ctx.fillStyle = '#4f46e5'
  ctx.beginPath()
  ctx.moveTo(cx - 42, medalY + 8)
  ctx.lineTo(cx - 12, medalY + 92)
  ctx.lineTo(cx, medalY + 50)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#a21caf'
  ctx.beginPath()
  ctx.moveTo(cx + 42, medalY + 8)
  ctx.lineTo(cx + 12, medalY + 92)
  ctx.lineTo(cx, medalY + 50)
  ctx.closePath()
  ctx.fill()

  // Medal: circle
  const medalGrad = ctx.createLinearGradient(cx - 56, medalY - 56, cx + 56, medalY + 56)
  medalGrad.addColorStop(0, '#fbbf24')
  medalGrad.addColorStop(1, '#f59e0b')
  ctx.fillStyle = medalGrad
  ctx.beginPath()
  ctx.arc(cx, medalY, 56, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 5
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 52px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('1', cx, medalY + 4)

  // Eyebrow
  ctx.fillStyle = '#4338ca'
  ctx.font = '600 26px system-ui, sans-serif'
  ctx.fillText('B İ L İ K   U S T A S I', cx, 282)

  // Title
  const titleGrad = ctx.createLinearGradient(cx - 260, 0, cx + 260, 0)
  titleGrad.addColorStop(0, '#4f46e5')
  titleGrad.addColorStop(1, '#c026d3')
  ctx.fillStyle = titleGrad
  ctx.font = 'bold 46px system-ui, sans-serif'
  ctx.fillText('AYIN QALİBİ SERTİFİKATI', cx, 336)

  // Winner name
  ctx.fillStyle = '#0f172a'
  let nameFontSize = 66
  ctx.font = `bold ${nameFontSize}px system-ui, sans-serif`
  while (ctx.measureText(name).width > W - 220 && nameFontSize > 32) {
    nameFontSize -= 4
    ctx.font = `bold ${nameFontSize}px system-ui, sans-serif`
  }
  ctx.fillText(name, cx, 452)

  // Subtitle
  ctx.fillStyle = '#475569'
  ctx.font = '26px system-ui, sans-serif'
  ctx.fillText(`${periodLabel} ayında ən çox xal toplayan qalib`, cx, 510)

  // Score
  ctx.fillStyle = '#4f46e5'
  ctx.font = 'bold 38px system-ui, sans-serif'
  ctx.fillText(`${score} xal`, cx, 568)

  // Divider
  ctx.strokeStyle = '#c7d2fe'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - 200, 650)
  ctx.lineTo(cx + 200, 650)
  ctx.stroke()

  // Footer
  ctx.fillStyle = '#64748b'
  ctx.font = '20px system-ui, sans-serif'
  ctx.fillText('Bilik Ustası Komandası', cx, 684)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '16px system-ui, sans-serif'
  const today = new Date()
  ctx.fillText(`${today.getDate()} ${monthLabel(today)}`, cx, 712)

  return canvas.toDataURL('image/png')
}

export function downloadCertificate(params: CertificateParams) {
  const dataUrl = generateCertificateDataUrl(params)
  const safeName = params.name.replace(/[^\p{L}\p{N}]+/gu, '-')
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `bilik-ustasi-sertifikat-${safeName}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
