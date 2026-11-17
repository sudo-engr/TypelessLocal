import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Loader2, UserCircle, CheckCircle2, Mail, ClipboardCheck } from '../Icons'
import { openUrl } from '@tauri-apps/plugin-opener'
import { readText } from '@tauri-apps/plugin-clipboard-manager'
import { useAuthStore } from '../../stores/authStore'
import { API_BASE_URL } from '../../lib/constants'
import {
  EMAIL_VERIFICATION_STATE_TTL_MS,
  OAUTH_STATE_TTL_MS,
  clearOAuthState,
  handleDeepLinkUrl,
} from '../../lib/deep-link'
import {
  claimDesktopAuthCallbackURL,
  createDesktopWebAuthURL,
} from '../../lib/desktop-auth-callback'
import { GoogleLogo } from '../GoogleLogo'

type Tab = 'signin' | 'signup'

export function AccountStep() {
  const { t, i18n } = useTranslation()
  const { user, loading, error, emailVerificationPending, signIn } = useAuthStore()
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [oauthPending, setOauthPending] = useState<'google' | 'github' | 'browser' | null>(null)
  const authLocale = i18n.resolvedLanguage ?? i18n.language ?? 'en'

  // Keep the UI timeout aligned with the in-memory OAuth proof TTL.
  useEffect(() => {
    if (!oauthPending) return
    const timer = setTimeout(() => {
      setOauthPending(null)
      clearOAuthState()
      setLocalError(t('onboarding.account.signInTimedOut'))
    }, OAUTH_STATE_TTL_MS)
    return () => clearTimeout(timer)
  }, [oauthPending, t])

  // When user becomes available (e.g. from OAuth deep-link callback), clear pending
  useEffect(() => {
    if (user && oauthPending) {
      setOauthPending(null)
    }
  }, [user, oauthPending])

  const displayError = localError ?? error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    try {
      await signIn(email, password)
    } catch {
      // Error already set in store
    }
  }

  const handleBrowserAuth = async (mode: 'signup' | 'verify') => {
    try {
      setOauthPending('browser')
      setLocalError(null)
      useAuthStore.setState({ error: null })
      await openUrl(
        await createDesktopWebAuthURL(mode, EMAIL_VERIFICATION_STATE_TTL_MS, authLocale),
      )
    } catch {
      clearOAuthState()
      setOauthPending(null)
      setLocalError(t('onboarding.account.failedToStart'))
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      setOauthPending(provider)
      setLocalError(null)
      useAuthStore.setState({ error: null })
      const callbackURL = await claimDesktopAuthCallbackURL(OAUTH_STATE_TTL_MS, authLocale)
      if (!callbackURL) return
      const url = `${API_BASE_URL}/api/auth/desktop-oauth?provider=${provider}&callbackURL=${encodeURIComponent(callbackURL)}`
      await openUrl(url)
    } catch {
      clearOAuthState()
      setOauthPending(null)
      setLocalError(t('onboarding.account.failedToStart'))
    }
  }

  const handleClipboardOAuth = async () => {
    setLocalError(null)
    try {
      const text = (await readText()).trim()
      const handled = await handleDeepLinkUrl(text)
      if (!handled) {
        setLocalError(t('onboarding.account.oauthClipboardInvalid', 'No valid sign-in link found.'))
      }
    } catch {
      setLocalError(t('onboarding.account.oauthClipboardInvalid', 'No valid sign-in link found.'))
    }
  }

  // ── Post-login confirmation ──
  if (user) {
    return (
      <div className="max-w-70 mx-auto flex flex-col items-center gap-6 py-4">
        <motion.div
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 20 }}
          >
            <CheckCircle2 size={36} className="text-success" />
          </motion.div>
        </motion.div>
        <div className="text-center">
          <p className="text-footnote text-text-secondary">{t('onboarding.account.signedInAs')}</p>
          <p className="text-body font-medium text-text-primary mt-1">{user.email}</p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
              <UserCircle size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-footnote font-medium text-text-primary">
                {t('onboarding.account.freePlan')}
              </p>
              <p className="text-xs text-text-secondary">{t('onboarding.account.freePlanQuota')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Email verification pending ──
  if (emailVerificationPending) {
    return (
      <div className="max-w-70 mx-auto flex flex-col items-center gap-5 py-4 text-center">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
          <Mail size={36} className="text-accent" />
        </div>
        <div>
          <h2 className="text-headline font-semibold text-text-primary">
            {t('onboarding.account.checkEmail')}
          </h2>
          <p className="text-footnote text-text-secondary mt-1.5">
            {t('onboarding.account.verificationSent')}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            onClick={async () => {
              await handleBrowserAuth('verify')
            }}
            disabled={loading || oauthPending === 'browser'}
            className="w-full py-2.5 rounded-md bg-accent text-white text-footnote font-medium cursor-pointer border-none hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading || oauthPending === 'browser'
              ? t('common.saving')
              : t('onboarding.account.resendVerification')}
          </button>
          {displayError && <p className="text-error text-xs">{displayError}</p>}
          <button
            onClick={() => {
              useAuthStore.setState({ emailVerificationPending: false, pendingEmail: null })
              clearOAuthState()
              setTab('signin')
              setOauthPending(null)
            }}
            className="w-full py-2.5 rounded-md bg-bg-secondary border border-border text-text-primary text-footnote cursor-pointer hover:bg-bg-tertiary transition-colors"
          >
            {t('onboarding.account.backToSignIn')}
          </button>
        </div>
      </div>
    )
  }

  // ── OAuth pending ──
  if (oauthPending) {
    return (
      <div className="max-w-70 mx-auto py-4">
        <div className="space-y-5 rounded-2xl bg-bg-elevated p-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-secondary animate-pulse">
              {oauthPending === 'browser' ? (
                <UserCircle size={24} className="text-accent" />
              ) : oauthPending === 'google' ? (
                <GoogleLogo size={24} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-body font-medium text-text-primary">
              {t('onboarding.account.completingSignIn')}
            </p>
            <p className="text-text-secondary text-xs">{t('onboarding.account.finishSignIn')}</p>
            <p className="text-text-tertiary text-caption leading-relaxed">
              {t(
                'onboarding.account.oauthPendingHint',
                'If your browser shows “Load failed”, copy the browser address and use Complete from clipboard below.',
              )}
            </p>
          </div>
          <div className="h-1 rounded-full overflow-hidden bg-bg-secondary mx-4">
            <div className="h-full w-2/5 rounded-full bg-accent animate-pulse" />
          </div>
          {displayError && <p className="text-error text-xs">{displayError}</p>}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleClipboardOAuth}
              className="px-4 py-2 rounded-md border border-border bg-bg-secondary text-text-primary text-xs cursor-pointer hover:bg-bg-tertiary transition-colors inline-flex items-center justify-center gap-2"
            >
              <ClipboardCheck size={14} />
              {t('onboarding.account.completeFromClipboard', 'Complete from clipboard')}
            </button>
            <button
              onClick={() => {
                setOauthPending(null)
                clearOAuthState()
              }}
              className="px-4 py-2 rounded-md border border-border bg-transparent text-text-secondary text-xs cursor-pointer hover:bg-bg-secondary transition-colors"
            >
              {t('onboarding.account.cancel')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Sign in / Sign up form ──
  return (
    <div className="max-w-70 mx-auto space-y-4">
      {/* Hero icon — matching DoneStep circle style */}
      <div className="flex justify-center py-2">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
          <UserCircle size={28} className="text-accent" />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border border-border rounded-md overflow-hidden">
        <button
          onClick={() => {
            setTab('signin')
            setLocalError(null)
          }}
          className={`flex-1 py-2 text-footnote font-medium border-none cursor-pointer transition-colors ${
            tab === 'signin'
              ? 'bg-bg-secondary text-text-primary'
              : 'bg-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {t('onboarding.account.signIn')}
        </button>
        <button
          onClick={() => {
            setTab('signup')
            setLocalError(null)
          }}
          className={`flex-1 py-2 text-footnote font-medium border-none cursor-pointer transition-colors ${
            tab === 'signup'
              ? 'bg-bg-secondary text-text-primary'
              : 'bg-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {t('onboarding.account.signUp')}
        </button>
      </div>

      {tab === 'signin' ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-footnote font-medium text-text-secondary mb-2">
              {t('onboarding.account.email')}
            </label>
            <input
              type="email"
              placeholder={t('onboarding.account.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-md text-footnote text-text-primary outline-none focus:border-border-focus transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-footnote font-medium text-text-secondary mb-2">
              {t('onboarding.account.password')}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-md text-footnote text-text-primary outline-none focus:border-border-focus transition-colors"
              required
            />
          </div>
          {displayError && <p className="text-error text-xs">{displayError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-accent text-white text-footnote font-medium cursor-pointer border-none hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {t('onboarding.account.signIn')}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => handleBrowserAuth('signup')}
          className="w-full py-2.5 rounded-md bg-accent text-white text-footnote font-medium cursor-pointer border-none hover:bg-accent-hover transition-colors"
        >
          {t('onboarding.account.signUp')}
        </button>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-tertiary text-xs">{t('onboarding.account.or')}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* OAuth buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleOAuth('google')}
          className="flex-1 py-2.5 rounded-md border border-border bg-transparent text-text-primary text-footnote font-medium cursor-pointer hover:bg-bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <GoogleLogo size={16} />
          {t('onboarding.account.continueWithGoogle')}
        </button>
        <button
          onClick={() => handleOAuth('github')}
          className="flex-1 py-2.5 rounded-md border border-border bg-transparent text-text-primary text-footnote font-medium cursor-pointer hover:bg-bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {t('onboarding.account.continueWithGithub')}
        </button>
      </div>
    </div>
  )
}
