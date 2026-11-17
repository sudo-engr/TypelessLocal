import { Home, Settings, History } from '../Icons'
import { useTranslation } from 'react-i18next'
import { useRoute, type Route } from '../../lib/router'
import { useAppStore } from '../../stores/appStore'
import { AccessibilityBanner } from './AccessibilityBanner'
import { CloudServiceBanner } from './CloudServiceBanner'
import logo from '../../assets/typelesslocal.svg'

const baseNavItems: { id: Route; labelKey: string; icon: typeof Home }[] = [
  { id: 'home', labelKey: 'nav.home', icon: Home },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings },
  { id: 'history', labelKey: 'nav.history', icon: History },
]

interface Props {
  children: React.ReactNode
}

export function MainLayout({ children }: Props) {
  const { route, navigate } = useRoute()
  const localOnly = useAppStore((state) => state.config.stt_provider === 'local-whisper')
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full bg-bg-primary text-text-primary">
      <aside className="flex w-54 shrink-0 flex-col border-r border-border bg-bg-primary">
        <div className="border-b border-border px-4 pb-4 pt-5" data-tauri-drag-region>
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="h-7 w-7 shrink-0 dark:invert" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="truncate text-body font-semibold tracking-tight">TypelessLocal</h1>
              <p className="mt-0.5 truncate text-caption text-text-tertiary">{t('app.tagline')}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-bg-primary px-3 py-2 text-caption text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
            <span>로컬 모드</span>
            <span className="ml-auto text-text-tertiary">오프라인</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4" aria-label={t('nav.mainNavigation')}>
          {baseNavItems.map(({ id, labelKey, icon: Icon }) => {
            const active = route === id
            const label = t(labelKey)
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-left text-footnote transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? 'border-accent bg-accent font-medium text-white'
                    : 'border-transparent bg-transparent text-text-secondary hover:border-border hover:bg-bg-tertiary hover:text-text-primary'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-bg-primary">
        <AccessibilityBanner />
        {!localOnly && <CloudServiceBanner />}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
