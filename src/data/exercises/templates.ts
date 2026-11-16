/** Starter routines (any user can start one; the coach creates personalised ones in phase 7). */
export interface Template {
  id: string
  name: { cs: string; en: string }
  description: { cs: string; en: string }
  exercises: string[]
}

export const TEMPLATES: Template[] = [
  {
    id: 'full-body-a',
    name: { cs: 'Celé tělo A', en: 'Full body A' },
    description: {
      cs: 'Dřep, tlak, přítah, hinge, core — 3× týdně',
      en: 'Squat, press, row, hinge, core — 3× a week',
    },
    exercises: ['back-squat', 'barbell-bench-press', 'barbell-row', 'romanian-deadlift', 'plank'],
  },
  {
    id: 'full-body-b',
    name: { cs: 'Celé tělo B', en: 'Full body B' },
    description: {
      cs: 'Mrtvý tah, tlak nad hlavu, shyby, výpady',
      en: 'Deadlift, overhead press, pull-ups, lunges',
    },
    exercises: ['deadlift', 'overhead-press', 'pull-up', 'walking-lunge', 'hanging-knee-raise'],
  },
  {
    id: 'upper',
    name: { cs: 'Horní polovina', en: 'Upper' },
    description: { cs: 'Hrudník, záda, ramena, paže', en: 'Chest, back, shoulders, arms' },
    exercises: [
      'incline-dumbbell-press',
      'lat-pulldown',
      'dumbbell-shoulder-press',
      'seated-cable-row',
      'lateral-raise',
      'triceps-pushdown',
      'dumbbell-curl',
    ],
  },
  {
    id: 'lower',
    name: { cs: 'Dolní polovina', en: 'Lower' },
    description: { cs: 'Nohy, hýždě, lýtka, core', en: 'Legs, glutes, calves, core' },
    exercises: [
      'back-squat',
      'romanian-deadlift',
      'bulgarian-split-squat',
      'lying-leg-curl',
      'standing-calf-raise',
      'pallof-press',
    ],
  },
  {
    id: 'runner-strength',
    name: { cs: 'Síla pro běžce', en: 'Strength for runners' },
    description: {
      cs: 'Jednonožní síla, lýtka, hamstringy, core',
      en: 'Single-leg strength, calves, hamstrings, core',
    },
    exercises: [
      'bulgarian-split-squat',
      'single-leg-rdl',
      'single-leg-calf-raise',
      'nordic-curl',
      'copenhagen-plank',
      'pogo-hops',
    ],
  },
  {
    id: 'fighter-conditioning',
    name: { cs: 'Kondice pro bojovníky', en: 'Fighter conditioning' },
    description: { cs: 'Výbušnost, rotace, krk, kondice', en: 'Power, rotation, neck, conditioning' },
    exercises: [
      'trap-bar-deadlift',
      'medicine-ball-rotational-throw',
      'push-press',
      'neck-isometrics',
      'sprawl',
      'heavy-bag-rounds',
    ],
  },
  {
    id: 'home-bodyweight',
    name: { cs: 'Doma bez vybavení', en: 'Home, no equipment' },
    description: { cs: 'Jen vlastní váha', en: 'Bodyweight only' },
    exercises: ['bodyweight-squat', 'push-up', 'inverted-row', 'reverse-lunge', 'glute-bridge', 'dead-bug'],
  },
]
