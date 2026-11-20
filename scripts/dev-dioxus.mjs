import { spawn, spawnSync } from 'node:child_process'
import { watch } from 'node:fs'

const build = () => spawn(process.execPath, ['scripts/build-dioxus.mjs'], { stdio: 'inherit' })
const first = spawnSync(process.execPath, ['scripts/build-dioxus.mjs'], { stdio: 'inherit' })
if (first.status !== 0) process.exit(first.status ?? 1)
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit' })
let building = false
let dirty = false
let debounce
function rebuild() {
  if (building) {
    dirty = true
    return
  }
  building = true
  const child = build()
  child.on('exit', () => {
    building = false
    if (dirty) {
      dirty = false
      rebuild()
    }
  })
}
const watcher = watch('frontend/src', { recursive: true }, (_type, file) => {
  if (!file?.endsWith('.rs')) return
  clearTimeout(debounce)
  debounce = setTimeout(rebuild, 150)
})
function stop() {
  watcher.close()
  clearTimeout(debounce)
  vite.kill()
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
vite.on('exit', (code) => {
  watcher.close()
  process.exit(code ?? 0)
})
