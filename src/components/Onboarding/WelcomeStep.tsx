import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { invoke } from '@tauri-apps/api/core'
import { UI_LANGUAGES } from '../../lib/constants'
import { useAppStore } from '../../stores/appStore'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import logo from '../../assets/typelesslocal.svg'

export function WelcomeStep() {
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
    <div className="space-y-5">
      <Card>
        <CardContent className="text-center">
          <img src={logo} alt="" className="mx-auto mb-3 h-11 w-11" aria-hidden="true" />
          <p className="text-body leading-relaxed text-text-secondary">
            한국어 음성을 이 컴퓨터의 Whisper로 받아씁니다. 녹음이 끝나면 텍스트를 입력합니다.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
            첫 모델 설치에만 인터넷이 필요합니다. 모델이 준비되면 음성은 이 컴퓨터에서만 처리됩니다.
          </p>
        </CardContent>
      </Card>

      <div>
        <p className="mb-3 text-footnote font-medium text-text-secondary">
          {t('onboarding.selectLanguage')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {UI_LANGUAGES.map((lang) => (
            <Button
              key={lang.value}
              type="button"
              onClick={() => handleSelectLanguage(lang.value)}
              variant={currentLang === lang.value ? 'selected' : 'secondary'}
              size="lg"
              className="justify-start"
              aria-pressed={currentLang === lang.value}
            >
              <span className="font-medium">{lang.label}</span>
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-tertiary">{t('onboarding.selectLanguageDesc')}</p>
      </div>
    </div>
  )
}
