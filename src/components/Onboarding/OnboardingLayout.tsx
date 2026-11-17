import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StepIndicator } from './StepIndicator'
import { Button } from '../ui/button'
import logo from '../../assets/typelesslocal.svg'

interface Props {
  step: number
  totalSteps: number
  title: string
  subtitle?: string
  canNext: boolean
  canBack: boolean
  nextLabel?: string
  onNext: () => void
  onBack: () => void
  onSkip?: () => void
  children: React.ReactNode
}

export function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  canNext,
  canBack,
  nextLabel,
  onNext,
  onBack,
  onSkip,
  children,
}: Props) {
  const { t } = useTranslation()
  const handleClose = () => {
    import('@tauri-apps/api/core')
      .then(({ invoke }) => invoke('plugin:process|exit', { code: 0 }))
      .catch(() => {})
  }

  return (
    <div className="flex h-full w-full flex-col bg-bg-primary">
      <div
        className="flex items-center justify-between border-b border-border px-5 py-3"
        data-tauri-drag-region
      >
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="h-5 w-5 dark:invert" aria-hidden="true" />
          <span className="text-footnote font-semibold">TypelessLocal</span>
        </div>
        <button
          onClick={handleClose}
          className="cursor-pointer rounded-md border border-transparent bg-transparent p-1.5 text-text-tertiary transition-colors hover:border-border hover:bg-bg-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={t('onboarding.layout.close')}
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between px-8 pb-2 pt-5">
        <div className="w-16" />
        <StepIndicator total={totalSteps} current={step} />
        {onSkip ? (
          <button
            onClick={onSkip}
            className="w-16 cursor-pointer border-none bg-transparent text-right text-xs text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t('onboarding.layout.skip')}
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      <div className="px-8 pb-5 pt-3 text-center">
        <h1 className="text-title font-semibold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-1.5 text-footnote text-text-secondary">{subtitle}</p>}
      </div>

      <div className="flex-1 overflow-y-auto px-8">
        <div className="mx-auto max-w-90 pb-6">{children}</div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-8 py-4">
        <div className="w-16">
          {canBack && (
            <Button type="button" variant="ghost" size="sm" onClick={onBack}>
              {t('onboarding.layout.back')}
            </Button>
          )}
        </div>
        <Button type="button" onClick={onNext} disabled={!canNext} className="min-w-28">
          {nextLabel}
        </Button>
      </div>
    </div>
  )
}
