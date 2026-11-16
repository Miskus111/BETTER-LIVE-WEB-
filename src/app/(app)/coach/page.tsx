import { getTranslations } from 'next-intl/server'
import { requireAppUser } from '@/lib/auth'
import { isAiConfigured } from '@/lib/ai/client'
import { CoachChat, type ChatMessage, type Conversation } from '@/components/coach/CoachChat'

type Db = { from: (t: string) => any } // eslint-disable-line @typescript-eslint/no-explicit-any

export default async function CoachPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { supabase } = await requireAppUser()
  const db = supabase as unknown as Db
  const t = await getTranslations('coach')
  const { c } = await searchParams
  const { data: conversations } = await db
    .from('coach_conversations')
    .select('id, title')
    .order('updated_at', { ascending: false })
    .limit(30)
  const current = c && (conversations ?? []).some((x: Conversation) => x.id === c) ? c : null
  const { data: msgs } = current
    ? await db
        .from('coach_messages')
        .select('role, content')
        .eq('conversation_id', current)
        .in('role', ['user', 'assistant'])
        .order('created_at')
    : { data: [] }
  return (
    <div>
      <h1 className="display mb-6 text-[44px] md:text-[56px]">{t('title')}</h1>
      <CoachChat
        key={current ?? 'new'}
        conversations={(conversations ?? []) as Conversation[]}
        conversationId={current}
        initial={(msgs ?? []) as ChatMessage[]}
        aiEnabled={isAiConfigured()}
      />
    </div>
  )
}
