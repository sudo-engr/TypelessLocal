import { useEffect, useRef } from 'react'
import { useAppStore, type PipelineState } from '../stores/appStore'

import {
  getCapsuleResizePosition,
  getCapsuleBottomCenterPosition,
  getCapsuleRecoveryPosition,
  getCapsuleVisibility,
  getCapsuleFocusable,
} from '../lib/capsule-layout'
export * from '../lib/capsule-layout'

interface CapsuleSize {
  width: number
  height: number
}

function getSizeForState(
  state: PipelineState,
  expanded: boolean,
  hasError: boolean,
  contextMenuOpen: boolean,
  translationTargetMenuOpen = false,
): CapsuleSize {
  if (translationTargetMenuOpen) return { width: 360, height: 180 }
  if (contextMenuOpen) return { width: 220, height: 220 }
  if (hasError) return { width: 200, height: 36 }
  if (expanded) return { width: 220, height: 90 }
  switch (state) {
    case 'idle':
      return { width: 36, height: 36 }
    case 'preparing':
      return { width: 180, height: 36 }
    case 'recording':
    case 'transcribing':
    case 'polishing':
      return { width: 200, height: 36 }
    case 'outputting':
      return { width: 144, height: 36 }
    case 'ask_recording':
    case 'ask_thinking':
      return { width: 168, height: 36 }
    default:
      return { width: 36, height: 36 }
  }
}

