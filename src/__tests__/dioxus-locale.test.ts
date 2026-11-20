import { expect, it } from 'vitest'
import { translate } from '../dioxus-locale'
it('retains Korean and reuses existing English and Japanese labels', () => {
  expect(translate('일반', 'ko')).toBe('일반')
  expect(translate('일반', 'en')).toBe('General')
  expect(translate('일반', 'ja')).not.toBe('일반')
})
it('provides English fallback for new Dioxus UI copy', () => {
  expect(translate('오늘도 편하게 말하세요', 'en')).not.toMatch(/[가-힣]/)
  expect(translate('오늘도 편하게 말하세요', 'de')).not.toMatch(/[가-힣]/)
})
it('leaves content outside the UI catalog unchanged', () => {
  expect(translate('사용자가 직접 작성한 고유한 문장 987', 'en')).toBe(
    '사용자가 직접 작성한 고유한 문장 987',
  )
})
