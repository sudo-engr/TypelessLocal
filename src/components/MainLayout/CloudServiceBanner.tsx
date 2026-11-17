import { useTranslation } from 'react-i18next'
import { useCloudServiceStore } from '../../stores/cloudServiceStore'

export function CloudServiceBanner() {
  const incident = useCloudServiceStore((state) => state.incident)
  const clearIncident = useCloudServiceStore((state) => state.clearIncident)
  const { t } = useTranslation()

  if (!incident) return null

  const isStt = incident.kind === 'stt'
  const openSettings = () => {
    window.location.hash = `#/settings?pane=${isStt ? 'stt' : 'llm'}`
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className="border-b border-warning/25 bg-warning/5 px-3 py-2 text-xs text-text-primary"
      data-testid="cloud-service-banner"
    >
      <div className="mx-auto flex max-w-225 items-center gap-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-4 text-text-secondary">
          {isStt
            ? t('cloudRecovery.sttBody', 'Cloud speech is unavailable. Audio was not resent.')
            : t(
                'cloudRecovery.llmBody',
                'AI polishing is unavailable. The original text was kept.',
              )}
        </p>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={clearIncident}
            className="h-7 rounded-sm border border-warning/30 bg-transparent px-2 font-medium text-text-primary transition-colors hover:bg-bg-tertiary"
          >
            {t('cloudRecovery.tryAgain', 'Try again')}
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="h-7 rounded-sm border border-border bg-transparent px-2 font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            {isStt
              ? t('cloudRecovery.openSttSettings', 'Settings')
              : t('cloudRecovery.openLlmSettings', 'Settings')}
          </button>
        </div>
      </div>
    </section>
  )
}
