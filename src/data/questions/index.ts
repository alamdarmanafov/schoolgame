import type { QuestionBank } from '../../types'
import * as riyaziyyat from './riyaziyyat'
import * as cografiya from './cografiya'
import * as tarix from './tarix'
import * as ingilis from './ingilis'
import * as azdili from './azdili'
import * as fizika from './fizika'
import * as kimya from './kimya'

export const questionBank: QuestionBank = {
  riyaziyyat: { asan: riyaziyyat.asan, orta: riyaziyyat.orta, cetin: riyaziyyat.cetin },
  cografiya: { asan: cografiya.asan, orta: cografiya.orta, cetin: cografiya.cetin },
  tarix: { asan: tarix.asan, orta: tarix.orta, cetin: tarix.cetin },
  ingilis: { asan: ingilis.asan, orta: ingilis.orta, cetin: ingilis.cetin },
  azdili: { asan: azdili.asan, orta: azdili.orta, cetin: azdili.cetin },
  fizika: { asan: fizika.asan, orta: fizika.orta, cetin: fizika.cetin },
  kimya: { asan: kimya.asan, orta: kimya.orta, cetin: kimya.cetin },
}
