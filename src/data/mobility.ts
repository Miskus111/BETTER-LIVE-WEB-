import type { Region } from '@/lib/pain/red-flags'

type B = { cs: string; en: string }
export interface MobilityExercise {
  slug: string
  name: B
  areas: (Region | 'full_body')[]
  kind: 'stretch' | 'mobility' | 'activation' | 'strength'
  how: B
  seconds?: number
  reps?: number
  /** placeholder until licensed videos exist */
  video: null
}

const M = (
  slug: string,
  cs: string,
  en: string,
  areas: MobilityExercise['areas'],
  kind: MobilityExercise['kind'],
  howCs: string,
  howEn: string,
  dose: { seconds?: number; reps?: number },
): MobilityExercise => ({
  slug,
  name: { cs, en },
  areas,
  kind,
  how: { cs: howCs, en: howEn },
  ...dose,
  video: null,
})

export const MOBILITY: MobilityExercise[] = [
  M(
    'chin-tuck',
    'Zasunutí brady',
    'Chin tuck',
    ['neck'],
    'activation',
    'Vsedě rovně, zasuňte bradu dozadu („dvojitá brada“) a 3 s vydržte.',
    'Sit tall, glide the chin straight back (“double chin”), hold 3 s.',
    { reps: 10 },
  ),
  M(
    'neck-rotation',
    'Rotace hlavy',
    'Neck rotation',
    ['neck'],
    'mobility',
    'Pomalu otáčejte hlavu do stran v rozsahu bez bolesti.',
    'Slowly turn the head side to side within a pain-free range.',
    { reps: 10 },
  ),
  M(
    'upper-trap-stretch',
    'Protažení horního trapézu',
    'Upper trap stretch',
    ['neck', 'shoulder'],
    'stretch',
    'Ucho k rameni, druhou rukou jemně přitáhněte, rameno dolů.',
    'Ear toward shoulder, gentle pull with the other hand, opposite shoulder down.',
    { seconds: 30 },
  ),
  M(
    'wall-slide',
    'Klouzání po zdi',
    'Wall slide',
    ['shoulder', 'upper_back'],
    'mobility',
    'Záda a předloktí na zdi, posouvejte ruce nahoru a dolů.',
    'Back and forearms on the wall, slide the arms up and down.',
    { reps: 10 },
  ),
  M(
    'pendulum',
    'Kyvadlo',
    'Pendulum swing',
    ['shoulder'],
    'mobility',
    'V předklonu nechte paži volně viset a kružte jí malými kruhy.',
    'Lean forward, let the arm hang and swing in small circles.',
    { seconds: 45 },
  ),
  M(
    'sleeper-stretch',
    'Spací protažení ramene',
    'Sleeper stretch',
    ['shoulder'],
    'stretch',
    'Na boku, loket 90°, druhou rukou jemně tlačte předloktí k zemi.',
    'Side-lying, elbow at 90°, gently press the forearm down with the other hand.',
    { seconds: 30 },
  ),
  M(
    'band-external-rotation',
    'Zevní rotace s gumou',
    'Band external rotation',
    ['shoulder'],
    'strength',
    'Loket u těla, předloktí otáčejte ven proti gumě.',
    'Elbow at your side, rotate the forearm out against the band.',
    { reps: 12 },
  ),
  M(
    'thoracic-rotation',
    'Rotace hrudní páteře vleže',
    'Open book',
    ['upper_back'],
    'mobility',
    'Na boku s pokrčenými koleny otevírejte horní ruku za sebe.',
    'Side-lying with knees bent, open the top arm behind you.',
    { reps: 8 },
  ),
  M(
    'cat-cow',
    'Kočka–kráva',
    'Cat–cow',
    ['upper_back', 'lower_back'],
    'mobility',
    'Na čtyřech střídavě vyhrbte a prohněte záda s dechem.',
    'On all fours, alternate rounding and arching with the breath.',
    { reps: 10 },
  ),
  M(
    'thoracic-extension',
    'Extenze hrudní páteře na válci',
    'Foam roller thoracic extension',
    ['upper_back'],
    'mobility',
    'Válec pod lopatkami, ruce za hlavou, zakloňte se přes válec.',
    'Roller under the shoulder blades, hands behind head, extend over it.',
    { reps: 8 },
  ),
  M(
    'childs-pose',
    'Pozice dítěte',
    'Child’s pose',
    ['lower_back', 'hip'],
    'stretch',
    'Klekněte si, pánev k patám, ruce vpřed, dýchejte do zad.',
    'Kneel, hips to heels, reach forward, breathe into the back.',
    { seconds: 45 },
  ),
  M(
    'knee-to-chest',
    'Koleno k hrudníku',
    'Knee to chest',
    ['lower_back', 'hip'],
    'stretch',
    'Vleže přitáhněte jedno koleno k hrudníku.',
    'Lying down, pull one knee to the chest.',
    { seconds: 30 },
  ),
  M(
    'pelvic-tilt',
    'Podsazování pánve',
    'Pelvic tilt',
    ['lower_back'],
    'activation',
    'Vleže na zádech jemně přitlačte bedra k zemi a uvolněte.',
    'On your back, gently flatten the lower back and release.',
    { reps: 12 },
  ),
  M(
    'bird-dog-mob',
    'Bird dog',
    'Bird dog',
    ['lower_back'],
    'strength',
    'Na čtyřech natáhněte protilehlou ruku a nohu, pánev rovně.',
    'On all fours, extend opposite arm and leg, hips level.',
    { reps: 8 },
  ),
  M(
    'glute-bridge-mob',
    'Hýžďový most',
    'Glute bridge',
    ['lower_back', 'hip', 'knee'],
    'strength',
    'Paty u hýždí, zvedněte pánev, stiskněte hýždě.',
    'Heels near the glutes, lift the hips, squeeze.',
    { reps: 12 },
  ),
  M(
    'mckenzie-press-up',
    'Extenze vleže (McKenzie)',
    'Prone press-up',
    ['lower_back'],
    'mobility',
    'Na břiše, ruce pod rameny, zvedejte hrudník, pánev zůstává dole.',
    'Prone, hands under shoulders, press the chest up, hips stay down.',
    { reps: 10 },
  ),
  M(
    'hip-flexor-stretch',
    'Protažení flexorů kyčle',
    'Half-kneeling hip flexor stretch',
    ['hip', 'lower_back'],
    'stretch',
    'V kleku na jednom koleni podsaďte pánev a posuňte boky vpřed.',
    'Half-kneeling, tuck the pelvis and shift the hips forward.',
    { seconds: 30 },
  ),
  M(
    '90-90',
    'Rotace kyčlí 90/90',
    '90/90 hip switch',
    ['hip'],
    'mobility',
    'Vsedě obě kolena 90°, přepínejte kolena ze strany na stranu.',
    'Sit with both knees at 90°, switch the knees side to side.',
    { reps: 10 },
  ),
  M(
    'pigeon',
    'Holub',
    'Pigeon stretch',
    ['hip'],
    'stretch',
    'Přední bérec napříč, zadní noha natažená, trup vpřed.',
    'Front shin across, back leg long, lean forward.',
    { seconds: 45 },
  ),
  M(
    'clamshell',
    'Mušle',
    'Clamshell',
    ['hip', 'knee'],
    'strength',
    'Na boku s pokrčenými koleny zvedejte horní koleno.',
    'Side-lying, knees bent, lift the top knee.',
    { reps: 15 },
  ),
  M(
    'hamstring-floss',
    'Mobilizace hamstringů',
    'Hamstring floss',
    ['knee', 'hip'],
    'mobility',
    'Vleže držte koleno nad kyčlí, střídavě natahujte a pokrčujte.',
    'On your back, knee over hip, straighten and bend it.',
    { reps: 10 },
  ),
  M(
    'quad-stretch',
    'Protažení kvadricepsu',
    'Standing quad stretch',
    ['knee', 'hip'],
    'stretch',
    'Pata k hýždi, kolena u sebe, pánev podsazená.',
    'Heel to glute, knees together, pelvis tucked.',
    { seconds: 30 },
  ),
  M(
    'spanish-squat',
    'Španělský dřep s gumou',
    'Spanish squat',
    ['knee'],
    'strength',
    'Guma za koleny, dřep se svislými holeněmi — šetrné ke šlaše.',
    'Band behind the knees, squat with vertical shins — tendon-friendly.',
    { seconds: 45 },
  ),
  M(
    'wall-sit',
    'Sed u zdi',
    'Wall sit',
    ['knee'],
    'strength',
    'Záda u zdi, kolena v úhlu, který nebolí.',
    'Back on the wall, knee angle that doesn’t hurt.',
    { seconds: 30 },
  ),
  M(
    'step-down',
    'Sestup ze schodu',
    'Step-down',
    ['knee'],
    'strength',
    'Pomalu spouštějte patu volné nohy k zemi, koleno nad špičkou.',
    'Slowly lower the free heel, knee tracks over the toes.',
    { reps: 10 },
  ),
  M(
    'ankle-circles',
    'Kroužení kotníky',
    'Ankle circles',
    ['ankle'],
    'mobility',
    'Kruhy na obě strany v plném rozsahu.',
    'Full circles in both directions.',
    { reps: 10 },
  ),
  M(
    'knee-to-wall',
    'Koleno ke zdi',
    'Knee-to-wall ankle mobility',
    ['ankle', 'knee'],
    'mobility',
    'Pata na zemi, posouvejte koleno ke zdi.',
    'Heel down, drive the knee toward the wall.',
    { reps: 10 },
  ),
  M(
    'calf-stretch',
    'Protažení lýtka',
    'Calf stretch',
    ['ankle'],
    'stretch',
    'Zadní noha natažená, pata na zemi, předklon ke zdi.',
    'Back leg straight, heel down, lean into the wall.',
    { seconds: 30 },
  ),
  M(
    'single-leg-balance',
    'Stoj na jedné noze',
    'Single-leg balance',
    ['ankle', 'knee'],
    'activation',
    'Stůjte na jedné noze, pro ztížení zavřete oči.',
    'Stand on one leg; close your eyes to progress.',
    { seconds: 30 },
  ),
  M(
    'wrist-circles',
    'Kroužení zápěstím',
    'Wrist circles',
    ['wrist_elbow'],
    'mobility',
    'Prsty propletené, kruhy oběma směry.',
    'Fingers interlaced, circles both ways.',
    { reps: 10 },
  ),
  M(
    'wrist-flexor-stretch',
    'Protažení flexorů předloktí',
    'Wrist flexor stretch',
    ['wrist_elbow'],
    'stretch',
    'Paže natažená, dlaň nahoru, druhou rukou přitáhněte prsty.',
    'Arm straight, palm up, gently pull the fingers back.',
    { seconds: 30 },
  ),
  M(
    'eccentric-wrist-extension',
    'Excentrická extenze zápěstí',
    'Eccentric wrist extension',
    ['wrist_elbow'],
    'strength',
    'Lehká jednoručka, pomalu spouštějte hřbet ruky (tenisový loket).',
    'Light dumbbell, slowly lower the back of the hand (tennis elbow).',
    { reps: 15 },
  ),
  M(
    'world-greatest-stretch',
    'Nejlepší protažení světa',
    'World’s greatest stretch',
    ['full_body', 'hip', 'upper_back'],
    'mobility',
    'Výpad, loket k chodidlu, rotace s rukou ke stropu.',
    'Lunge, elbow to instep, rotate the arm to the ceiling.',
    { reps: 5 },
  ),
  M(
    'leg-swings',
    'Švihy nohou',
    'Leg swings',
    ['hip'],
    'mobility',
    'Švihy vpřed–vzad a do stran, uvolněně.',
    'Swing forward–back and side to side, relaxed.',
    { reps: 12 },
  ),
  M(
    'arm-circles',
    'Kroužení pažemi',
    'Arm circles',
    ['shoulder'],
    'mobility',
    'Od malých po velké kruhy oběma směry.',
    'Small to large circles both ways.',
    { reps: 12 },
  ),
  M(
    'inchworm',
    'Píďalka',
    'Inchworm',
    ['full_body'],
    'mobility',
    'Z předklonu ručkuj do kliku a zpět.',
    'From a forward fold, walk the hands to a plank and back.',
    { reps: 6 },
  ),
  M(
    'box-breathing',
    'Dýchání do čtverce',
    'Box breathing',
    ['full_body'],
    'activation',
    'Nádech na 4 s, dech zadržte na 4 s, výdech na 4 s a znovu zadržte na 4 s.',
    'Inhale 4 s, hold 4 s, exhale 4 s, hold 4 s.',
    { seconds: 120 },
  ),
]

