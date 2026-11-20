import { expect, it } from 'vitest'
import { shortcutFromKey } from '../dioxus-shortcut'
const key = (code: string, key: string, modifiers = {}) => ({
  code,
  key,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...modifiers,
})
it('uses physical keys for Korean input and keeps comma shortcuts intact', () => {
  expect(shortcutFromKey(key('KeyK', 'ㅏ', { metaKey: true }), true)).toBe('Command+K')
  expect(shortcutFromKey(key('Comma', ',', { ctrlKey: true }), false)).toBe('Ctrl+,')
  expect(shortcutFromKey(key('ShiftLeft', 'Shift', { shiftKey: true }), true)).toBeNull()
})
