import { listen } from '@tauri-apps/api/event'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { CheckCircle2, Download, LoaderCircle, ShieldCheck, TriangleAlert } from '../Icons'
import { useAppStore } from '../../stores/appStore'
import {
  configureLocalModel,
  downloadLocalModel,
  getLocalModelConfig,
  type LocalModelConfig,
  type LocalModelDownloadProgress,
} from '../../lib/tauri'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'
type Operation = 'download' | 'manual' | null

const MODELS = [
  {
    id: 'large-v3-turbo',
    bytes: 574_041_195,
    size: '574MB',
    description: '빠른 받아쓰기를 위한 모델입니다. large-v3보다 가볍고 처리 속도를 우선합니다.',
  },
  {
    id: 'large-v3',
    bytes: 1_081_140_203,
    size: '1.08GB',
    description:
      '정확도를 우선해 비교할 기본 모델입니다. turbo보다 처리 시간과 메모리가 더 필요할 수 있습니다.',
  },
] as const

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return '모델 파일을 준비하지 못했습니다.'
}

function normaliseModel(model: LocalModelConfig | null) {
  if (!model) return { path: '', sha256: '' }
  return { path: model.path, sha256: model.sha256 }
}

function formatMegabytes(bytes: number) {
  return `${Math.max(0, bytes / 1_000_000).toFixed(0)} MB`
}

function isDownloadProgress(value: unknown): value is LocalModelDownloadProgress {
  if (!value || typeof value !== 'object') return false
  const progress = value as Partial<LocalModelDownloadProgress>
  return (
    (progress.phase === 'downloading' || progress.phase === 'verifying') &&
    typeof progress.received === 'number' &&
    Number.isFinite(progress.received) &&
    progress.received >= 0 &&
    typeof progress.total === 'number' &&
    Number.isFinite(progress.total) &&
    progress.total > 0
  )
}

interface LocalModelSetupStepProps {
  /** Settings uses the same flow without onboarding-specific copy. */
  compact?: boolean
  /** Settings may explicitly redownload for replacement/recovery testing. */
  allowRedownload?: boolean
}

/**
 * Local-only model setup. Downloading is always user initiated. The manual
 * path/checksum import remains available for users who already have a model.
 */
