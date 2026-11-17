import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { LocalPermissionsStep } from '../LocalPermissionsStep'
import { checkAccessibilityPermission } from '../../../lib/tauri'
const store = vi.hoisted(() => ({ config: {}, setAccessibilityTrusted: vi.fn() }))
vi.mock('../../../stores/appStore', () => ({
  useAppStore: (select: (state: typeof store) => unknown) => select(store),
}))
vi.mock('../../../lib/accessibility', () => ({ needsMacAccessibility: () => true }))
vi.mock('../../../lib/tauri', () => ({
  checkAccessibilityPermission: vi.fn(),
  requestAccessibilityPermission: vi.fn(),
  waitForAccessibilityPermission: vi.fn(),
  resumeHotkey: vi.fn().mockResolvedValue(undefined),
  getSystemDiagnostics: vi
    .fn()
    .mockResolvedValue({ rows: [{ id: 'microphone', status: 'ok', message: 'Ready' }] }),
}))
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
it('refreshes Accessibility when the user presses refresh', async () => {
  vi.mocked(checkAccessibilityPermission).mockResolvedValue(false)
  render(<LocalPermissionsStep />)
  await waitFor(() => expect(store.setAccessibilityTrusted).toHaveBeenLastCalledWith(false))
  vi.mocked(checkAccessibilityPermission).mockResolvedValue(true)
  fireEvent.click(screen.getByRole('button', { name: '권한 다시 확인' }))
  await waitFor(() => expect(store.setAccessibilityTrusted).toHaveBeenLastCalledWith(true))
  expect(screen.getByText('단축키와 인식 결과를 현재 앱에 입력할 수 있습니다.')).toBeInTheDocument()
})
it('refreshes Accessibility after returning from System Settings', async () => {
  vi.mocked(checkAccessibilityPermission).mockResolvedValue(false)
  render(<LocalPermissionsStep />)
  await waitFor(() => expect(store.setAccessibilityTrusted).toHaveBeenLastCalledWith(false))
  vi.mocked(checkAccessibilityPermission).mockResolvedValue(true)
  fireEvent(window, new Event('focus'))
  await waitFor(() => expect(store.setAccessibilityTrusted).toHaveBeenLastCalledWith(true))
})
