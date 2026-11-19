/** Only relative in-app paths are allowed as post-login redirect targets. */
export function safeNext(next: string | null | undefined, fallback = '/today'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return fallback
  // browsers drop tabs/newlines in URLs, so "/\t/evil.com" would become "//evil.com"
  if (/[\u0000-\u001f\u007f]/.test(next)) return fallback
  try {
    // must stay on our origin after URL resolution
    if (new URL(next, 'https://app.invalid').origin !== 'https://app.invalid') return fallback
  } catch {
    return fallback
  }
  return next
}
