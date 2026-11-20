/** Keep keyboard focus inside the currently rendered modal and restore its trigger. */
export function installModalFocus() {
  let active: HTMLElement | null = null
  let trigger: HTMLElement | null = null
  const controls = () =>
    active
      ? [
          ...active.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        ].filter((element) => !element.closest('[hidden]'))
      : []
  const sync = () => {
    const dialogs = [
      ...document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'),
    ]
    const next = dialogs[dialogs.length - 1] ?? null
    if (next === active) return
    if (!next) {
      active = null
      if (trigger?.isConnected) trigger.focus()
      trigger = null
      return
    }
    trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    active = next
    ;(next.querySelector<HTMLElement>('[autofocus]') ?? controls()[0] ?? next).focus()
  }
  const trap = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !active) return
    const items = controls()
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) {
      event.preventDefault()
      active.focus()
      return
    }
    if (
      !active.contains(document.activeElement) ||
      (event.shiftKey ? document.activeElement === first : document.activeElement === last)
    ) {
      event.preventDefault()
      ;(event.shiftKey ? last : first).focus()
    }
  }
  const observer = new MutationObserver(sync)
  observer.observe(document.body, { childList: true, subtree: true })
  document.addEventListener('keydown', trap, true)
  sync()
  addEventListener(
    'beforeunload',
    () => {
      observer.disconnect()
      document.removeEventListener('keydown', trap, true)
    },
    { once: true },
  )
}
