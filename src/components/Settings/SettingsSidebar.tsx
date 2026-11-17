import { Settings, Mic, Sparkles, BookOpen, Info, LayoutGrid } from '../Icons'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../stores/appStore'

const PANES = [
  { id: 'general', labelKey: 'settings.general', icon: Settings },
  { id: 'stt', labelKey: 'settings.speechRecognition', icon: Mic },
  { id: 'llm', labelKey: 'settings.aiPolish', icon: Sparkles },
  { id: 'dictionary', labelKey: 'settings.dictionary', icon: BookOpen },
  { id: 'scenes', labelKey: 'settings.scenes', icon: LayoutGrid },
  { id: 'about', labelKey: 'settings.about', icon: Info },
] as const

export type PaneId = (typeof PANES)[number]['id']

interface Props {
  activePane: PaneId
  onSelect: (id: PaneId) => void
}

export function SettingsSidebar({ activePane, onSelect }: Props) {
  const { t } = useTranslation()
  const localOnly = useAppStore((state) => state.config.stt_provider === 'local-whisper')
  const visiblePanes = localOnly ? PANES.filter((pane) => pane.id !== 'llm') : PANES

  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r border-border bg-bg-primary px-2 py-4">
      <div className="mb-3 px-3">
        <p className="text-caption font-medium uppercase tracking-wider text-text-tertiary">
          TypelessLocal
        </p>
        <h2 className="mt-1 text-sm font-semibold text-text-primary">{t('settings.title')}</h2>
      </div>
      {visiblePanes.map((pane) => {
        const Icon = pane.icon
        const isActive = activePane === pane.id
        return (
          <button
            key={pane.id}
            onClick={() => onSelect(pane.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-left text-footnote transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              isActive
                ? 'border-accent bg-accent font-medium text-white'
                : 'border-transparent bg-transparent text-text-secondary hover:border-border hover:bg-bg-tertiary hover:text-text-primary'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{t(pane.labelKey)}</span>
          </button>
        )
      })}
    </aside>
  )
}
