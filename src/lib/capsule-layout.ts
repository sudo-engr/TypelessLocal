import type { PipelineState } from '../stores/appStore'

interface CapsuleSize {
  width: number
  height: number
}

interface PhysicalPoint {
  x: number
  y: number
}

interface PhysicalDimensions {
  width: number
  height: number
}

export interface CapsuleWorkArea {
  position: PhysicalPoint
  size: PhysicalDimensions
}

export interface CapsuleMonitorBounds {
  position: PhysicalPoint
  size: PhysicalDimensions
}

export interface CapsulePlacementMonitor {
  scaleFactor: number
  workArea: CapsuleWorkArea
}

export interface CapsuleMonitorGeometry extends CapsuleMonitorBounds, CapsulePlacementMonitor {}

export interface CapsuleWindowRect extends PhysicalPoint, PhysicalDimensions {}

export function getCapsuleResizePosition(
  previous: CapsuleWindowRect,
  logicalSize: CapsuleSize,
  scaleFactor: number,
): PhysicalPoint {
  return {
    x: Math.round(previous.x + (previous.width - logicalSize.width * scaleFactor) / 2),
    y: Math.round(previous.y + (previous.height - logicalSize.height * scaleFactor) / 2),
  }
}

const CAPSULE_BOTTOM_MARGIN = 80

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

export function getCapsuleBottomCenterPosition(
  monitor: CapsulePlacementMonitor,
  logicalSize: CapsuleSize,
): PhysicalPoint {
  const physicalWidth = Math.round(logicalSize.width * monitor.scaleFactor)
  const physicalHeight = Math.round(logicalSize.height * monitor.scaleFactor)
  const margin = Math.round(CAPSULE_BOTTOM_MARGIN * monitor.scaleFactor)
  const { position, size } = monitor.workArea
  const centeredX = position.x + Math.round((size.width - physicalWidth) / 2)
  const bottomY = position.y + size.height - physicalHeight - margin

  return {
    x: clamp(centeredX, position.x, position.x + size.width - physicalWidth),
    y: clamp(bottomY, position.y, position.y + size.height - physicalHeight),
  }
}

export function isCapsuleVisibleOnAnyMonitor(
  capsule: CapsuleWindowRect,
  monitors: CapsuleMonitorBounds[],
): boolean {
  return monitors.some(({ position, size }) => {
    const right = position.x + size.width
    const bottom = position.y + size.height
    const capsuleRight = capsule.x + capsule.width
    const capsuleBottom = capsule.y + capsule.height

    return (
      capsule.x < right &&
      capsuleRight > position.x &&
      capsule.y < bottom &&
      capsuleBottom > position.y
    )
  })
}

export function getCapsuleRecoveryPosition(
  capsule: CapsuleWindowRect,
  monitors: CapsuleMonitorBounds[],
  recoveryMonitor: CapsulePlacementMonitor,
  logicalSize: CapsuleSize,
): PhysicalPoint | null {
  if (monitors.length === 0 || isCapsuleVisibleOnAnyMonitor(capsule, monitors)) {
    return null
  }

  return getCapsuleBottomCenterPosition(recoveryMonitor, logicalSize)
}

export interface CapsuleVisibilityInput {
  capsuleAutoHide: boolean
  contextMenuOpen: boolean
  translationTargetMenuOpen?: boolean
  capsuleExpanded: boolean
  hasError: boolean
  pipelineState: PipelineState
}

export function getCapsuleVisibility({
  capsuleAutoHide,
  contextMenuOpen,
  translationTargetMenuOpen = false,
  capsuleExpanded,
  hasError,
  pipelineState,
}: CapsuleVisibilityInput): boolean {
  return (
    !capsuleAutoHide ||
    contextMenuOpen ||
    translationTargetMenuOpen ||
    capsuleExpanded ||
    hasError ||
    pipelineState !== 'idle'
  )
}

export function getCapsuleFocusable(): boolean {
  return false
}