export const MOBILITY_BY_SLUG = Object.fromEntries(MOBILITY.map((m) => [m.slug, m])) as Record<
  string,
  MobilityExercise
>

export interface Routine {
  id: string
  name: B
  minutes: number
  items: string[]
}

export const ROUTINES: Routine[] = [
  {
    id: 'daily-10',
    name: { cs: 'Denních 10 minut', en: 'Daily 10 minutes' },
    minutes: 10,
    items: [
      'cat-cow',
      'world-greatest-stretch',
      '90-90',
      'thoracic-rotation',
      'hip-flexor-stretch',
      'glute-bridge-mob',
      'box-breathing',
    ],
  },
  {
    id: 'desk',
    name: { cs: 'Pro práci u stolu', en: 'Desk worker' },
    minutes: 8,
    items: [
      'chin-tuck',
      'upper-trap-stretch',
      'wall-slide',
      'thoracic-rotation',
      'hip-flexor-stretch',
      'wrist-flexor-stretch',
    ],
  },
  {
    id: 'pre-workout',
    name: { cs: 'Před tréninkem (dynamické)', en: 'Pre-workout (dynamic)' },
    minutes: 8,
    items: [
      'arm-circles',
      'leg-swings',
      'inchworm',
      'world-greatest-stretch',
      'glute-bridge-mob',
      'knee-to-wall',
    ],
  },
  {
    id: 'post-workout',
    name: { cs: 'Po tréninku', en: 'Post-workout' },
    minutes: 8,
    items: ['childs-pose', 'pigeon', 'quad-stretch', 'calf-stretch', 'box-breathing'],
  },
  {
    id: 'runners',
    name: { cs: 'Pro běžce', en: 'For runners' },
    minutes: 10,
    items: [
      'leg-swings',
      'knee-to-wall',
      'hip-flexor-stretch',
      'clamshell',
      'single-leg-balance',
      'calf-stretch',
    ],
  },
  {
    id: 'lifters',
    name: { cs: 'Pro posilovnu', en: 'For lifters' },
    minutes: 10,
    items: ['thoracic-extension', 'wall-slide', '90-90', 'knee-to-wall', 'pigeon', 'band-external-rotation'],
  },
  {
    id: 'fighters',
    name: { cs: 'Pro bojovníky', en: 'For fighters' },
    minutes: 10,
    items: ['neck-rotation', 'chin-tuck', 'thoracic-rotation', '90-90', 'leg-swings', 'wrist-circles'],
  },
  {
    id: 'morning',
    name: { cs: 'Ranní', en: 'Morning' },
    minutes: 6,
    items: ['cat-cow', 'pelvic-tilt', 'thoracic-rotation', 'arm-circles'],
  },
  {
    id: 'evening',
    name: { cs: 'Večerní (uvolnění)', en: 'Evening (wind-down)' },
    minutes: 8,
    items: ['childs-pose', 'knee-to-chest', 'pigeon', 'box-breathing'],
  },
]

