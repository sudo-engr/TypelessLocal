import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'

const BAR_COUNT = 7
const MIN_HEIGHT = 3
const MAX_HEIGHT = 16

function setWaveformBar(bar: HTMLDivElement, height: number, opacity: number) {
  bar.style.setProperty('--ui-waveform-height', `${height}px`)
  bar.style.setProperty('--ui-waveform-opacity', `${opacity}`)
}

export function Waveform() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number>(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      // Static bars at mid-height when reduced motion is preferred
      barsRef.current.forEach((bar) => {
        if (!bar) return
        setWaveformBar(bar, (MIN_HEIGHT + MAX_HEIGHT) / 2, 0.7)
      })
      return
    }

    const animate = () => {
      const volume = useAppStore.getState().audioVolume
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        const offset = Math.sin(Date.now() / 200 + i * 0.9) * 0.15
        const normalized = Math.max(0, Math.min(1, volume + offset))
        const height = MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * normalized
        const opacity = Math.max(0.5, normalized)
        setWaveformBar(bar, height, opacity)
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reduced])

  return (
    <div className="flex items-center justify-center gap-0.75 h-4">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            barsRef.current[i] = el
          }}
          className="ui-waveform-bar w-0.5 rounded-full bg-white/80"
        />
      ))}
    </div>
  )
}
