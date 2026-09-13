export const CONSENT_KEY = 'aegis-consent'

export type ConsentLevel = 'essential' | 'all'

export const readConsent = (): ConsentLevel | null => {
  if (typeof localStorage === 'undefined') return null
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'all' || v === 'essential' ? v : null
  } catch {
    return null
  }
}

export const hasAssistantConsent = (): boolean => readConsent() === 'all'
