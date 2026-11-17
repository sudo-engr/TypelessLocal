import { LocalModelSetupStep } from '../Onboarding/LocalModelSetupStep'

/** Reuse the onboarding download/import flow from Settings. */
export function LocalModelPane() {
  return <LocalModelSetupStep compact allowRedownload />
}
