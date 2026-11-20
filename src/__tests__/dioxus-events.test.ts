import { describe, expect, it } from 'vitest'
import { createEventQueue } from '../dioxus-events'

describe('Dioxus event delivery', () => {
  it('buffers events before WASM starts and preserves error/idle ordering', async () => {
    const queue = createEventQueue()
    queue.push('pipeline:error', 'failed')
    queue.push('pipeline:state', 'idle')
    expect(await queue.next()).toEqual({ event: 'pipeline:error', payload: 'failed' })
    expect(await queue.next()).toEqual({ event: 'pipeline:state', payload: 'idle' })
  })
  it('coalesces volume samples without discarding lifecycle events', async () => {
    const queue = createEventQueue()
    queue.push('audio:volume', 0.1)
    queue.push('pipeline:state', 'recording')
    queue.push('audio:volume', 0.8)
    expect(await queue.next()).toEqual({ event: 'audio:volume', payload: 0.8 })
    expect(await queue.next()).toEqual({ event: 'pipeline:state', payload: 'recording' })
  })
  it('delivers a live event once and rejects concurrent consumers', async () => {
    const queue = createEventQueue()
    const waiting = queue.next()
    await expect(queue.next()).rejects.toThrow('이미 연결')
    queue.push('stt:final', '안녕하세요')
    expect(await waiting).toEqual({ event: 'stt:final', payload: '안녕하세요' })
  })
})
