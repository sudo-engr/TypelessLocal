import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocalModelSetupStep } from '../LocalModelSetupStep'
import { configureLocalModel, downloadLocalModel, getLocalModelConfig } from '../../../lib/tauri'

const store = vi.hoisted(() => ({
  updateConfig: vi.fn(),
  setSttTestStatus: vi.fn(),
}))
const progressListeners = vi.hoisted(() => new Map<string, (event: { payload: unknown }) => void>())

const savedModel = {
  path: '/models/ggml-large-v3-turbo.bin',
  sha256: 'a'.repeat(64),
  model_id: 'large-v3-turbo',
}

vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn((event: string, handler: (event: { payload: unknown }) => void) => {
    progressListeners.set(event, handler)
    return Promise.resolve(() => progressListeners.delete(event))
  }),
}))

vi.mock('../../../stores/appStore', () => ({
  useAppStore: (select: (state: typeof store) => unknown) => select(store),
}))

vi.mock('../../../lib/tauri', () => ({
  configureLocalModel: vi.fn(),
  downloadLocalModel: vi.fn(),
  getLocalModelConfig: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  progressListeners.clear()
  vi.mocked(getLocalModelConfig).mockResolvedValue(null)
  vi.mocked(configureLocalModel).mockResolvedValue(savedModel)
  vi.mocked(downloadLocalModel).mockResolvedValue(savedModel)
})

afterEach(cleanup)

describe('LocalModelSetupStep', () => {
  it('does not download until the user explicitly starts setup', async () => {
    render(<LocalModelSetupStep />)

    const button = await screen.findByRole('button', { name: /모델 다운로드 및 설정/ })
    expect(downloadLocalModel).not.toHaveBeenCalled()
    expect(button).not.toBeDisabled()
  })

  it('renders download progress and verifies the downloaded model', async () => {
    let resolveDownload: (value: typeof savedModel) => void = () => {}
    vi.mocked(downloadLocalModel).mockReturnValue(
      new Promise((resolve) => {
        resolveDownload = resolve
      }),
    )
    render(<LocalModelSetupStep />)

    fireEvent.click(await screen.findByRole('button', { name: /모델 다운로드 및 설정/ }))
    await waitFor(() => expect(downloadLocalModel).toHaveBeenCalledTimes(1))

    act(() => {
      progressListeners.get('local-model:download-progress')?.({
        payload: { received: 287_020_598, total: 574_041_195, phase: 'downloading' },
      })
    })

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
    expect(screen.getByText('다운로드 중')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '모델 다운로드 중' })).toBeDisabled()

    resolveDownload(savedModel)
    await screen.findByText('등록된 로컬 모델')
    expect(store.setSttTestStatus).toHaveBeenLastCalledWith('success')
  })

  it('offers retry after a failed download without retrying automatically', async () => {
    vi.mocked(downloadLocalModel)
      .mockRejectedValueOnce(new Error('네트워크 오류'))
      .mockResolvedValueOnce(savedModel)
    render(<LocalModelSetupStep />)

    fireEvent.click(await screen.findByRole('button', { name: /모델 다운로드 및 설정/ }))
    await screen.findByText('네트워크 오류')
    expect(downloadLocalModel).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /다시 시도/ }))
    await waitFor(() => expect(downloadLocalModel).toHaveBeenCalledTimes(2))
    await screen.findByText('등록된 로컬 모델')
  })

  it('does not download when a saved model is already configured', async () => {
    vi.mocked(getLocalModelConfig).mockResolvedValue(savedModel)
    render(<LocalModelSetupStep />)

    await screen.findByText('등록된 로컬 모델')
    expect(downloadLocalModel).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: '모델 준비 완료' })).toBeDisabled()
  })

  it('lets the Settings variant explicitly request model setup again', async () => {
    vi.mocked(getLocalModelConfig).mockResolvedValue(savedModel)
    render(<LocalModelSetupStep compact allowRedownload />)

    const button = await screen.findByRole('button', { name: '모델 다운로드 및 설정' })
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    await waitFor(() => expect(downloadLocalModel).toHaveBeenCalledTimes(1))
  })

  it('downloads the selected large-v3 model and blocks changing it during setup', async () => {
    let resolveDownload: (value: typeof savedModel) => void = () => {}
    vi.mocked(downloadLocalModel).mockReturnValue(
      new Promise((resolve) => {
        resolveDownload = resolve
      }),
    )
    render(<LocalModelSetupStep />)
    await screen.findByRole('button', { name: /모델 다운로드 및 설정/ })
    fireEvent.click(screen.getByRole('radio', { name: 'large-v3' }))
    expect(screen.getByText(/turbo보다 처리 시간과 메모리/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '모델 다운로드 및 설정 (1.08GB)' }))
    expect(downloadLocalModel).toHaveBeenCalledWith('large-v3')
    expect(screen.getByRole('radio', { name: 'large-v3-turbo' })).toBeDisabled()
    act(() => {
      progressListeners.get('local-model:download-progress')?.({
        payload: { received: 1_081_140_203, total: 1_081_140_203, phase: 'verifying' },
      })
    })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    resolveDownload({ ...savedModel, model_id: 'large-v3', path: '/models/large.bin' })
    await screen.findByText('등록된 로컬 모델')
    expect(screen.getByRole('radio', { name: 'large-v3' })).toBeChecked()
    expect(store.setSttTestStatus).toHaveBeenLastCalledWith('success')
  })

  it('restores the active selection and allows switching to the other model', async () => {
    vi.mocked(getLocalModelConfig).mockResolvedValue({ ...savedModel, model_id: 'large-v3' })
    render(<LocalModelSetupStep />)
    await screen.findByText('등록된 로컬 모델')
    expect(screen.getByRole('radio', { name: 'large-v3' })).toBeChecked()
    fireEvent.click(screen.getByRole('radio', { name: 'large-v3-turbo' }))
    expect(store.setSttTestStatus).toHaveBeenLastCalledWith('idle')
    fireEvent.click(screen.getByRole('button', { name: /모델 다운로드 및 설정/ }))
    await waitFor(() => expect(downloadLocalModel).toHaveBeenCalledWith('large-v3-turbo'))
  })

  it('keeps manual import validation behind the collapsed details', async () => {
    render(<LocalModelSetupStep />)
    await screen.findByRole('button', { name: /모델 다운로드 및 설정/ })

    fireEvent.click(screen.getByText('기존 모델 파일 직접 가져오기'))
    fireEvent.change(screen.getByLabelText('모델 파일 경로'), {
      target: { value: '/models/model.bin' },
    })
    fireEvent.change(screen.getByLabelText('예상 SHA-256'), { target: { value: 'invalid' } })
    fireEvent.click(screen.getByRole('button', { name: '수동 모델 검증 및 활성화' }))

    expect(screen.getByText('SHA-256은 64자리 16진수여야 합니다.')).toBeInTheDocument()
    expect(configureLocalModel).not.toHaveBeenCalled()
  })
})
