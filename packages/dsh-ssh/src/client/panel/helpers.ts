/**
 * Shared panel helpers: the active-dictionary pick (mirrored from the base GUI
 * locale service in `apply`) bound to the dsh-ssh interpolator in locales.ts,
 * plus a small error-message extractor. All copy stays in the locale
 * dictionaries.
 */
import { currentLocale, en, t, zh, type SshKey } from '../locales.ts'

/** Template values accepted by the interpolator. */
export type TranslateValues = Record<string, string | number>

/** Active dictionary, picked by the base GUI locale at call time. */
export function dictionary(): Record<string, string> {
  return currentLocale().toLowerCase().startsWith('en') ? { ...en } : { ...zh }
}

/** Translate a key with optional {name} template params (current language). */
export function tt(key: SshKey, values?: TranslateValues): string {
  return t(dictionary(), key, values)
}

/** Human-readable error text from an unknown thrown value. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}
