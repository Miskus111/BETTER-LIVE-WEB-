import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeNext } from '@/lib/safe-next'

/** OAuth / email-confirmation callback: exchanges the code for a session cookie. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }
  // an expired or reused reset link: the reset page explains it and offers a new one
  if (next === '/reset-password') return NextResponse.redirect(`${origin}/reset-password`)
  return NextResponse.redirect(`${origin}/login?error=callback`)
}
