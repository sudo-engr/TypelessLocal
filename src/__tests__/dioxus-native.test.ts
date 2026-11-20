import { beforeEach, expect, it, vi } from 'vitest'
const { win, monitor } = vi.hoisted(() => ({
  win: {
    setFocusable: vi.fn(),
    setSize: vi.fn(),
    setPosition: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
    outerPosition: vi.fn(),
    outerSize: vi.fn(),
    scaleFactor: vi.fn(),
  },
  monitor: {
    position: { x: 0, y: 0 },
    size: { width: 2000, height: 1200 },
    workArea: { position: { x: 0, y: 50 }, size: { width: 2000, height: 1100 } },
    scaleFactor: 2,
  },
}))
vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => win,
  Window: { getByLabel: vi.fn(async () => null) },
  LogicalSize: class {
    constructor(
      public width: number,
      public height: number,
    ) {}
  },
  PhysicalPosition: class {
    constructor(
      public x: number,
      public y: number,
    ) {}
  },
  availableMonitors: async () => [monitor],
  primaryMonitor: async () => monitor,
  currentMonitor: async () => monitor,
  monitorFromPoint: async () => monitor,
}))
beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})
it('places the first capsule inside the physical work area without stealing focus', async () => {
  const { resizeCapsule } = await import('../dioxus-native')
  await resizeCapsule({ width: 200, height: 36, show: true })
  expect(win.setFocusable).toHaveBeenCalledWith(false)
  expect(win.setSize).toHaveBeenCalledWith({ width: 224, height: 60 })
  expect(win.setPosition).toHaveBeenCalledWith({ x: 776, y: 870 })
  expect(win.show).toHaveBeenCalledOnce()
})
it('coalesces queued requests and keeps the latest idle auto-hide setting', async () => {
  const { resizeCapsule } = await import('../dioxus-native')
  await Promise.all([
    resizeCapsule({ width: 200, height: 36 }),
    resizeCapsule({ width: 36, height: 36, show: false }),
  ])
  expect(win.setSize).toHaveBeenCalledOnce()
  expect(win.setSize).toHaveBeenCalledWith({ width: 60, height: 60 })
  expect(win.hide).toHaveBeenCalledOnce()
  expect(win.show).not.toHaveBeenCalled()
})
it('rejects malformed sizes before changing any native window', async () => {
  const { resizeCapsule } = await import('../dioxus-native')
  await expect(resizeCapsule({ width: Number.NaN, height: 36 })).rejects.toThrow('잘못된')
  expect(win.setSize).not.toHaveBeenCalled()
})
