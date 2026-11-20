/** One consumer per webview. Volume is coalesced so a slow render cannot grow the queue. */
export function createEventQueue() {
  const queue: { event: string; payload: unknown }[] = []
  let waiter: ((value: { event: string; payload: unknown }) => void) | undefined
  return {
    push(event: string, payload: unknown) {
      const value = { event, payload }
      if (waiter) {
        const resolve = waiter
        waiter = undefined
        resolve(value)
        return
      }
      if (
        event === 'audio:volume' ||
        event === 'stt:partial' ||
        event === 'local-model:download-progress'
      ) {
        const pending = queue.findIndex((item) => item.event === event)
        if (pending !== -1) {
          queue[pending] = value
          return
        }
      }
      queue.push(value)
    },
    next(): Promise<{ event: string; payload: unknown }> {
      const value = queue.shift()
      if (value) return Promise.resolve(value)
      if (waiter) return Promise.reject(new Error('이벤트 소비자가 이미 연결돼 있습니다.'))
      return new Promise((resolve) => {
        waiter = resolve
      })
    },
  }
}
