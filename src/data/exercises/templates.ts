/** Starter routines (any user can start one; the coach creates personalised ones in phase 7). */
export interface Template {
  id: string
  name: string
  description: string
  exercises: string[]
}

export const TEMPLATES: Template[] = [
  {
    id: 'full-body-a',
    name: 'Full body A',
    description: 'Dřep, tlak, přítah, hinge, core — 3× týdně / 3× a week',
    exercises: ['back-squat', 'barbell-bench-press', 'barbell-row', 'romanian-deadlift', 'plank'],
  },
  {
    id: 'full-body-b',
    name: 'Full body B',
    description: 'Mrtvý tah, tlak nad hlavu, shyby, výpady',
    exercises: ['deadlift', 'overhead-press', 'pull-up', 'walking-lunge', 'hanging-knee-raise'],
  },
  {
    id: 'upper',
    name: 'Upper',
    description: 'Horní polovina těla / upper body',
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
    name: 'Lower',
    description: 'Dolní polovina těla / lower body',
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
    name: 'Síla pro běžce · Strength for runners',
    description: 'Jednonožní síla, lýtka, hamstringy, core',
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
    name: 'Kondice pro bojovníky · Fighter conditioning',
    description: 'Výbušnost, rotace, krk, kondice',
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
    name: 'Doma bez vybavení · Home, no equipment',
    description: 'Jen vlastní váha / bodyweight only',
    exercises: ['bodyweight-squat', 'push-up', 'inverted-row', 'reverse-lunge', 'glute-bridge', 'dead-bug'],
  },
]
