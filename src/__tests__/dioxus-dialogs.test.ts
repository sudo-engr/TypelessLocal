import { expect, it } from 'vitest'
import { installModalFocus } from '../dioxus-dialogs'
it('focuses the form, traps both Tab directions, and restores its trigger', async () => {
  document.body.innerHTML = '<button id="trigger">교정 만들기</button>'
  const trigger = document.getElementById('trigger')!
  trigger.focus()
  installModalFocus()
  const dialog = document.createElement('div')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.innerHTML = '<input autofocus><button>저장</button>'
  document.body.append(dialog)
  await new Promise((resolve) => setTimeout(resolve, 0))
  const first = dialog.querySelector('input')!
  const last = dialog.querySelector('button')!
  expect(document.activeElement).toBe(first)
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }),
  )
  expect(document.activeElement).toBe(last)
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }))
  expect(document.activeElement).toBe(first)
  dialog.remove()
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(document.activeElement).toBe(trigger)
  dispatchEvent(new Event('beforeunload'))
})
