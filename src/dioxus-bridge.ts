import { invoke as tauriInvoke, isTauri } from '@tauri-apps/api/core'
import { listen, emitTo } from '@tauri-apps/api/event'
import { getCurrentWindow, Window } from '@tauri-apps/api/window'
import { load } from '@tauri-apps/plugin-store'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { openUrl } from '@tauri-apps/plugin-opener'
import { createEventQueue } from './dioxus-events'
import { resizeCapsule } from './dioxus-native'
import { captureShortcut } from './dioxus-shortcut'
import { translate } from './dioxus-locale'
import { importCustomScenesJson, serializeCustomScenes } from './lib/scenes/sceneImportExport'

const events = createEventQueue()
const disposers: (() => void)[] = []
let ready: Promise<void>
let appearance = 'system'
const dark = matchMedia('(prefers-color-scheme: dark)')
const applyTheme = () =>
  document.documentElement.classList.toggle(
    'dark',
    appearance === 'dark' || (appearance === 'system' && dark.matches),
  )
dark.addEventListener('change', applyTheme)

async function initialize() {
  addEventListener('hashchange', () => events.push('route', location.hash || '#/'))
  if (!isTauri()) return
  for (const name of [
    'pipeline:state',
    'audio:volume',
    'stt:partial',
    'stt:final',
    'pipeline:error',
    'pipeline:warning',
    'pipeline:insert_result',
    'pipeline:target_app',
    'recording:deadline',
    'recording:deadline-warning',
    'recording:deadline-reached',
    'config:patch',
    'local-model:download-progress',
    'hotkey:registration-failed',
    'hotkey:registration-recovered',
    'ask:result',
    'ask:error',
  ]) {
    if (name === 'audio:volume' && location.hash !== '#capsule') continue
    disposers.push(await listen(name, (event) => events.push(name, event.payload)))
  }
  for (const [event, hash] of [
    ['tray:settings', '#/settings'],
    ['tray:history', '#/history'],
    ['tray:about', '#/settings?pane=about'],
  ]) {
    disposers.push(
      await listen(event, () => {
        location.hash = hash
      }),
    )
  }
  disposers.push(
    await listen<string>('navigate', (event) => {
      location.hash = event.payload
    }),
  )
}

function importFile() {
  return new Promise<{ bytes: number[]; name: string } | null>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.csv,.json'
    input.addEventListener('cancel', () => resolve(null), { once: true })
    input.addEventListener(
      'change',
      async () => {
        const file = input.files?.[0]
        if (!file) {
          resolve(null)
          return
        }
        try {
          if (file.size > 10 * 1024 * 1024) throw new Error('가져올 파일은 10MB 이하여야 합니다.')
          resolve({ bytes: Array.from(new Uint8Array(await file.arrayBuffer())), name: file.name })
        } catch (error) {
          reject(error)
        }
      },
      { once: true },
    )
    input.click()
  })
}

function exportFile({
  text,
  name,
  mime = 'application/json',
}: {
  text: string
  name: string
  mime?: string
}) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }))
  const link = document.createElement('a')
  link.href = url
  link.download = name.replace(/[\\/]/g, '_')
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function call(command: string, rawArgs: string) {
  const args = JSON.parse(rawArgs) ?? {}
  if (command === 'ui_ready') {
    if (isTauri() && getCurrentWindow().label === 'main') await getCurrentWindow().show()
    return null
  }
  await ready
  switch (command) {
    case 'ui_bootstrap': {
      if (!isTauri())
        throw new Error(
          '데스크톱 앱에서 실행해 주세요. 브라우저에서는 마이크·설정 저장 등 네이티브 기능을 연결할 수 없습니다.',
        )
      const store = await load('settings.json')
      return {
        route: location.hash || '#/',
        onboarded: (await store.get('onboarding_completed')) === true,
      }
    }
    case 'ui_next_event':
      return events.next()
    case 'ui_complete_onboarding': {
      const store = await load('settings.json')
      await store.set('onboarding_completed', true)
      await store.save()
      return null
    }
    case 'ui_copy':
      await writeText(String(args.text))
      return null
    case 'ui_window_hide':
      await getCurrentWindow().hide()
      return null
    case 'ui_window_drag':
      await getCurrentWindow().startDragging()
      return null
    case 'ui_capsule_resize':
      await resizeCapsule(args)
      return null
    case 'ui_main_navigate': {
      const main = await Window.getByLabel('main')
      if (!main) throw new Error('메인 창을 찾지 못했습니다.')
      await emitTo('main', 'navigate', args.hash)
      await main.show()
      await main.setFocus()
      return null
    }
    case 'ui_theme':
      appearance = args.theme
      document.documentElement.lang = args.language || 'ko'
      applyTheme()
      return null
    case 'ui_reload':
      location.reload()
      return null
    case 'wait_for_accessibility_permission': {
      const deadline = Date.now() + 60_000
      while (true) {
        const trusted = await tauriInvoke<boolean>('check_accessibility_permission')
        if (trusted || Date.now() >= deadline) return trusted
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    case 'ui_capture_shortcut':
      return captureShortcut()
    case 'ui_uuid':
      return crypto.randomUUID()
    case 'ui_now':
      return new Date().toISOString()
    case 'ui_scene_export':
      return serializeCustomScenes(args.scenes)
    case 'ui_scene_import':
      return importCustomScenesJson(args.text, {
        existingIds: new Set<string>(args.existingIds ?? []),
        createId: () => crypto.randomUUID(),
        nowIso: () => new Date().toISOString(),
      })
    case 'ui_import_file':
      return importFile()
    case 'ui_export_file':
      exportFile(args)
      return null
    case 'ui_request_microphone': {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      return null
    }
    case 'ui_open_external': {
      const url = new URL(args.url)
      if (url.protocol !== 'https:') throw new Error('HTTPS 링크만 열 수 있습니다.')
      await openUrl(url.href)
      return null
    }
    default:
      return tauriInvoke(command, args)
  }
}

export function installBridge() {
  ready = initialize()
  // Attach a rejection handler immediately; callers still receive the initialization failure.
  ready.catch((error) => console.error('Tauri 이벤트 연결 실패:', error))
  Object.defineProperty(window, 'typeless', {
    value: {
      translate,
      async invoke(command: string, args: string) {
        try {
          return JSON.stringify((await call(command, args)) ?? null)
        } catch (error) {
          throw typeof error === 'string'
            ? error
            : error instanceof Error
              ? error.message
              : JSON.stringify(error)
        }
      },
    },
    configurable: true,
  })
  addEventListener('beforeunload', () => disposers.splice(0).forEach((dispose) => dispose()), {
    once: true,
  })
}
