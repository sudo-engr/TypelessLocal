import { expect, it, vi } from 'vitest'
import { installIcons } from '../dioxus-icons'

it('mounts real Kubai SVG and refreshes an icon when Dioxus changes its name', async () => {
  document.body.innerHTML =
    '<button data-kubai-trigger>메뉴<span data-kubai-icon="mic" data-size="24"></span></button>'
  const row = document.querySelector('button')!
  const listen = vi.spyOn(row, 'addEventListener')
  installIcons()
  await Promise.resolve()
  expect(listen).toHaveBeenCalledWith('pointerenter', expect.any(Function))
  const host = document.querySelector('[data-kubai-icon]')!
  expect(host.querySelector('svg')?.classList.contains('kubai-icon-mic')).toBe(true)
  expect(host.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  host.setAttribute('data-kubai-icon', 'square')
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(host.querySelectorAll('svg')).toHaveLength(1)
  expect(host.querySelector('svg')?.classList.contains('kubai-icon-square')).toBe(true)
  host.setAttribute('data-kubai-icon', 'zap')
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(host.querySelector('svg')?.classList.contains('kubai-icon-sparkles')).toBe(true)
  dispatchEvent(new Event('beforeunload'))
})
