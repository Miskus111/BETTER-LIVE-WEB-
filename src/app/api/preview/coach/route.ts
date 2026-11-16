import { NextResponse } from 'next/server'
import { FIXED_REPLY, screenMessage } from '@/lib/coach/safety'

/** Test-only stand-in for /api/coach (ENABLE_PREVIEW=1): runs the real safety screen, no model, no database. */
export async function POST(req: Request) {
  if (process.env.ENABLE_PREVIEW !== '1') return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const { message, locale = 'cs' } = (await req.json()) as { message: string; locale?: 'cs' | 'en' }
  const screen = screenMessage(message)
  if (screen === 'emergency' || screen === 'crisis')
    return NextResponse.json({ conversationId: null, reply: FIXED_REPLY[screen][locale], safety: screen })
  return NextResponse.json({
    conversationId: null,
    reply: '**Preview** – the model is not called here.\n\n- one\n- two',
  })
}
