import { useTranslation } from 'react-i18next'
import { invoke } from '@tauri-apps/api/core'
import i18n from '../../i18n'
import brandIcon from '../../assets/typelesslocal.svg'
import { ExternalLink } from '../Icons'
import { openUrl } from '@tauri-apps/plugin-opener'
import { useAppStore } from '../../stores/appStore'
import { APP_NAME, APP_VERSION, APP_REPO_URL, UI_LANGUAGES } from '../../lib/constants'

export function AboutPane() {
  const { t } = useTranslation()
  const config = useAppStore((s) => s.config)
  const updateConfig = useAppStore((s) => s.updateConfig)

  const currentLang = config.ui_language || i18n.language || 'en'

  const handleSelectLanguage = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('ui_language', value)
    updateConfig({ ui_language: value })
    invoke('refresh_tray_labels').catch(() => {})
  }

  return (
    <div className="space-y-5 text-footnote">
      {/* Header */}
      <div className="text-center py-6">
        <img src={brandIcon} alt="" className="mx-auto mb-4 h-14 w-14 dark:invert" />
        <h2 className="text-title font-semibold text-text-primary">{APP_NAME}</h2>
        <p className="text-text-secondary mt-1 text-footnote">{APP_VERSION}</p>
      </div>

      <p className="text-text-secondary leading-relaxed">{t('settings.aboutDescription')}</p>

      {/* Language */}
      <SectionCard title={t('settings.language')}>
        <div className="grid grid-cols-2 gap-3 p-3">
          {UI_LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => handleSelectLanguage(lang.value)}
              className={`px-4 py-3 rounded-md text-footnote border cursor-pointer transition-all ${
                currentLang === lang.value
                  ? 'bg-accent/10 border-accent text-accent font-medium'
                  : 'bg-bg-secondary border-border text-text-primary hover:border-text-tertiary'
              }`}
            >
              <div className="font-medium">{lang.label}</div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Open Source */}
      <SectionCard title={t('settings.openSource')}>
        <InfoRow label={t('settings.license')} value={t('settings.mit')} />
        <LinkRow label={t('settings.github')} url={APP_REPO_URL} linkText={t('settings.view')} />
        <InfoRow label={t('settings.framework')} value={t('settings.tauriReact')} />
      </SectionCard>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="px-3 py-2.5 bg-bg-secondary/50 border-b border-border">
        <h3 className="text-footnote font-medium text-text-primary">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-3 py-2.5 border-b border-border last:border-b-0">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  )
}

function LinkRow({ label, url, linkText }: { label: string; url: string; linkText: string }) {
  return (
    <button
      onClick={() => openUrl(url)}
      className="flex justify-between items-center w-full px-3 py-2.5 border-b border-border last:border-b-0 bg-transparent border-x-0 border-t-0 cursor-pointer text-footnote"
    >
      <span className="text-text-secondary">{label}</span>
      <span className="text-accent flex items-center gap-1">
        {linkText} <ExternalLink size={12} />
      </span>
    </button>
  )
}
