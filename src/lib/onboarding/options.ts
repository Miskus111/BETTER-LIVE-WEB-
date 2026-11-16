/** Option ids shared by the onboarding UI, validation and the database CHECK constraints. */
export const GOALS = [
  'fat_loss',
  'muscle',
  'performance',
  'health',
  'longevity',
  'pain_relief',
  'appearance',
] as const
export const SPORTS = [
  'gym',
  'running',
  'cycling',
  'swimming',
  'martial_arts',
  'team_sports',
  'climbing',
  'yoga',
  'tennis',
  'crossfit',
  'hiking',
  'other',
] as const
export const EXPERIENCE = ['beginner', 'intermediate', 'advanced', 'athlete'] as const
export const EQUIPMENT = [
  'none',
  'dumbbells',
  'barbell',
  'kettlebell',
  'bands',
  'pullup_bar',
  'machines',
  'full_gym',
  'cardio',
] as const
export const DIETS = ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'other'] as const
export const ALLERGIES = [
  'gluten',
  'lactose',
  'milk',
  'eggs',
  'nuts',
  'peanuts',
  'soy',
  'fish',
  'shellfish',
  'sesame',
] as const
export const BUDGETS = ['low', 'medium', 'high'] as const
export const PAIN_AREAS = [
  'neck',
  'shoulder',
  'upper_back',
  'lower_back',
  'hip',
  'knee',
  'ankle',
  'wrist_elbow',
  'none',
] as const
export const WORK = ['desk', 'standing', 'physical', 'shift'] as const

/** Bump when consent texts change; stored with every consent record. */
export const CONSENT_VERSION = '2026-11-16'
