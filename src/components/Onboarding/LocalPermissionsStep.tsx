import { useCallback, useEffect, useState } from 'react'
import { Check, MousePointer2, RefreshCw } from 'lucide-react'
import { LoaderCircle, Mic } from '../Icons'
import { useAppStore } from '../../stores/appStore'
import { needsMacAccessibility } from '../../lib/accessibility'
import {
  checkAccessibilityPermission,
  getSystemDiagnostics,
  requestAccessibilityPermission,
  resumeHotkey,
  waitForAccessibilityPermission,
  type DiagnosticRow,
} from '../../lib/tauri'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type PermissionStatus = 'checking' | 'ready' | 'needed' | 'later'

function microphoneStatus(row: DiagnosticRow | undefined): PermissionStatus {
  if (!row || row.status === 'checking') return 'checking'
  if (row.status === 'ok' || row.status === 'notApplicable') return 'ready'
  return 'needed'
}

function statusLabel(status: PermissionStatus) {
  if (status === 'ready') return '준비됨'
  if (status === 'needed') return '확인 필요'
  if (status === 'checking') return '확인 중'
  return '나중에'
}

function statusClasses(status: PermissionStatus) {
  if (status === 'ready') return 'bg-success/10 text-success'
  if (status === 'needed') return 'bg-warning/10 text-warning'
  if (status === 'checking') return 'bg-bg-tertiary text-text-tertiary'
  return 'bg-bg-tertiary text-text-tertiary'
}

/** Local-only permission check. It uses the existing Rust diagnostics and Accessibility commands. */
export function LocalPermissionsStep() {
  const config = useAppStore((state) => state.config)
  const setAccessibilityTrusted = useAppStore((state) => state.setAccessibilityTrusted)
  const [microphone, setMicrophone] = useState<PermissionStatus>('checking')
  const [microphoneMessage, setMicrophoneMessage] = useState('')
  const [accessibility, setAccessibility] = useState<PermissionStatus>('checking')
  const [refreshing, setRefreshing] = useState(false)
  const [accessibilityBusy, setAccessibilityBusy] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    setMicrophone('checking')
    try {
      const report = await getSystemDiagnostics()
      const row = report.rows.find((item) => item.id === 'microphone')
      setMicrophone(microphoneStatus(row))
      setMicrophoneMessage(row?.message ?? '마이크 상태를 확인할 수 없습니다.')
    } catch (error) {
      setMicrophone('needed')
      setMicrophoneMessage(
        error instanceof Error ? error.message : '마이크 진단을 실행하지 못했습니다.',
      )
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const refreshAccessibility = useCallback(async () => {
    if (!needsMacAccessibility(config)) {
      setAccessibility('ready')
      return
    }
    try {
      const trusted = await checkAccessibilityPermission()
      setAccessibility(trusted ? 'ready' : 'needed')
      setAccessibilityTrusted(trusted)
      if (trusted) await resumeHotkey().catch(() => {})
    } catch {
      setAccessibility('needed')
      setAccessibilityTrusted(false)
    }
  }, [config, setAccessibilityTrusted])

  useEffect(() => {
    void refreshAccessibility()
    const onFocus = () => void refreshAccessibility()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refreshAccessibility])

  const handleAccessibility = async () => {
    setAccessibilityBusy(true)
    try {
      await requestAccessibilityPermission()
      const trusted = await waitForAccessibilityPermission()
      setAccessibility(trusted ? 'ready' : 'needed')
      setAccessibilityTrusted(trusted)
      if (trusted) await resumeHotkey().catch(() => {})
    } finally {
      setAccessibilityBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-footnote leading-relaxed text-text-secondary">
        녹음과 결과 입력에 필요한 권한만 확인합니다. 음성 데이터는 권한 확인이나 진단을 위해 외부로
        전송되지 않습니다.
      </p>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>기기 권한</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void refresh()
              void refreshAccessibility()
            }}
            disabled={refreshing}
            aria-label="권한 다시 확인"
          >
            {refreshing ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            다시 확인
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <PermissionRow
            icon={<Mic className="h-4 w-4" aria-hidden="true" />}
            title="마이크"
            description={microphoneMessage || '기본 입력 장치를 확인하는 중입니다.'}
            status={microphone}
          />
          <PermissionRow
            icon={<MousePointer2 className="h-4 w-4" aria-hidden="true" />}
            title="macOS 손쉬운 사용"
            description={
              accessibility === 'ready'
                ? '단축키와 인식 결과를 현재 앱에 입력할 수 있습니다.'
                : '단축키와 받아쓰기 결과를 다른 앱에 입력하려면 허용이 필요합니다.'
            }
            status={accessibility}
            action={
              accessibility === 'needed' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleAccessibility()}
                  disabled={accessibilityBusy}
                >
                  {accessibilityBusy && <LoaderCircle className="h-3 w-3 animate-spin" />}
                  허용하기
                </Button>
              ) : undefined
            }
          />
        </CardContent>
      </Card>

      <p className="text-center text-caption leading-relaxed text-text-tertiary">
        마이크가 차단된 경우 시스템 설정에서 TypelessLocal의 마이크 권한을 허용한 뒤 다시
        확인하세요.
      </p>
    </div>
  )
}

function PermissionRow({
  icon,
  title,
  description,
  status,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  status: PermissionStatus
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-bg-secondary p-3">
      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-bg-tertiary text-text-secondary">
        {status === 'ready' ? <Check className="h-4 w-4 text-success" /> : icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-text-primary">{title}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-caption font-medium ${statusClasses(status)}`}
          >
            {statusLabel(status)}
          </span>
        </div>
        <p className="mt-1 text-caption leading-relaxed text-text-tertiary">{description}</p>
      </div>
      {action}
    </div>
  )
}
