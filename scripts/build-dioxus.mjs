import { spawnSync } from 'node:child_process'
import {
  accessSync,
  constants,
  mkdirSync,
  renameSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const release = process.argv.includes('--release')
const executable = process.platform === 'win32' ? 'wasm-bindgen.exe' : 'wasm-bindgen'
const localBindgen = join(root, '.tools', 'bin', executable)
const bindgen = process.env.WASM_BINDGEN ?? (existsSync(localBindgen) ? localBindgen : executable)
const target = process.env.CARGO_TARGET_DIR
  ? resolve(process.env.CARGO_TARGET_DIR)
  : join(root, 'frontend', 'target')
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', env: process.env })
  if (result.error) throw new Error(`${command} 실행 실패: ${result.error.message}`)
  if (result.status !== 0) process.exit(result.status ?? 1)
}
try {
  if (bindgen === localBindgen) accessSync(bindgen, constants.X_OK)
  run('cargo', [
    'build',
    '--manifest-path',
    'frontend/Cargo.toml',
    '--target',
    'wasm32-unknown-unknown',
    '--frozen',
    ...(release ? ['--release'] : []),
  ])
  const output = join(root, 'public', 'dioxus')
  const staging = `${output}.staging`
  mkdirSync(staging, { recursive: true })
  run(bindgen, [
    join(target, 'wasm32-unknown-unknown', release ? 'release' : 'debug', 'typelesslocal-ui.wasm'),
    '--target',
    'web',
    '--out-name',
    'typelesslocal_ui',
    '--out-dir',
    staging,
    '--no-typescript',
  ])
  writeFileSync(
    join(staging, 'brand.svg'),
    readFileSync(join(root, 'src/assets/typelesslocal.svg')),
  )
  // The glue and WASM must come from the same build. Publish them together.
  const glue = readFileSync(join(staging, 'typelesslocal_ui.js'), 'utf8')
  if (!glue.includes('typelesslocal_ui_bg.wasm'))
    throw new Error('WebAssembly 출력 파일이 일치하지 않습니다.')
  writeFileSync(
    join(staging, 'boot.js'),
    `import init from './typelesslocal_ui.js';
try {
  const wasm = await init();
  if (typeof wasm.__wbindgen_start !== 'function') wasm.main();
} catch (error) {
  window.dispatchEvent(new CustomEvent('dioxus:load-error', {detail:String(error)}));
}
`,
  )
  rmSync(output, { recursive: true, force: true })
  renameSync(staging, output)
} catch (error) {
  console.error(error.message)
  console.error('빌드 준비: frontend/README.md의 승인된 Dioxus·WASM 도구 설치 절차를 확인하세요.')
  process.exit(1)
}
