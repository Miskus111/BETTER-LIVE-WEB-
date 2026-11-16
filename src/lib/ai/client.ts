import 'server-only'
import Anthropic from '@anthropic-ai/sdk'

/** Model is configurable per deployment; Opus 5.5 is the default. */
export const AI_MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5'

/** True when an API key is configured — every AI feature degrades gracefully without it. */
export const isAiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY)

let client: Anthropic | null = null
export function getAnthropic(): Anthropic | null {
  if (!isAiConfigured()) return null
  client ??= new Anthropic()
  return client
}

/**
 * Request fields shared by every call: server-side refusal fallback (routes a declined
 * request to a fallback model inside the same call) on the beta endpoint.
 */
export const fallbackParams = (): {
  betas: Anthropic.Beta.AnthropicBeta[]
  fallbacks: Anthropic.Beta.MessageCreateParams['fallbacks']
} => ({ betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' })