export function useCapsuleResize() {
  const pipelineState = useAppStore((s) => s.pipelineState)
  const capsuleExpanded = useAppStore((s) => s.capsuleExpanded)
  const pipelineError = useAppStore((s) => s.pipelineError)
  const contextMenuOpen = useAppStore((s) => s.contextMenuOpen)
  const translationTargetMenuOpen = useAppStore((s) => s.translationTargetMenuOpen)
  const setContextMenuReady = useAppStore((s) => s.setContextMenuReady)
  const capsuleAutoHide = useAppStore((s) => s.config.capsule_auto_hide)
  const initialized = useRef(false)
  const prevWindowSize = useRef<{ width: number; height: number } | null>(null)
  const effectGeneration = useRef(0)

  const hasError = pipelineError !== null

  useEffect(() => {
    const generation = ++effectGeneration.current
    let cancelled = false
    const isCurrent = () => !cancelled && effectGeneration.current === generation
    const size = getSizeForState(
      pipelineState,
      capsuleExpanded,
      hasError,
      contextMenuOpen,
      translationTargetMenuOpen,
    )
    const windowWidth = size.width + 24
    const windowHeight = size.height + 24
    const shouldShow = getCapsuleVisibility({
      capsuleAutoHide,
      contextMenuOpen,
      translationTargetMenuOpen,
      capsuleExpanded,
      hasError,
      pipelineState,
    })

    import('@tauri-apps/api/window')
      .then(
        async ({
          getCurrentWindow,
          LogicalSize,
          PhysicalPosition,
          availableMonitors,
          currentMonitor,
          primaryMonitor,
          monitorFromPoint,
          Window,
        }) => {
          if (!isCurrent()) return

          const win = getCurrentWindow()
          const anchorMonitor = async () => {
            try {
              const main = await Window.getByLabel('main')
              if (main) {
                const [position, dimensions] = await Promise.all([
                  main.outerPosition(),
                  main.outerSize(),
                ])
                const monitor = await monitorFromPoint(
                  position.x + dimensions.width / 2,
                  position.y + dimensions.height / 2,
                )
                if (monitor) return monitor
              }
            } catch {
              /* fall back when the main window is absent or minimized */
            }
            return primaryMonitor().catch(() => null)
          }
          if (!isCurrent()) return
          await win.setFocusable(getCapsuleFocusable()).catch(() => {})
          if (!isCurrent()) return

          if (!initialized.current) {
            // First mount: position at bottom-center of screen, then show
            if (!isCurrent()) return
            await win.setSize(new LogicalSize(windowWidth, windowHeight)).catch(() => {})
            if (!isCurrent()) return

            try {
              const monitors = await availableMonitors()
              if (!isCurrent()) return

              let monitor = await anchorMonitor()
              if (!isCurrent()) return

              if (!monitor) {
                monitor = await currentMonitor().catch(() => null)
                if (!isCurrent()) return
              }
              monitor ??= monitors[0]

              if (monitor) {
                const position = getCapsuleBottomCenterPosition(monitor, {
                  width: windowWidth,
                  height: windowHeight,
                })
                if (!isCurrent()) return
                await win.setPosition(new PhysicalPosition(position.x, position.y)).catch(() => {})
                if (!isCurrent()) return
              }
            } catch {
              /* ignore – monitor info unavailable */
            }

            if (!isCurrent()) return
            if (shouldShow) {
              await win.show().catch(() => {})
            } else {
              await win.hide().catch(() => {})
            }
            if (!isCurrent()) return

            initialized.current = true
            if (!isCurrent()) return
            prevWindowSize.current = { width: windowWidth, height: windowHeight }
            return
          }

          // Keep the center stable when the idle bubble expands into a recording bar.
          const prev = prevWindowSize.current
          if (prev) {
            const pos = await win.outerPosition().catch(() => null)
            if (!isCurrent()) return

            if (pos) {
              const monitor = await currentMonitor().catch(() => null)
              if (!isCurrent()) return

              let scale = monitor?.scaleFactor
              if (scale === undefined) {
                scale = await win.scaleFactor().catch(() => 1)
                if (!isCurrent()) return
              }

              const oldSize = await win.outerSize().catch(() => null)
              if (!isCurrent()) return

              const oldHeight = oldSize?.height ?? Math.round(prev.height * scale)
              const oldWidth = oldSize?.width ?? Math.round(prev.width * scale)
              const physicalWidth = Math.round(windowWidth * scale)
              const physicalHeight = Math.round(windowHeight * scale)
              let { x: newX, y: newY } = getCapsuleResizePosition(
                { ...pos, width: oldWidth, height: oldHeight },
                { width: windowWidth, height: windowHeight },
                scale,
              )

              if (
                pipelineState === 'preparing' ||
                pipelineState === 'recording' ||
                pipelineState === 'ask_recording' ||
                hasError
              ) {
                const anchor = await anchorMonitor()
                if (!isCurrent()) return
                if (
                  anchor &&
                  (!monitor ||
                    anchor.position.x !== monitor.position.x ||
                    anchor.position.y !== monitor.position.y)
                ) {
                  const centered = getCapsuleBottomCenterPosition(anchor, {
                    width: windowWidth,
                    height: windowHeight,
                  })
                  newX = centered.x
                  newY = centered.y
                }
              }

              if (!isCurrent()) return
              await win.setSize(new LogicalSize(windowWidth, windowHeight)).catch(() => {})
              if (!isCurrent()) return

              try {
                const monitors = await availableMonitors()
                if (!isCurrent()) return

                const proposedRect = {
                  x: newX,
                  y: newY,
                  width: physicalWidth,
                  height: physicalHeight,
                }
                if (monitors.length > 0) {
                  const recoveryMonitor =
                    (await primaryMonitor().catch(() => null)) ?? monitor ?? monitors[0]
                  if (!isCurrent()) return

                  const recovered = getCapsuleRecoveryPosition(
                    proposedRect,
                    monitors,
                    recoveryMonitor,
                    {
                      width: windowWidth,
                      height: windowHeight,
                    },
                  )
                  if (recovered) {
                    newX = recovered.x
                    newY = recovered.y
                  }
                }
              } catch {
                /* keep the previous position when monitor info is unavailable */
              }

              if (!isCurrent()) return
              await win.setPosition(new PhysicalPosition(newX, newY)).catch(() => {})
              if (!isCurrent()) return
            } else {
              if (!isCurrent()) return
              await win.setSize(new LogicalSize(windowWidth, windowHeight)).catch(() => {})
              if (!isCurrent()) return
            }
          } else {
            if (!isCurrent()) return
            await win.setSize(new LogicalSize(windowWidth, windowHeight)).catch(() => {})
            if (!isCurrent()) return
          }

          if (!isCurrent()) return
          prevWindowSize.current = { width: windowWidth, height: windowHeight }

          // Signal that the window has finished resizing for context menu
          if (contextMenuOpen) {
            if (!isCurrent()) return
            setContextMenuReady(true)
          }

          if (!isCurrent()) return
          if (shouldShow) {
            await win.show().catch(() => {})
          } else {
            await win.hide().catch(() => {})
          }
          if (!isCurrent()) return
        },
      )
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [
    pipelineState,
    capsuleExpanded,
    hasError,
    contextMenuOpen,
    translationTargetMenuOpen,
    capsuleAutoHide,
    setContextMenuReady,
  ])

  return getSizeForState(
    pipelineState,
    capsuleExpanded,
    hasError,
    contextMenuOpen,
    translationTargetMenuOpen,
  )
}
