import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { saveOnboardingCompleted, saveOnboardingConfig } from '../../lib/tauri'
import { useAppStore } from '../../stores/appStore'
import { slideRight } from '../../lib/animations'
import { DoneStep } from './DoneStep'
import { LocalModelSetupStep } from './LocalModelSetupStep'
import { LocalPermissionsStep } from './LocalPermissionsStep'
import { OnboardingLayout } from './OnboardingLayout'
import { WelcomeStep } from './WelcomeStep'

const TOTAL_STEPS = 4

/**
 * First-run flow for the local-only build. There is deliberately no account,
 * provider picker, API-key field, or remote LLM setup in this flow.
 */
export function Onboarding() {
  const { t } = useTranslation()
  const [saveFailed, setSaveFailed] = useState(false)
  const step = useAppStore((state) => state.onboardingStep)
  const setStep = useAppStore((state) => state.setOnboardingStep)
  const setOnboardingCompleted = useAppStore((state) => state.setOnboardingCompleted)
  const sttTestStatus = useAppStore((state) => state.sttTestStatus)
  const config = useAppStore((state) => state.config)
  const setConfig = useAppStore((state) => state.setConfig)
  const setSavedConfig = useAppStore((state) => state.setSavedConfig)

  const canNext = step === 1 ? sttTestStatus === 'success' : true
  const titles = [
    {
      title: 'TypelessLocal 로컬 받아쓰기',
      subtitle: '첫 모델을 내려받으면, 이후 받아쓰기는 이 컴퓨터에서 처리합니다.',
    },
    {
      title: '한국어 모델 준비',
      subtitle: '두 Whisper 모델 중 선택해 내려받거나 기존 파일을 검증합니다.',
    },
    {
      title: '권한 확인',
      subtitle: '음성 녹음과 결과 입력에 필요한 권한만 확인합니다.',
    },
    { title: '준비가 끝났습니다', subtitle: undefined },
  ]

  const saveConfig = async (draft = config) => {
    setSaveFailed(false)
    try {
      return await saveOnboardingConfig(draft)
    } catch (error) {
      setSaveFailed(true)
      throw error
    }
  }

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      try {
        await saveConfig(config)
      } catch {
        // Keep the setup navigable so a transient storage error can be retried.
      }
      setStep(step + 1)
      return
    }

    try {
      // Keep these invariants at the final boundary even if the user entered
      // onboarding with an old cloud configuration.
      const localConfig = {
        ...config,
        stt_provider: 'local-whisper' as const,
        stt_language: 'ko',
        polish_enabled: false,
        translate_enabled: false,
      }
      const saved = await saveConfig(localConfig)
      await saveOnboardingCompleted()
      setConfig(saved)
      setSavedConfig(saved)
      setOnboardingCompleted(true)
    } catch {
      setSaveFailed(true)
    }
  }

  const handleBack = async () => {
    if (step <= 0) return
    try {
      await saveConfig(config)
    } catch {
      // Best effort; the user can retry saving from the next step.
    }
    // Older upstream installations persisted a cloud wizard position. Keep
    // the stale Permissions position navigable for one upgrade, while the
    // main app resets it to the local model step when no model is configured.
    setStep(step === 5 ? 2 : step - 1)
  }

  return (
    <OnboardingLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      title={titles[step]?.title ?? titles[0].title}
      subtitle={titles[step]?.subtitle}
      canNext={canNext}
      canBack={step > 0}
      nextLabel={step === TOTAL_STEPS - 1 ? '시작하기' : t('onboarding.layout.next')}
      onNext={handleNext}
      onBack={handleBack}
    >
      {saveFailed && (
        <p role="alert" className="mb-3 text-sm text-error">
          {t('common.saveFailed')}
        </p>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideRight}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {step === 0 && <WelcomeStep />}
          {step === 1 && <LocalModelSetupStep />}
          {step === 2 && <LocalPermissionsStep />}
          {step === 3 && <DoneStep />}
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  )
}
