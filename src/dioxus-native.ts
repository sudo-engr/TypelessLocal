import {
  getCurrentWindow,
  Window,
  LogicalSize,
  PhysicalPosition,
  availableMonitors,
  primaryMonitor,
  currentMonitor,
  monitorFromPoint,
} from '@tauri-apps/api/window'
import {
  getCapsuleResizePosition,
  getCapsuleBottomCenterPosition,
  getCapsuleRecoveryPosition,
} from './lib/capsule-layout'

let initialized = false
let generation = 0
// Serialize native window changes; an older resize must never overwrite the latest position.
let pending: Promise<void> = Promise.resolve()
export function resizeCapsule({
  width,
  height,
  show = true,
  active = false,
}: {
  width: number
  height: number
  show?: boolean
  active?: boolean
}) {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1 ||
    width > 800 ||
    height > 800
  )
    return Promise.reject(new Error('잘못된 캡슐 크기입니다.'))
  const current = ++generation
  const size = { width: width + 24, height: height + 24 }
  const resize = async () => {
    if (current !== generation) return
    const win = getCurrentWindow()
    await win.setFocusable(false)
    const monitors = await availableMonitors()
    const anchor = async () => {
      const main = await Window.getByLabel('main')
      if (main) {
        const [point, dimensions] = await Promise.all([main.outerPosition(), main.outerSize()])
        const monitor = await monitorFromPoint(
          point.x + dimensions.width / 2,
          point.y + dimensions.height / 2,
        )
        if (monitor) return monitor
      }
      return (await primaryMonitor()) ?? monitors[0]
    }
    let monitor = await currentMonitor()
    let position: { x: number; y: number } | undefined
    if (!initialized) {
      monitor = (await anchor()) ?? monitor
      if (monitor) position = getCapsuleBottomCenterPosition(monitor, size)
    } else {
      const [point, dimensions, scale] = await Promise.all([
        win.outerPosition(),
        win.outerSize(),
        win.scaleFactor(),
      ])
      position = getCapsuleResizePosition({ ...point, ...dimensions }, size, scale)
      if (active) {
        const target = await anchor()
        if (
          target &&
          (!monitor ||
            target.position.x !== monitor.position.x ||
            target.position.y !== monitor.position.y)
        ) {
          position = getCapsuleBottomCenterPosition(target, size)
          monitor = target
        }
      }
      const recovery = monitor ?? (await primaryMonitor()) ?? monitors[0]
      if (recovery)
        position =
          getCapsuleRecoveryPosition(
            {
              ...position,
              width: Math.round(size.width * scale),
              height: Math.round(size.height * scale),
            },
            monitors,
            recovery,
            size,
          ) ?? position
    }
    if (current !== generation) return
    await win.setSize(new LogicalSize(size.width, size.height))
    if (position) await win.setPosition(new PhysicalPosition(position.x, position.y))
    if (current !== generation) return
    if (show) await win.show()
    else await win.hide()
    initialized = true
  }
  pending = pending.catch(() => {}).then(resize)
  return pending
}
