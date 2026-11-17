import { Mic, Settings, History, Crown, ArrowRight, ShieldCheck } from '../Icons'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../stores/appStore'
import { hasManagedCloudAccess, useAuthStore } from '../../stores/authStore'
import { useRoute } from '../../lib/router'

export function HomePage() {
  const config = useAppStore((s) => s.config)
  const history = useAppStore((s) => s.history)
  const { navigate } = useRoute()
  const {
    user,
    displayName,
    quotaModel,
    displayWordsUsedEstimate,
    displayWordsLimit,
    displayWordsResetAt,
    cloudWordsUsed,
    cloudWordsLimit,
    cloudWordsResetAt,
    sttSecondsUsed,
    sttSecondsLimit,
    llmTokensUsed,
    llmTokensLimit,
  } = useAuthStore()
  const { t } = useTranslation()
  const hasCloudAccess = useAuthStore(hasManagedCloudAccess)

  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const todayCount = history.filter((h) => h.created_at.startsWith(today)).length
  const wordsUsed =
    quotaModel === 'legacy_dual_meter' && displayWordsLimit > 0
      ? displayWordsUsedEstimate
      : cloudWordsUsed
  const wordsLimit =
    quotaModel === 'legacy_dual_meter' && displayWordsLimit > 0
      ? displayWordsLimit
      : cloudWordsLimit
  const wordsResetAt =
    quotaModel === 'legacy_dual_meter' && displayWordsLimit > 0
      ? displayWordsResetAt
      : cloudWordsResetAt

  return (
    <div className="mx-auto w-full max-w-230 space-y-6 p-6">
      {/* Welcome */}
      <div className="rounded-xl border border-border bg-bg-elevated p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-accent-light">
              <Mic size={18} className="text-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-1 text-caption font-medium uppercase tracking-widest text-text-tertiary">
                TypelessLocal
              </p>
              <h2 className="text-lg font-semibold tracking-tight">{t('home.welcome')}</h2>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-caption text-text-secondary">
            <ShieldCheck size={13} className="text-accent" aria-hidden="true" />
            로컬 처리
          </div>
        </div>
        <p className="mt-4 max-w-155 text-footnote leading-relaxed text-text-secondary">
          {config.stt_provider === 'local-whisper'
            ? `${config.hotkey}을 누른 채 말하면, 녹음이 끝난 뒤 이 컴퓨터에서 음성을 텍스트로 변환합니다.`
            : t('home.description', { hotkey: config.hotkey })}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('settings')}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-xs font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            모델 및 권한 설정
            <ArrowRight size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate('history')}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-transparent px-4 text-xs font-medium text-text-primary transition-colors hover:bg-bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            기록 보기
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="mb-1 text-caption uppercase tracking-wider text-text-tertiary">
            {t('home.totalRecordings')}
          </p>
          <p className="text-2xl font-semibold tabular-nums">{history.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="mb-1 text-caption uppercase tracking-wider text-text-tertiary">
            {t('home.today')}
          </p>
          <p className="text-2xl font-semibold tabular-nums">{todayCount}</p>
        </div>
      </div>

      {/* Plan / Quota summary */}
      {user && (
        <div className="rounded-xl border border-border bg-bg-elevated p-5">
          {hasCloudAccess ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Crown size={16} className="text-warning" />
                <h3 className="text-footnote font-medium">{displayName}</h3>
              </div>
              <div className="space-y-3">
                {wordsLimit > 0 ? (
                  <>
                    <RemainingWords used={wordsUsed} limit={wordsLimit} resetAt={wordsResetAt} />
                    <QuotaBar
                      label={t('account.cloudWords', 'Cloud words')}
                      used={wordsUsed}
                      limit={wordsLimit}
                      unit={t('account.quotaKWords', 'k words')}
                      divisor={1000}
                    />
                  </>
                ) : (
                  <>
                    <QuotaBar
                      label={t('upgrade.stt')}
                      used={sttSecondsUsed}
                      limit={sttSecondsLimit}
                      unit={t('account.quotaHours')}
                      divisor={3600}
                    />
                    <QuotaBar
                      label={t('upgrade.llm')}
                      used={llmTokensUsed}
                      limit={llmTokensLimit}
                      unit={t('account.quotaTokens')}
                      divisor={1000}
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-footnote font-medium">{t('home.freePlan')}</h3>
                <button
                  onClick={() => navigate('upgrade')}
                  className="text-xs text-accent font-medium bg-transparent border-none cursor-pointer hover:underline"
                >
                  {t('home.upgradeToPro')}
                </button>
              </div>
              {sttSecondsLimit > 0 && (
                <div className="space-y-3 mt-3">
                  <QuotaBar
                    label={t('upgrade.stt')}
                    used={sttSecondsUsed}
                    limit={sttSecondsLimit}
                    unit={t('account.quotaMin')}
                    divisor={60}
                  />
                  <QuotaBar
                    label={t('upgrade.llm')}
                    used={llmTokensUsed}
                    limit={llmTokensLimit}
                    unit={t('account.quotaTokens')}
                    divisor={1000}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Current config */}
      <div className="rounded-xl border border-border bg-bg-elevated p-5">
        <h3 className="text-footnote font-medium mb-3">{t('home.currentConfig')}</h3>
        <div className="space-y-2 text-footnote">
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('home.sttProvider')}</span>
            <span className="text-text-primary font-medium">{config.stt_provider}</span>
          </div>
          {config.stt_provider !== 'local-whisper' && (
            <>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('home.llmProvider')}</span>
                <span className="text-text-primary font-medium">{config.llm_provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('home.aiPolish')}</span>
                <span className="text-text-primary font-medium">
                  {config.polish_enabled ? t('home.enabled') : t('home.disabled')}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('home.outputMode')}</span>
            <span className="text-text-primary font-medium">{config.output_mode}</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('settings')}
          className="flex h-12 items-center gap-2.5 rounded-lg border border-border bg-bg-elevated px-4 text-left text-text-primary transition-colors hover:bg-bg-secondary"
        >
          <Settings size={16} className="text-text-secondary" />
          <span className="text-footnote font-medium">{t('nav.settings')}</span>
        </button>
        <button
          onClick={() => navigate('history')}
          className="flex h-12 items-center gap-2.5 rounded-lg border border-border bg-bg-elevated px-4 text-left text-text-primary transition-colors hover:bg-bg-secondary"
        >
          <History size={16} className="text-text-secondary" />
          <span className="text-footnote font-medium">{t('nav.history')}</span>
        </button>
      </div>
    </div>
  )
}

function RemainingWords({
  used,
  limit,
  resetAt,
}: {
  used: number
  limit: number
  resetAt: string | null
}) {
  const { t } = useTranslation()
  const remaining = Math.max(limit - used, 0)
  const formattedRemaining = new Intl.NumberFormat().format(remaining)

  return (
    <div className="rounded-md bg-bg-secondary/60 px-3 py-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-text-secondary">{t('home.wordsRemaining')}</span>
        <span className="text-lg font-semibold text-text-primary tabular-nums">
          {formattedRemaining}
        </span>
      </div>
      {resetAt && (
        <p className="mt-1 text-caption text-text-tertiary">
          {t('home.wordsReset', { date: new Date(resetAt).toLocaleDateString() })}
        </p>
      )}
    </div>
  )
}

function QuotaBar({
  label,
  used,
  limit,
  unit,
  divisor,
}: {
  label: string
  used: number
  limit: number
  unit: string
  divisor: number
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const usedDisplay = (used / divisor).toFixed(1)
  const limitDisplay = (limit / divisor).toFixed(1)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-tertiary">
          {usedDisplay} / {limitDisplay} {unit}
        </span>
      </div>
      <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
        <div
          style={{ '--ui-progress-width': `${pct}%` } as CSSProperties}
          className={`ui-progress-width h-full rounded-full transition-all ${pct > 90 ? 'bg-error' : 'bg-accent'}`}
        />
      </div>
    </div>
  )
}
