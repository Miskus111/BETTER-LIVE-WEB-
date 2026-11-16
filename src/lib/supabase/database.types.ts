/**
 * Database types for the tables used so far. Regenerate the full file once the project is linked:
 *   npx supabase gen types typescript --project-id <ref> --schema public > src/lib/supabase/database.types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export type Goal =
  'fat_loss' | 'muscle' | 'performance' | 'health' | 'longevity' | 'pain_relief' | 'appearance'
export type ConsentKind = 'health_data' | 'terms' | 'marketing'

export type ProfileRow = {
  id: string
  display_name: string | null
  birth_date: string | null
  sex: 'female' | 'male' | null
  height_cm: number | null
  weight_kg: number | null
  experience: 'beginner' | 'intermediate' | 'advanced' | 'athlete' | null
  locale: 'cs' | 'en'
  units: 'metric' | 'imperial'
  onboarded_at: string | null
  created_at: string
  updated_at: string
}

export type PreferencesRow = {
  user_id: string
  sports: string[]
  training_days: number | null
  session_minutes: number | null
  equipment: string[]
  diet_type: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'other' | null
  allergies: string[]
  dislikes: string[]
  budget: 'low' | 'medium' | 'high' | null
  pain_areas: string[]
  medications: string | null
  sleep_hours: number | null
  work_pattern: 'desk' | 'standing' | 'physical' | 'shift' | null
  updated_at: string
}

export type GoalRow = {
  id: string
  user_id: string
  goal: Goal
  priority: number
  created_at: string
}

export type ConsentRow = {
  id: string
  user_id: string
  kind: ConsentKind
  granted: boolean
  version: string
  created_at: string
}

export type SubscriptionRow = {
  user_id: string
  plan: 'free' | 'pro'
  status: string
  provider: 'none' | 'mock' | 'stripe'
  provider_customer_id: string | null
  provider_subscription_id: string | null
  current_period_end: string | null
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, { id: string } & Partial<ProfileRow>>
      preferences: Table<PreferencesRow, Partial<PreferencesRow>>
      goals: Table<GoalRow, { goal: Goal } & Partial<GoalRow>>
      consents: Table<
        ConsentRow,
        { kind: ConsentKind; granted: boolean; version: string } & Partial<ConsentRow>
      >
      subscriptions: Table<SubscriptionRow>
    }
    Views: {
      current_consents: {
        Row: Pick<ConsentRow, 'user_id' | 'kind' | 'granted' | 'version' | 'created_at'>
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
