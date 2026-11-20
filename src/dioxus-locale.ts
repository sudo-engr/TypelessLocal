import de from './i18n/locales/de.json'
import en from './i18n/locales/en.json'
import es from './i18n/locales/es.json'
import fr from './i18n/locales/fr.json'
import it from './i18n/locales/it.json'
import ja from './i18n/locales/ja.json'
import ko from './i18n/locales/ko.json'
import pt from './i18n/locales/pt.json'
import ru from './i18n/locales/ru.json'
import zh from './i18n/locales/zh.json'
import fallback from '../frontend/assets/en-ui.json'

const locales: Record<string, unknown> = { de, en, es, fr, it, ja, ko, pt, ru, zh }
const keys = new Map<string, string[]>()
function index(value: unknown, path: string[] = []) {
  if (!value || typeof value !== 'object') return
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === 'string' && !item.includes('{{')) keys.set(item, [...path, key])
    else if (item && typeof item === 'object') index(item, [...path, key])
  }
}
index(ko)
function lookup(resource: unknown, path: string[]) {
  let value: unknown = resource
  for (const key of path) {
    if (!value || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[key]
  }
  return typeof value === 'string' && !value.includes('{{') ? value : undefined
}

// Only explicit UI labels enter this lookup; transcripts and saved user content bypass it.
export function translate(text: string, language: string): string {
  if (language === 'ko') return text
  const path = keys.get(text)
  if (path) {
    const localized = lookup(locales[language] ?? en, path) ?? lookup(en, path)
    if (localized) return localized
  }
  return (fallback as Record<string, string>)[text] ?? text
}