/** Education per region: common contributing factors (never a diagnosis). */
export const EDUCATION: Record<Region, { factors: B[]; seeA: B }> = {
  neck: {
    factors: [
      {
        cs: 'Dlouhé statické polohy (telefon, monitor) — problém je spíš nehybnost než „špatné držení“.',
        en: 'Long static positions (phone, monitor) — lack of movement matters more than “bad posture”.',
      },
      {
        cs: 'Stres a málo spánku zvyšují svalové napětí a citlivost na bolest.',
        en: 'Stress and poor sleep increase muscle tension and pain sensitivity.',
      },
    ],
    seeA: {
      cs: 'Fyzioterapeuta, pokud bolest trvá déle než 4–6 týdnů nebo vystřeluje do paže.',
      en: 'A physiotherapist if pain lasts over 4–6 weeks or radiates into the arm.',
    },
  },
  shoulder: {
    factors: [
      {
        cs: 'Náhlé zvýšení tréninkové zátěže (víc tlaků nad hlavu, nový sport).',
        en: 'Sudden jumps in training load (more overhead pressing, a new sport).',
      },
      {
        cs: 'Slabší svaly rotátorové manžety a lopatky; postupné posilování obvykle pomáhá.',
        en: 'Weaker rotator cuff and shoulder-blade muscles; gradual strengthening usually helps.',
      },
    ],
    seeA: {
      cs: 'Lékaře při ztrátě síly zvednout paži nebo po úrazu.',
      en: 'A doctor if you can’t lift the arm or after an injury.',
    },
  },
  upper_back: {
    factors: [
      {
        cs: 'Sezení bez přestávek; hrudní páteř miluje pohyb a rotaci.',
        en: 'Long sitting without breaks; the upper back loves movement and rotation.',
      },
      { cs: 'Stres a mělké dýchání.', en: 'Stress and shallow breathing.' },
    ],
    seeA: {
      cs: 'Lékaře, pokud bolest souvisí s dýcháním nebo námahou.',
      en: 'A doctor if the pain is linked to breathing or exertion.',
    },
  },
  lower_back: {
    factors: [
      {
        cs: 'Většina bolestí beder je nespecifická a do 6 týdnů se výrazně zlepší; klid na lůžku nepomáhá, pohyb ano.',
        en: 'Most low-back pain is non-specific and improves a lot within 6 weeks; bed rest doesn’t help, movement does.',
      },
      {
        cs: 'Nálezy na snímcích (výhřezy, opotřebení) jsou časté i u lidí bez bolesti.',
        en: 'Scan findings (bulges, wear) are common in people without any pain.',
      },
      {
        cs: 'Spánek, stres, obavy z pohybu a náhlé změny zátěže bolest zesilují (senzitizace).',
        en: 'Sleep, stress, fear of movement and sudden load changes amplify pain (sensitisation).',
      },
    ],
    seeA: {
      cs: 'Fyzioterapeuta, pokud se do 4–6 týdnů nelepší nebo bolest vystřeluje pod koleno.',
      en: 'A physiotherapist if no better in 4–6 weeks or pain shoots below the knee.',
    },
  },
  hip: {
    factors: [
      { cs: 'Dlouhé sezení a slabší hýžďové svaly.', en: 'Long sitting and weaker glutes.' },
      { cs: 'U běžců rychlé navýšení kilometrů.', en: 'In runners, rapid mileage increases.' },
    ],
    seeA: {
      cs: 'Lékaře při bolesti v třísle s kulháním nebo po pádu.',
      en: 'A doctor for groin pain with limping or after a fall.',
    },
  },
  knee: {
    factors: [
      {
        cs: 'Přetížení (víc běhu, skoků, dřepů najednou) — koleno potřebuje postupné zatěžování, ne klid.',
        en: 'Overload (more running, jumping, squats at once) — the knee needs graded loading, not rest.',
      },
      { cs: 'Slabší kvadricepsy a hýždě.', en: 'Weaker quads and glutes.' },
    ],
    seeA: {
      cs: 'Lékaře při otoku hned po úrazu, „zamykání“ nebo podlamování kolene.',
      en: 'A doctor for swelling right after injury, locking or giving way.',
    },
  },
  ankle: {
    factors: [
      {
        cs: 'Předchozí podvrtnutí bez rehabilitace rovnováhy.',
        en: 'Previous sprains without balance rehab.',
      },
      {
        cs: 'Rychlý nárůst běhu nebo skoků; Achillova šlacha reaguje na změny zátěže.',
        en: 'Rapid increases in running or jumping; the Achilles reacts to load changes.',
      },
    ],
    seeA: {
      cs: 'Lékaře, pokud nemůžete udělat 4 kroky nebo je kotník deformovaný.',
      en: 'A doctor if you can’t take 4 steps or the ankle looks deformed.',
    },
  },
  wrist_elbow: {
    factors: [
      {
        cs: 'Opakované úchopy (myš, nářadí, tahy) — šlachy se přizpůsobí postupné zátěži.',
        en: 'Repeated gripping (mouse, tools, pulling) — tendons adapt to gradual loading.',
      },
      { cs: 'Náhlé zvýšení objemu tahů nebo lezení.', en: 'Sudden increases in pulling or climbing volume.' },
    ],
    seeA: {
      cs: 'Lékaře při mravenčení prstů v noci nebo po pádu na ruku.',
      en: 'A doctor for finger tingling at night or after a fall on the hand.',
    },
  },
}

