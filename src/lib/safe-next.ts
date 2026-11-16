/** Only relative in-app paths are allowed as post-login redirect targets. */
export function safeNext(next: string | null | undefined, fallback = '/today'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return fallback
  return next
}
