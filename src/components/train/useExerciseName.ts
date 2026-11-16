'use client'
import { useLocale } from 'next-intl'
import { EXERCISE_BY_SLUG } from '@/data/exercises'

/** Localised exercise name by slug (falls back to the slug for unknown/custom exercises). */
export function useExerciseName() {
  const locale = useLocale() as 'cs' | 'en'
  return (slug: string) => EXERCISE_BY_SLUG[slug]?.name[locale] ?? slug
}