/** Progressive plan per region: 3 stages, advance with the traffic-light rule (see lib/pain). */
export const REGION_PLAN: Record<Region, string[][]> = {
  neck: [
    ['chin-tuck', 'neck-rotation', 'box-breathing'],
    ['chin-tuck', 'upper-trap-stretch', 'wall-slide'],
    ['wall-slide', 'band-external-rotation', 'thoracic-extension'],
  ],
  shoulder: [
    ['pendulum', 'arm-circles', 'wall-slide'],
    ['wall-slide', 'sleeper-stretch', 'band-external-rotation'],
    ['band-external-rotation', 'thoracic-extension', 'wall-slide'],
  ],
  upper_back: [
    ['cat-cow', 'thoracic-rotation', 'box-breathing'],
    ['thoracic-extension', 'wall-slide', 'thoracic-rotation'],
    ['thoracic-extension', 'band-external-rotation', 'world-greatest-stretch'],
  ],
  lower_back: [
    ['pelvic-tilt', 'knee-to-chest', 'childs-pose'],
    ['cat-cow', 'bird-dog-mob', 'glute-bridge-mob', 'mckenzie-press-up'],
    ['bird-dog-mob', 'glute-bridge-mob', 'hip-flexor-stretch', 'world-greatest-stretch'],
  ],
  hip: [
    ['knee-to-chest', '90-90', 'clamshell'],
    ['hip-flexor-stretch', 'glute-bridge-mob', 'clamshell'],
    ['pigeon', 'glute-bridge-mob', 'world-greatest-stretch'],
  ],
  knee: [
    ['hamstring-floss', 'quad-stretch', 'single-leg-balance'],
    ['wall-sit', 'glute-bridge-mob', 'clamshell'],
    ['spanish-squat', 'step-down', 'single-leg-balance'],
  ],
  ankle: [
    ['ankle-circles', 'calf-stretch', 'single-leg-balance'],
    ['knee-to-wall', 'single-leg-balance', 'calf-stretch'],
    ['knee-to-wall', 'single-leg-balance', 'step-down'],
  ],
  wrist_elbow: [
    ['wrist-circles', 'wrist-flexor-stretch'],
    ['wrist-flexor-stretch', 'eccentric-wrist-extension'],
    ['eccentric-wrist-extension', 'band-external-rotation'],
  ],
}
