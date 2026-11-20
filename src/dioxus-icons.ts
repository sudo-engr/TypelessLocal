import { createIcon } from 'kubai-icons'
import ArrowLeft from 'kubai-icons/icons/arrow-left'
import ArrowRight from 'kubai-icons/icons/arrow-right'
import BookOpen from 'kubai-icons/icons/book-open'
import ChevronDown from 'kubai-icons/icons/chevron-down'
import CircleCheck from 'kubai-icons/icons/circle-check'
import CirclePlus from 'kubai-icons/icons/circle-plus'
import CircleX from 'kubai-icons/icons/circle-x'
import CloudOff from 'kubai-icons/icons/cloud-off'
import CloudUpload from 'kubai-icons/icons/cloud-upload'
import Copy from 'kubai-icons/icons/copy'
import Download from 'kubai-icons/icons/download'
import ExternalLink from 'kubai-icons/icons/external-link'
import Eye from 'kubai-icons/icons/eye'
import EyeOff from 'kubai-icons/icons/eye-off'
import FileText from 'kubai-icons/icons/file-text'
import FolderOpen from 'kubai-icons/icons/folder-open'
import Grid from 'kubai-icons/icons/grid'
import Grip from 'kubai-icons/icons/grip'
import History from 'kubai-icons/icons/history'
import Home from 'kubai-icons/icons/home'
import Info from 'kubai-icons/icons/info'
import Keyboard from 'kubai-icons/icons/keyboard'
import Loader from 'kubai-icons/icons/loader'
import MessageCircle from 'kubai-icons/icons/message-circle'
import Mic from 'kubai-icons/icons/mic'
import Pencil from 'kubai-icons/icons/pencil'
import RotateCw from 'kubai-icons/icons/rotate-cw'
import Save from 'kubai-icons/icons/save'
import Search from 'kubai-icons/icons/search'
import Settings from 'kubai-icons/icons/settings'
import ShieldCheck from 'kubai-icons/icons/shield-check'
import Sparkles from 'kubai-icons/icons/sparkles'
import Square from 'kubai-icons/icons/square'
import Trash from 'kubai-icons/icons/trash'
import TriangleAlert from 'kubai-icons/icons/triangle-alert'
const icons = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'book-open': BookOpen,
  'chevron-down': ChevronDown,
  'circle-check': CircleCheck,
  'circle-plus': CirclePlus,
  'circle-x': CircleX,
  'cloud-off': CloudOff,
  'cloud-upload': CloudUpload,
  copy: Copy,
  download: Download,
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  'file-text': FileText,
  'folder-open': FolderOpen,
  grid: Grid,
  grip: Grip,
  history: History,
  home: Home,
  info: Info,
  keyboard: Keyboard,
  loader: Loader,
  'message-circle': MessageCircle,
  mic: Mic,
  pencil: Pencil,
  'rotate-cw': RotateCw,
  save: Save,
  search: Search,
  settings: Settings,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  square: Square,
  trash: Trash,
  'triangle-alert': TriangleAlert,
}
const aliases: Record<string, keyof typeof icons> = {
  zap: 'sparkles',
  'trash-2': 'trash',
  'more-horizontal': 'grip',
  ellipsis: 'grip',
  'refresh-cw': 'rotate-cw',
  x: 'circle-x',
  plus: 'circle-plus',
  upload: 'cloud-upload',
  'layout-grid': 'grid',
  'loader-circle': 'loader',
}
const rendered = new WeakMap<Element, ReturnType<typeof createIcon>>()

function hosts(node: Node): Element[] {
  if (!(node instanceof Element)) return []
  return [
    ...(node.matches('[data-kubai-icon]') ? [node] : []),
    ...node.querySelectorAll('[data-kubai-icon]'),
  ]
}

export function installIcons() {
  const render = (host: Element) => {
    if (rendered.has(host)) return
    const name = host.getAttribute('data-kubai-icon') ?? ''
    const icon = icons[(aliases[name] ?? name) as keyof typeof icons]
    if (!icon) {
      console.error('등록되지 않은 Kubai 아이콘:', name)
      return
    }
    const size = Math.min(64, Math.max(12, Number(host.getAttribute('data-size')) || 20))
    const svg = createIcon(icon, {
      size,
      color: 'currentColor',
      variant: 'soft',
      trigger: 'parent',
    })
    ;(host as HTMLElement).style.width = `${size}px`
    ;(host as HTMLElement).style.height = `${size}px`
    host.replaceChildren(svg)
    rendered.set(host, svg)
  }
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.removedNodes)
        for (const host of hosts(node)) {
          if (host.isConnected) continue
          rendered.get(host)?.kubai?.destroy()
          rendered.delete(host)
        }
      for (const node of record.addedNodes) hosts(node).forEach(render)
      if (record.type === 'attributes') {
        const host = record.target as Element
        rendered.get(host)?.kubai?.destroy()
        rendered.delete(host)
        render(host)
      }
    }
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-kubai-icon', 'data-size'],
  })
  document.querySelectorAll('[data-kubai-icon]').forEach(render)
  addEventListener('beforeunload', () => observer.disconnect(), { once: true })
}
