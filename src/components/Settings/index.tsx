import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../stores/appStore'
import { SettingsSidebar, type PaneId } from './SettingsSidebar'
import { GeneralPane } from './GeneralPane'
import { SttPane } from './SttPane'
import { LlmPane } from './LlmPane'
import { LocalOnlyLlmPane } from './LocalOnlyLlmPane'
import { DictionaryPane } from './DictionaryPane'
import { ScenesPane } from './ScenesPane'
import { AboutPane } from './AboutPane'
import { DirtyBar } from './shared/DirtyBar'
import { useDirtyConfig } from './shared/useDirtyConfig'

const paneTitleKeys: Record<PaneId, string> = {
  general: 'settings.general',
  stt: 'settings.speechRecognition',
  llm: 'settings.aiPolish',
  dictionary: 'settings.dictionary',
  scenes: 'settings.scenes',
  about: 'settings.about',
}

function paneFromHash(): PaneId | null {
  const query = window.location.hash.split('?')[1]
  if (!query) return null
  const requested = new URLSearchParams(query).get('pane')
  return requested && requested in paneTitleKeys ? (requested as PaneId) : null
}

export function Settings() {
  const [activePane, setActivePane] = useState<PaneId>(() => paneFromHash() ?? 'general')
  const contentRef = useRef<HTMLDivElement | null>(null)
  const config = useAppStore((s) => s.config)
  const setSavedConfig = useAppStore((s) => s.setSavedConfig)
  const isDirty = useDirtyConfig()
  const { t } = useTranslation()

  // First-run onboarding may enter Settings before MainApp has established backend truth.
  useEffect(() => {
    if (useAppStore.getState().savedConfig === null) setSavedConfig(config)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const syncRequestedPane = () => {
      const requested = paneFromHash()
      if (requested) setActivePane(requested)
    }
    window.addEventListener('hashchange', syncRequestedPane)
    return () => window.removeEventListener('hashchange', syncRequestedPane)
  }, [])

  useEffect(() => {
    contentRef.current?.scrollTo?.({ top: 0 })
  }, [activePane])

  return (
    <div className="flex h-full w-full flex-col bg-bg-primary text-text-primary">
      <div className="flex min-h-0 flex-1">
        <SettingsSidebar activePane={activePane} onSelect={setActivePane} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border px-7 py-5">
            <div>
              <p className="text-caption font-medium uppercase tracking-wider text-text-tertiary">
                Settings
              </p>
              <h2 className="mt-1 text-lg font-semibold">{t(paneTitleKeys[activePane])}</h2>
            </div>
            <span className="rounded-md border border-border bg-bg-secondary px-2.5 py-1 text-caption text-text-tertiary">
              로컬 전용
            </span>
          </header>

          <div
            ref={contentRef}
            className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-7 py-6"
          >
            <div className="w-full">
              {activePane === 'general' && <GeneralPane />}
              {activePane === 'stt' && <SttPane />}
              {activePane === 'llm' &&
                (config.stt_provider === 'local-whisper' ? <LocalOnlyLlmPane /> : <LlmPane />)}
              {activePane === 'dictionary' && <DictionaryPane />}
              {activePane === 'scenes' && <ScenesPane />}
              {activePane === 'about' && <AboutPane />}
            </div>
          </div>
        </div>
      </div>

      {isDirty && <DirtyBar />}
    </div>
  )
}
