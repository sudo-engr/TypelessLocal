import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MoreHorizontal } from 'lucide-react'
import { Search, Copy, Trash2 } from '../Icons'
import { useAppStore, type HistoryEntry } from '../../stores/appStore'
import { addCorrectionRule, clearHistory, getCorrectionRules } from '../../lib/tauri'
import { toast } from '../toast-service'
import { AppContextMeta } from './AppContextMeta'
import { CreateCorrectionDialog } from './CreateCorrectionDialog'
import { Input } from '../ui/input'

export function History() {
  const history = useAppStore((s) => s.history)
  const setHistory = useAppStore((s) => s.setHistory)
  const setCorrectionRules = useAppStore((s) => s.setCorrectionRules)
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [menuEntryId, setMenuEntryId] = useState<number | null>(null)
  const [correctionEntry, setCorrectionEntry] = useState<HistoryEntry | null>(null)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const menuTriggerEntryId = useRef<number | null>(null)

  const closeEntryMenu = useCallback(() => {
    setMenuEntryId(null)
    const entryId = menuTriggerEntryId.current
    window.setTimeout(() => {
      if (entryId === null) return
      document.querySelector<HTMLButtonElement>(`[data-history-menu-trigger="${entryId}"]`)?.focus()
    }, 0)
  }, [])

  useEffect(() => {
    if (menuEntryId === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeEntryMenu()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeEntryMenu, menuEntryId])

  const filtered = useMemo(
    () =>
      search
        ? history.filter(
            (h) =>
              h.polished_text.includes(search) ||
              h.raw_text.includes(search) ||
              h.context_label.includes(search),
          )
        : history,
    [history, search],
  )

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 1500)
      })
      .catch(() => {
        toast.error(t('history.failedToCopy'))
      })
  }

  const handleClear = async () => {
    try {
      await clearHistory()
      setHistory([])
      setConfirmingClear(false)
    } catch (e) {
      console.error('Failed to clear history:', e)
      toast.error(t('history.failedToClear'))
    }
  }

  const handleCreateCorrection = async (pattern: string, replacement: string) => {
    try {
      await addCorrectionRule(pattern, replacement)
      setCorrectionRules(await getCorrectionRules())
      setCorrectionEntry(null)
      toast.success(t('history.correctionCreated'))
    } catch (error) {
      console.error('Failed to create correction from history:', error)
      toast.error(t('history.failedToCreateCorrection'))
      throw error
    }
  }

  const outputStatusLabel = (status: string | null) => {
    switch (status) {
      case 'partial':
        return t('history.outputStatus.partial')
      case 'fallback':
        return t('history.outputStatus.fallback')
      case 'clipboard_fallback':
        return t('history.outputStatus.clipboardFallback')
      default:
        return null
    }
  }

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const entry of filtered) {
      const date = entry.created_at.split('T')[0] || entry.created_at.split(' ')[0]
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const label =
        date === today ? t('history.today') : date === yesterday ? t('history.yesterday') : date
      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(entry)
    }
    return map
  }, [filtered, t])

  return (
    <div className="flex h-full w-full flex-col bg-bg-primary text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h2 className="text-headline font-semibold tracking-tight">{t('history.title')}</h2>
          <p className="mt-1 text-xs text-text-tertiary">받아쓴 문장을 검색하고 다시 복사합니다.</p>
        </div>
        {history.length > 0 && (
          <span className="rounded-md border border-border px-2.5 py-1 text-caption text-text-secondary">
            {history.length}개 기록
          </span>
        )}
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('history.searchPlaceholder')}
            variant="search"
            aria-label={t('history.searchPlaceholder')}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-5">
        {filtered.length === 0 ? (
          <p className="text-center text-text-tertiary text-footnote py-12">
            {search ? (
              t('history.noResults')
            ) : (
              <>
                {t('history.noHistory')}
                <br />
                <span className="text-xs">{t('history.noHistoryHint')}</span>
              </>
            )}
          </p>
        ) : (
          <AnimatePresence>
            {Array.from(grouped.entries()).map(([label, entries]) => (
              <div key={label} className="mb-4">
                <h3 className="mb-2 border-b border-border px-1 pb-2 text-caption font-medium uppercase tracking-wider text-text-tertiary">
                  {label}
                </h3>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="group flex items-start gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-3 transition-colors hover:bg-bg-secondary"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-footnote text-text-primary leading-relaxed">
                          {entry.polished_text}
                        </p>
                        <AppContextMeta
                          iconKey={entry.context_icon_key}
                          family={entry.context_family}
                          label={entry.context_label}
                          time={entry.created_at.split('T')[1]?.slice(0, 5) || ''}
                          providerKind={entry.provider_kind}
                          browserAccessStatus={entry.browser_access_status}
                        />
                        {entry.output_status && outputStatusLabel(entry.output_status) && (
                          <p className="text-caption text-warning mt-1 leading-snug break-words">
                            {outputStatusLabel(entry.output_status)}
                            {entry.output_error ? ` · ${entry.output_error}` : ''}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center">
                        <button
                          onClick={() => handleCopy(entry.id, entry.polished_text)}
                          className="rounded-md border border-transparent p-1.5 text-text-tertiary transition-colors hover:border-border hover:bg-bg-tertiary hover:text-accent group-hover:opacity-100"
                          aria-label={`Copy text: ${entry.polished_text.slice(0, 30)}`}
                        >
                          <Copy size={13} />
                        </button>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              menuTriggerEntryId.current = entry.id
                              setMenuEntryId((current) => (current === entry.id ? null : entry.id))
                            }}
                            data-history-menu-trigger={entry.id}
                            aria-label={t('history.moreActions')}
                            aria-haspopup="menu"
                            aria-expanded={menuEntryId === entry.id}
                            className="p-1.5 rounded-sm hover:bg-bg-tertiary transition-all bg-transparent border-none cursor-pointer text-text-tertiary hover:text-text-primary flex-shrink-0"
                          >
                            <MoreHorizontal size={13} />
                          </button>
                          {menuEntryId === entry.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={closeEntryMenu} />
                              <div
                                role="menu"
                                className="absolute right-0 top-7 z-40 min-w-40 rounded-md border border-border bg-bg-primary py-1"
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setMenuEntryId(null)
                                    setCorrectionEntry(entry)
                                  }}
                                  className="h-8 w-full bg-transparent px-3 text-left text-xs text-text-primary hover:bg-bg-secondary"
                                >
                                  {t('history.createCorrection')}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {copiedId === entry.id && (
                        <span className="text-caption text-success flex-shrink-0 self-center">
                          {t('history.copied')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Clear button — jelly */}
      {history.length > 0 && (
        <div className="space-y-2 border-t border-border px-6 py-4">
          {confirmingClear && (
            <div className="rounded-md border border-error/20 bg-error/10 px-3 py-2">
              <p className="text-xs leading-relaxed text-text-secondary">
                {t('history.clearConfirm')}
              </p>
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="rounded-md border border-border bg-transparent px-2.5 py-1 text-caption text-text-secondary hover:text-text-primary"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-md border border-error/30 bg-error/15 px-2.5 py-1 text-caption font-medium text-error hover:bg-error/20"
                >
                  {t('history.confirmClear')}
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setConfirmingClear(true)}
            className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-transparent text-xs text-text-tertiary transition-colors hover:border-error/30 hover:bg-error/10 hover:text-error"
          >
            <Trash2 size={12} />
            {t('history.clearAll')}
          </button>
        </div>
      )}
      {correctionEntry && (
        <CreateCorrectionDialog
          entry={correctionEntry}
          onCancel={() => {
            setCorrectionEntry(null)
            const entryId = menuTriggerEntryId.current
            window.setTimeout(() => {
              if (entryId === null) return
              document
                .querySelector<HTMLButtonElement>(`[data-history-menu-trigger="${entryId}"]`)
                ?.focus()
            }, 0)
          }}
          onSave={handleCreateCorrection}
        />
      )}
    </div>
  )
}
