import { installBridge } from './dioxus-bridge'
import { installIcons } from './dioxus-icons'
import { installModalFocus } from './dioxus-dialogs'
import '../frontend/assets/ui.css'

installBridge()
installIcons()
installModalFocus()

function showStartupError(error: unknown) {
  console.error('Dioxus 시작 실패:', error)
  const root = document.getElementById('main')!
  const heading = document.createElement('h1')
  heading.textContent = '화면을 시작하지 못했습니다'
  const message = document.createElement('p')
  message.textContent = error instanceof Error ? error.message : String(error)
  const button = document.createElement('button')
  button.textContent = '다시 시도'
  button.className = 'btn'
  button.onclick = () => location.reload()
  root.className = 'empty-state gap-4'
  root.replaceChildren(heading, message, button)
}

addEventListener('dioxus:load-error', (event) => showStartupError((event as CustomEvent).detail))
const loader = document.createElement('script')
loader.type = 'module'
loader.src = '/dioxus/boot.js'
loader.onerror = () => showStartupError(new Error('WebAssembly 로더를 불러오지 못했습니다.'))
document.body.append(loader)
