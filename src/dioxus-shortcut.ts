import { invoke } from '@tauri-apps/api/core'

export function shortcutFromKey(
  event: Pick<KeyboardEvent, 'key' | 'code' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey'>,
  mac: boolean,
): string | null {
  if (['Control', 'Alt', 'Meta', 'Shift'].includes(event.key)) return null
  const named: Record<string, string> = {
    Space: 'Space',
    Slash: '/',
    Period: '.',
    Comma: ',',
    Semicolon: ';',
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
  }
  const primary =
    named[event.code] ??
    (/^(Key[A-Z]|Digit[0-9])$/.test(event.code)
      ? event.code.replace(/^(Key|Digit)/, '')
      : event.key)
  if (!primary || primary === 'Unidentified' || primary === 'Dead') return null
  return [
    event.ctrlKey && 'Ctrl',
    event.altKey && (mac ? 'Option' : 'Alt'),
    event.shiftKey && 'Shift',
    event.metaKey && (mac ? 'Command' : 'Super'),
    primary,
  ]
    .filter(Boolean)
    .join('+')
}

export async function captureShortcut(): Promise<string | null> {
  await invoke('pause_hotkey')
  try {
    return await new Promise((resolve) => {
      const controller = new AbortController()
      const finish = (shortcut: string | null) => {
        clearTimeout(timer)
        controller.abort()
        resolve(shortcut)
      }
      const timer = setTimeout(() => finish(null), 30_000)
      addEventListener(
        'keydown',
        (event) => {
          event.preventDefault()
          event.stopImmediatePropagation()
          if (event.key === 'Escape') {
            finish(null)
            return
          }
          const shortcut = shortcutFromKey(event, navigator.platform.toUpperCase().includes('MAC'))
          if (shortcut) finish(shortcut)
        },
        { capture: true, signal: controller.signal },
      )
      for (const event of ['blur', 'hashchange', 'beforeunload'])
        addEventListener(event, () => finish(null), { signal: controller.signal })
    })
  } finally {
    await invoke('resume_hotkey')
  }
}