export function LocalModelSetupStep({
  compact = false,
  allowRedownload = false,
}: LocalModelSetupStepProps) {
  const updateConfig = useAppStore((state) => state.updateConfig)
  const setSttTestStatus = useAppStore((state) => state.setSttTestStatus)
  const mountedRef = useRef(true)
  const downloadInFlightRef = useRef(false)
  const [path, setPath] = useState('')
  const [sha256, setSha256] = useState('')
  const [selectedModelId, setSelectedModelId] = useState<'large-v3-turbo' | 'large-v3'>(
    'large-v3-turbo',
  )
  const selectedModel = MODELS.find((model) => model.id === selectedModelId)!
  const [modelId, setModelId] = useState<string | null>(null)
  const [status, setStatus] = useState<ModelStatus>('loading')
  const [operation, setOperation] = useState<Operation>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState<LocalModelDownloadProgress | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let active = true
    let unlisten: (() => void) | undefined

    const subscribe = async () => {
      try {
        const dispose = await listen<LocalModelDownloadProgress>(
          'local-model:download-progress',
          (event) => {
            if (!active || !downloadInFlightRef.current || !isDownloadProgress(event.payload))
              return
            const total = event.payload.total
            setDownloadProgress({
              phase: event.payload.phase,
              received: Math.max(0, Math.min(event.payload.received, total)),
              total,
            })
            setStatus('loading')
            setSttTestStatus('testing')
            setOperation('download')
            setMessage(null)
          },
        )
        if (!active) dispose()
        else unlisten = dispose
      } catch (error) {
        if (active) console.error('[local-model] failed to subscribe to progress', error)
      }
    }

    void subscribe()
    return () => {
      active = false
      unlisten?.()
    }
  }, [setSttTestStatus])

  useEffect(() => {
    let cancelled = false
    setSttTestStatus('idle')
    getLocalModelConfig()
      .then((model) => {
        if (cancelled || !mountedRef.current) return
        const fields = normaliseModel(model)
        setPath(fields.path)
        setSha256(fields.sha256)
        setModelId(model?.model_id ?? null)
        if (model?.model_id === 'large-v3' || model?.model_id === 'large-v3-turbo') {
          setSelectedModelId(model.model_id)
        }
        setStatus(model ? 'ready' : 'idle')
        setSttTestStatus(model ? 'success' : 'idle')
        if (model) {
          setMessage(
            '저장된 모델 정보를 불러왔습니다. 첫 전사 전에 파일 경로와 해시를 다시 확인합니다.',
          )
        }
      })
      .catch((error) => {
        if (cancelled || !mountedRef.current) return
        setStatus('idle')
        setSttTestStatus('idle')
        setMessage(errorMessage(error))
      })

    return () => {
      cancelled = true
    }
  }, [setSttTestStatus])

  const applyModel = (model: LocalModelConfig, successMessage: string) => {
    if (!mountedRef.current) return
    setPath(model.path)
    setSha256(model.sha256)
    setModelId(model.model_id)
    if (model.model_id === 'large-v3' || model.model_id === 'large-v3-turbo') {
      setSelectedModelId(model.model_id)
    }
    setDownloadProgress(null)
    setStatus('ready')
    setSttTestStatus('success')
    setMessage(successMessage)
    updateConfig({
      stt_provider: 'local-whisper',
      stt_language: 'ko',
      // The first local release is dictation-only. Do not send polish or
      // translation requests to a remote provider by accident.
      polish_enabled: false,
      translate_enabled: false,
    })
  }

  const handleDownload = async () => {
    if (status === 'loading' || (status === 'ready' && !allowRedownload)) return
    downloadInFlightRef.current = true
    setOperation('download')
    setStatus('loading')
    setSttTestStatus('testing')
    setMessage(null)
    setDownloadProgress({ received: 0, total: selectedModel.bytes, phase: 'downloading' })
    try {
      const model = await downloadLocalModel(selectedModelId)
      if (!mountedRef.current) return
      applyModel(
        model,
        '모델을 다운로드하고 SHA-256을 검증했습니다. 로컬 받아쓰기를 사용할 수 있습니다.',
      )
    } catch (error) {
      if (!mountedRef.current) return
      setStatus('error')
      setSttTestStatus('error')
      setMessage(errorMessage(error))
    } finally {
      downloadInFlightRef.current = false
    }
  }

  const handleManualConfigure = async () => {
    const modelPath = path.trim()
    const expectedSha256 = sha256.trim().toLowerCase()
    setOperation('manual')
    setMessage(null)

    if (!modelPath) {
      setStatus('error')
      setSttTestStatus('error')
      setMessage('Whisper 모델 파일 경로를 입력하세요.')
      return
    }
    if (!/^[0-9a-f]{64}$/i.test(expectedSha256)) {
      setStatus('error')
      setSttTestStatus('error')
      setMessage('SHA-256은 64자리 16진수여야 합니다.')
      return
    }

    setStatus('loading')
    setSttTestStatus('testing')
    try {
      const model = await configureLocalModel(modelPath, expectedSha256)
      applyModel(model, '모델 파일을 검증하고 로컬 받아쓰기에 사용할 준비를 마쳤습니다.')
    } catch (error) {
      if (!mountedRef.current) return
      setStatus('error')
      setSttTestStatus('error')
      setMessage(errorMessage(error))
    }
  }

  const progressTotal = downloadProgress?.total ?? selectedModel.bytes
  const progressReceived = downloadProgress?.received ?? 0
  const progressPercent = Math.min(100, Math.max(0, (progressReceived / progressTotal) * 100))
  const rootClass = compact ? 'max-w-160 space-y-5' : 'space-y-4'
  const downloadLabel =
    status === 'loading'
      ? downloadProgress
        ? downloadProgress.phase === 'verifying'
          ? 'SHA-256 검증 중'
          : '모델 다운로드 중'
        : '모델 상태 확인 중'
      : status === 'error' && operation === 'download'
        ? `다시 시도 (${selectedModel.size})`
        : status === 'ready'
          ? allowRedownload
            ? '모델 다운로드 및 설정'
            : '모델 준비 완료'
          : `모델 다운로드 및 설정 (${selectedModel.size})`

  return (
    <div className={rootClass}>
      {compact && (
        <div>
          <h3 className="text-body font-medium text-text-primary">로컬 한국어 Whisper</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            모델을 준비하면 계정, API 키, 원격 STT 서버 없이 이 컴퓨터에서만 음성을 전사합니다.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-accent" aria-hidden="true" />
            <CardTitle>한국어 Whisper 모델</CardTitle>
          </div>
          <CardDescription>
            모델을 선택하고 버튼을 누르면 다운로드합니다. 다운로드와 SHA-256 검증은 앱에서 처리하며,
            설치 후 음성 전사는 로컬에서만 실행됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <fieldset className="space-y-2" disabled={status === 'loading'}>
            <legend className="mb-2 text-xs font-medium text-text-secondary">모델 선택</legend>
            {MODELS.map((model) => (
              <label
                key={model.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${
                  selectedModelId === model.id ? 'border-accent bg-bg-secondary' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="local-whisper-model"
                  value={model.id}
                  checked={selectedModelId === model.id}
                  onChange={() => {
                    setSelectedModelId(model.id)
                    setStatus(modelId === model.id ? 'ready' : 'idle')
                    setSttTestStatus(modelId === model.id ? 'success' : 'idle')
                    setDownloadProgress(null)
                    setMessage(null)
                    setOperation(null)
                  }}
                  className="mt-0.5 accent-accent"
                  aria-label={model.id}
                />
                <span>
                  <span className="block text-xs font-medium text-text-primary">
                    {model.id} · {model.size}
                  </span>
                  <span className="mt-1 block text-caption leading-relaxed text-text-secondary">
                    {model.description}
                  </span>
                </span>
              </label>
            ))}
            <p className="text-caption text-text-tertiary">
              두 모델 모두 Q5_0 양자화 버전입니다. 정확도와 속도는 음성과 컴퓨터에 따라 달라집니다.
              선택만으로 활성 모델이 바뀌지는 않습니다.
            </p>
          </fieldset>
          <Button
            className="w-full"
            onClick={() => void handleDownload()}
            disabled={status === 'loading' || (status === 'ready' && !allowRedownload)}
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : status === 'ready' ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            {downloadLabel}
          </Button>

          {downloadProgress && (status === 'loading' || operation === 'download') && (
            <div className="space-y-1.5" role="status" aria-live="polite">
              <div className="flex justify-between text-caption text-text-tertiary">
                <span>
                  {downloadProgress.phase === 'verifying' ? 'SHA-256 검증 중' : '다운로드 중'}
                </span>
                <span>
                  {formatMegabytes(progressReceived)} / {formatMegabytes(progressTotal)}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-bg-tertiary"
                role="progressbar"
                aria-label="모델 다운로드 진행률"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressPercent)}
              >
                <div
                  className="ui-progress-width h-full rounded-full bg-accent transition-all duration-200"
                  style={{ '--ui-progress-width': `${progressPercent}%` } as CSSProperties}
                />
              </div>
            </div>
          )}

          <details className="rounded-md border border-border bg-bg-secondary px-3 py-2">
            <summary className="cursor-pointer text-xs font-medium text-text-secondary">
              기존 모델 파일 직접 가져오기
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-caption leading-relaxed text-text-tertiary">
                이미 모델 파일이 있거나 인터넷을 사용할 수 없을 때 경로와 예상 SHA-256을 입력하세요.
              </p>
              <div className="space-y-1.5">
                <label
                  htmlFor="local-model-path"
                  className="text-xs font-medium text-text-secondary"
                >
                  모델 파일 경로
                </label>
                <Input
                  id="local-model-path"
                  disabled={status === 'loading'}
                  value={path}
                  onChange={(event) => {
                    setPath(event.target.value)
                    setStatus('idle')
                    setSttTestStatus('idle')
                    setOperation('manual')
                    setDownloadProgress(null)
                    setMessage(null)
                  }}
                  placeholder="/Users/you/Models/ggml-large-v3-turbo.bin"
                  spellCheck={false}
                  autoComplete="off"
                  aria-describedby="local-model-path-help"
                />
                <p id="local-model-path-help" className="text-caption text-text-tertiary">
                  whisper.cpp GGML large-v3 또는 large-v3-turbo 모델의 절대 경로를 입력하세요.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="local-model-sha256"
                  className="text-xs font-medium text-text-secondary"
                >
                  예상 SHA-256
                </label>
                <Input
                  id="local-model-sha256"
                  disabled={status === 'loading'}
                  value={sha256}
                  onChange={(event) => {
                    setSha256(event.target.value)
                    setStatus('idle')
                    setSttTestStatus('idle')
                    setOperation('manual')
                    setDownloadProgress(null)
                    setMessage(null)
                  }}
                  placeholder="64자리 SHA-256 해시"
                  inputMode="text"
                  spellCheck={false}
                  autoComplete="off"
                  aria-describedby="local-model-sha-help"
                />
                <p id="local-model-sha-help" className="text-caption text-text-tertiary">
                  신뢰할 수 있는 배포처의 해시와 정확히 일치해야 활성화됩니다.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => void handleManualConfigure()}
                disabled={status === 'loading'}
              >
                {status === 'loading' && operation === 'manual' ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                )}
                수동 모델 검증 및 활성화
              </Button>
            </div>
          </details>
        </CardContent>
      </Card>

      {modelId && status === 'ready' && (
        <div
          className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs text-success"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-medium">등록된 로컬 모델</p>
            <p className="mt-1 break-all text-success/80">{modelId}</p>
          </div>
        </div>
      )}

      {message && status !== 'ready' && (
        <div
          className="flex items-start gap-2 rounded-md border border-error/30 bg-error/10 p-3 text-xs text-error"
          role="alert"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="break-words">{message}</p>
        </div>
      )}
      {message && status === 'ready' && (
        <p className="text-center text-xs text-success" role="status">
          {message}
        </p>
      )}

      {!compact && (
        <p className="text-center text-caption leading-relaxed text-text-tertiary">
          모델을 설치할 때만 인터넷이 필요합니다. 설치 후 음성은 녹음이 끝난 뒤 이 컴퓨터에서만
          전사되며 계정과 API 키는 필요하지 않습니다.
        </p>
      )}
    </div>
  )
}
