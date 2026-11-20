import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const cmake = fileURLToPath(
  new URL(`../.tools/cmake/bin/cmake${process.platform === 'win32' ? '.exe' : ''}`, import.meta.url),
)
const env = { ...process.env }
if (!env.CMAKE && existsSync(cmake)) env.CMAKE = cmake
const child = spawn(process.execPath, ['node_modules/@tauri-apps/cli/tauri.js', ...process.argv.slice(2)], {
  cwd: root,
  env,
  stdio: 'inherit',
})
child.on('error', (error) => {
  console.error(error.message)
  process.exitCode = 1
})
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exitCode = code ?? 1
})
