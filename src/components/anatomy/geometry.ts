import type { ViewBox } from '@/data/types'

/**
 * Anatomical figure in body coordinates (400 × 920, midline x = 200, soles at y ≈ 920).
 *
 * Proportions follow adult anthropometry (≈ 7.6 head heights; landmarks as a share of stature
 * measured from the floor): chin 0.87, shoulder (acromion) 0.82, elbow 0.63, wrist 0.49,
 * crotch 0.47, fingertips 0.38, knee 0.28, ankle 0.04. Organ positions follow surface anatomy
 * in the anatomical position (front view, palms forward): the heart two-thirds left of the
 * midline, the liver under the right dome of the diaphragm, the stomach under the left, the right
 * kidney a little lower than the left. "Left/right" in comments is the PERSON's side; the
 * person's right is on the viewer's left (x < 200).
 */

type P = [number, number]

const r1 = (n: number) => Math.round(n * 10) / 10
const pt = ([x, y]: P) => `${r1(x)},${r1(y)}`
/** mirror across the midline (person's right ↔ left) */
const mx = ([x, y]: P): P => [400 - x, y]

/**
 * Smooth path through points (centripetal-ish Catmull–Rom → cubic Bézier).
 * `t` < 1 tightens the curve; values are rounded so server and client markup match.
 */
export function spline(points: P[], closed = true, t = 1): string {
  const n = points.length
  const get = (i: number): P => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))])
  let d = `M${pt(points[0])}`
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1)
    const p1 = get(i)
    const p2 = get(i + 1)
    const p3 = get(i + 2)
    const c1: P = [p1[0] + ((p2[0] - p0[0]) / 6) * t, p1[1] + ((p2[1] - p0[1]) / 6) * t]
    const c2: P = [p2[0] - ((p3[0] - p1[0]) / 6) * t, p2[1] - ((p3[1] - p1[1]) / 6) * t]
    d += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`
  }
  return closed ? d + ' Z' : d
}

/** closed shape from the person's-right half outline (top → bottom on the midline) */
const symmetric = (half: P[]) => spline([...half, ...half.slice(1, -1).reverse().map(mx)])
/** the same shape drawn on both sides */
export const both = (points: P[], closed = true, t = 1) => [
  spline(points, closed, t),
  spline(points.map(mx), closed, t),
]

// ── Silhouette ────────────────────────────────────────────────────────
const HALF_OUTLINE: P[] = [
  // head (crown → jaw), ear at eye level
  [200, 33],
  [184, 35],
  [170, 41],
  [160, 51],
  [154, 64],
  [151, 79],
  [151, 92],
  [149, 99],
  [149, 108],
  [153, 115],
  [157, 121],
  [162, 131],
  [169, 140],
  [176, 147],
  // neck
  [179, 157],
  [178, 169],
  // trapezius slope → shoulder (deltoid)
  [168, 180],
  [152, 187],
  [134, 192],
  [118, 197],
  [104, 204],
  [95, 215],
  [90, 230],
  [88, 248],
  // upper arm (outer)
  [87, 270],
  [86, 296],
  [85, 322],
  [84, 345],
  // elbow
  [82, 364],
  // forearm (outer, brachioradialis bulge)
  [79, 384],
  [75, 410],
  [72, 436],
  [70, 460],
  // wrist → hand (palm forward, thumb outside)
  [70, 478],
  [66, 492],
  [61, 510],
  [61, 530],
  [64, 552],
  [69, 568],
  [77, 578],
  [86, 577],
  [92, 566],
  [94, 546],
  [95, 526],
  [97, 506],
  [97, 488],
  // forearm (inner)
  [98, 466],
  [101, 440],
  [105, 412],
  [109, 388],
  // elbow (inner)
  [112, 368],
  // upper arm (inner) → armpit
  [115, 342],
  [118, 312],
  [121, 284],
  [125, 260],
  [131, 246],
  // torso side → waist → hip
  [136, 262],
  [138, 288],
  [139, 314],
  [140, 338],
  [141, 358],
  [140, 376],
  [136, 396],
  [130, 418],
  [124, 442],
  // thigh (outer) — bitrochanteric breadth ≈ 0.19 × stature
  [121, 468],
  [123, 496],
  [128, 528],
  [135, 562],
  [143, 598],
  [150, 632],
  // knee
  [154, 658],
  [155, 678],
  // calf (outer, gastrocnemius)
  [153, 700],
  [150, 726],
  [150, 756],
  [153, 790],
  [157, 824],
  [160, 852],
  // ankle → foot
  [162, 872],
  [161, 886],
  [156, 897],
  [148, 906],
  [145, 913],
  [150, 919],
  [166, 921],
  [182, 919],
  [190, 913],
  // ankle (inner)
  [191, 898],
  [190, 882],
  // calf (inner)
  [190, 860],
  [189, 832],
  [188, 802],
  [186, 770],
  [186, 738],
  // knee (inner)
  [188, 708],
  [190, 684],
  [191, 662],
  // thigh (inner) → crotch
  [192, 636],
  [193, 606],
  [194, 576],
  [196, 544],
  [198, 516],
  [200, 502],
]

export const BODY_PATH = symmetric(HALF_OUTLINE)

/** Key landmarks in body units (floor y = 920, crown y = 33) — checked against anthropometric ratios in tests. */
export const STATURE = { crown: 33, floor: 920 }
export const LANDMARKS = {
  chin: 150,
  shoulder: 196, // acromion
  elbow: 364,
  wrist: 478,
  hipJoint: 470, // centre of the femoral head
  knee: 668,
  ankle: 880,
}
export const HALF_OUTLINE_POINTS = HALF_OUTLINE
export const FULL: ViewBox = [0, 0, 400, 920]

// ── Skeleton ──────────────────────────────────────────────────────────
export const SKULL = {
  cranium: spline(
    [
      [164, 112],
      [158, 96],
      [157, 76],
      [162, 58],
      [173, 46],
      [186, 40],
      [200, 38],
      [214, 40],
      [227, 46],
      [238, 58],
      [243, 76],
      [242, 96],
      [236, 112],
    ],
    false,
  ),
  mandible: spline(
    [
      [164, 110],
      [165, 124],
      [170, 137],
      [180, 146],
      [192, 150],
      [200, 151],
      [208, 150],
      [220, 146],
      [230, 137],
      [235, 124],
      [236, 110],
    ],
    false,
  ),
  orbits: both([
    [173, 92],
    [180, 87],
    [189, 88],
    [194, 95],
    [191, 104],
    [182, 106],
    [174, 102],
  ]),
  nose: 'M200,103 C196,110 193,116 194,120 C197,122 203,122 206,120 C207,116 204,110 200,103 Z',
  cheek: both(
    [
      [166, 108],
      [175, 112],
      [186, 113],
    ],
    false,
  ),
  teeth: 'M184,128 C190,131 210,131 216,128 M184,133 C190,136 210,136 216,133',
}

/** cervical (7), thoracic (12) and lumbar (5) vertebral bodies: [y, half-width, height] */
export const VERTEBRAE: [number, number, number][] = [
  ...Array.from({ length: 7 }, (_, i): [number, number, number] => [152 + i * 6.4, 4.5 + i * 0.3, 4.6]),
  ...Array.from({ length: 12 }, (_, i): [number, number, number] => [199 + i * 10.6, 6 + i * 0.25, 8]),
  ...Array.from({ length: 5 }, (_, i): [number, number, number] => [328 + i * 15.6, 8 + i * 0.5, 12]),
]
export const SACRUM =
  'M187,410 C194,408 206,408 213,410 C212,428 208,446 202,462 L200,470 L198,462 C192,446 188,428 187,410 Z'

export const STERNUM = [
  // manubrium
  'M191,200 C196,197 204,197 209,200 L207,220 C203,222 197,222 193,220 Z',
  // body
  'M194,223 C198,222 202,222 206,223 L207,290 C205,296 195,296 193,290 Z',
  // xiphoid
  'M197,297 L203,297 L200,311 Z',
]

export const CLAVICLES = both(
  [
    [194, 199],
    [180, 196],
    [164, 199],
    [148, 196],
    [132, 193],
    [118, 198],
  ],
  false,
)

/** 12 rib pairs: the posterior arc (seen through) and the anterior arc with its costal cartilage */
const RIB_LATERAL = [158, 146, 139, 134, 131, 129, 128, 129, 131, 135, 142, 151]
export const RIBS = Array.from({ length: 12 }, (_, k) => {
  const i = k + 1
  const yv = 201 + k * 10.6 // vertebral (posterior) attachment
  const xl = RIB_LATERAL[k]
  const yl = yv + 12 + k * 1.6 // most lateral point
  const back = spline(
    [
      [196, yv],
      [176, yv - 3],
      [xl + 8, yv + 2],
      [xl, yl],
    ],
    false,
  )
  let front = ''
  let cartilage = ''
  if (i <= 7) {
    const ye = 206 + k * 13.6 // sternal attachment
    front = spline(
      [
        [xl, yl],
        [xl + 3, yl + 12],
        [xl + 18, ye + 6],
        [184, ye + 2],
      ],
      false,
    )
    cartilage = `M184,${r1(ye + 2)} C188,${r1(ye + 1)} 191,${r1(ye)} 194,${r1(ye - 1)}`
  } else if (i <= 10) {
    const ex = 168 - (i - 8) * 9
    const ey = 308 + (i - 8) * 13
    front = spline(
      [
        [xl, yl],
        [xl + 2, yl + 14],
        [ex - 6, ey + 4],
        [ex, ey],
      ],
      false,
    )
  } else {
    front = spline(
      [
        [xl, yl],
        [xl + 3, yl + 10],
        [xl + 10, yl + 18],
      ],
      false,
    )
  }
  return { back, front, cartilage }
})
/** costal margin: xiphoid → 10th rib */
export const COSTAL_MARGIN = both(
  [
    [197, 300],
    [184, 304],
    [168, 309],
    [159, 321],
    [150, 335],
  ],
  false,
)

export const PELVIS = {
  ilium: both([
    [188, 414],
    [176, 405],
    [160, 403],
    [142, 407],
    [133, 419],
    [134, 434],
    [146, 446],
    [152, 456],
    [158, 464],
    [168, 468],
    [178, 462],
    [185, 446],
    [188, 428],
  ]),
  pubis: both([
    [158, 476],
    [166, 486],
    [178, 490],
    [190, 488],
    [197, 486],
    [197, 498],
    [188, 502],
    [176, 506],
    [168, 510],
    [161, 500],
  ]),
  obturator: both([
    [170, 488],
    [178, 492],
    [184, 496],
    [178, 502],
    [170, 498],
  ]),
  acetabulum: both([
    [156, 466],
    [163, 461],
    [171, 465],
    [172, 474],
    [165, 479],
    [157, 475],
  ]),
}

export const LIMB_BONES = [
  // humerus: head, shafts, distal end
  ...both([
    [116, 201],
    [124, 204],
    [126, 214],
    [119, 220],
    [110, 218],
    [107, 209],
  ]),
  ...both(
    [
      [110, 220],
      [105, 260],
      [101, 302],
      [96, 344],
    ],
    false,
  ),
  ...both(
    [
      [122, 220],
      [118, 262],
      [114, 304],
      [110, 346],
    ],
    false,
  ),
  ...both(
    [
      [92, 352],
      [96, 362],
      [104, 366],
      [112, 362],
      [114, 352],
    ],
    false,
  ),
  // radius (lateral) and ulna (medial)
  ...both(
    [
      [94, 370],
      [88, 400],
      [82, 436],
      [78, 474],
    ],
    false,
  ),
  ...both(
    [
      [108, 368],
      [104, 402],
      [98, 438],
      [92, 476],
    ],
    false,
  ),
  // carpus
  ...both([
    [76, 480],
    [86, 478],
    [96, 482],
    [94, 492],
    [84, 494],
    [76, 490],
  ]),
  // metacarpals and fingers
  ...both(
    [
      [77, 494],
      [72, 512],
      [69, 532],
      [68, 552],
    ],
    false,
  ),
  ...both(
    [
      [82, 495],
      [79, 514],
      [77, 536],
      [76, 566],
    ],
    false,
  ),
  ...both(
    [
      [87, 495],
      [86, 516],
      [86, 538],
      [86, 568],
    ],
    false,
  ),
  ...both(
    [
      [92, 494],
      [93, 514],
      [94, 534],
      [94, 556],
    ],
    false,
  ),
  // thumb (lateral in the anatomical position)
  ...both(
    [
      [75, 486],
      [68, 498],
      [64, 512],
      [63, 526],
    ],
    false,
  ),
  // femur: head, neck/greater trochanter, shaft edges, condyles
  ...both([
    [158, 464],
    [165, 460],
    [172, 465],
    [171, 474],
    [163, 477],
  ]),
  ...both(
    [
      [160, 470],
      [150, 470],
      [141, 476],
      [140, 488],
      [146, 494],
    ],
    false,
  ),
  ...both(
    [
      [146, 494],
      [151, 548],
      [156, 604],
      [158, 648],
    ],
    false,
  ),
  ...both(
    [
      [168, 478],
      [170, 500],
      [169, 528],
      [171, 588],
      [176, 632],
      [182, 650],
    ],
    false,
  ),
  ...both(
    [
      [156, 650],
      [157, 664],
      [166, 669],
      [171, 664],
      [178, 669],
      [186, 664],
      [184, 650],
    ],
    false,
  ),
  // tibia, fibula, malleoli
  ...both(
    [
      [157, 678],
      [168, 676],
      [178, 676],
      [187, 678],
    ],
    false,
  ),
  ...both(
    [
      [161, 682],
      [164, 740],
      [166, 800],
      [168, 862],
    ],
    false,
  ),
  ...both(
    [
      [184, 682],
      [181, 740],
      [180, 800],
      [182, 864],
      [184, 876],
      [178, 884],
    ],
    false,
  ),
  ...both(
    [
      [152, 684],
      [154, 740],
      [157, 806],
      [160, 878],
    ],
    false,
  ),
  // foot: tarsus and metatarsals/toes
  ...both([
    [160, 886],
    [172, 884],
    [184, 888],
    [182, 897],
    [168, 899],
    [158, 895],
  ]),
  ...both(
    [
      [160, 899],
      [153, 908],
      [150, 916],
    ],
    false,
  ),
  ...both(
    [
      [166, 900],
      [162, 909],
      [160, 917],
    ],
    false,
  ),
  ...both(
    [
      [172, 900],
      [170, 909],
      [170, 918],
    ],
    false,
  ),
  ...both(
    [
      [178, 900],
      [178, 909],
      [180, 917],
    ],
    false,
  ),
  ...both(
    [
      [184, 898],
      [186, 907],
      [188, 914],
    ],
    false,
  ),
]
/** shoulder blades: lie on the back of ribs 2–7, so they show through the rib cage */
export const SCAPULAE = both([
  [124, 206],
  [140, 203],
  [166, 206],
  [170, 214],
  [160, 250],
  [150, 284],
  [142, 280],
  [132, 250],
  [126, 224],
])
export const PATELLAE = both([
  [166, 654],
  [172, 652],
  [177, 657],
  [176, 668],
  [171, 674],
  [165, 667],
])

// ── Superficial muscles ───────────────────────────────────────────────
export const MUSCLES = [
  // sternocleidomastoid
  ...both([
    [171, 124],
    [176, 124],
    [186, 160],
    [196, 196],
    [190, 198],
    [180, 166],
  ]),
  // trapezius (upper fibres)
  ...both([
    [179, 156],
    [180, 172],
    [166, 184],
    [146, 190],
    [124, 196],
    [140, 186],
    [160, 176],
  ]),
  // deltoid
  ...both([
    [124, 198],
    [108, 202],
    [96, 214],
    [90, 232],
    [90, 256],
    [95, 278],
    [102, 288],
    [108, 270],
    [114, 244],
    [122, 218],
  ]),
  // pectoralis major
  ...both([
    [197, 206],
    [176, 201],
    [152, 203],
    [130, 212],
    [121, 228],
    [128, 246],
    [146, 258],
    [168, 266],
    [188, 268],
    [197, 262],
  ]),
  // biceps brachii
  ...both([
    [112, 258],
    [105, 284],
    [102, 314],
    [103, 342],
    [108, 358],
    [114, 342],
    [117, 312],
    [118, 280],
  ]),
  // forearm flexors / brachioradialis
  ...both([
    [88, 370],
    [80, 396],
    [76, 426],
    [78, 456],
    [87, 468],
    [97, 448],
    [103, 416],
    [107, 386],
    [100, 370],
  ]),
  // serratus anterior (three digitations)
  ...both([
    [138, 266],
    [148, 262],
    [146, 274],
  ]),
  ...both([
    [139, 284],
    [150, 279],
    [148, 292],
  ]),
  ...both([
    [140, 302],
    [151, 297],
    [149, 310],
  ]),
  // rectus abdominis: four segments separated by tendinous intersections
  ...both([
    [197, 274],
    [186, 272],
    [180, 280],
    [181, 304],
    [197, 306],
  ]),
  ...both([
    [197, 311],
    [181, 310],
    [182, 340],
    [197, 342],
  ]),
  ...both([
    [197, 347],
    [182, 346],
    [183, 378],
    [197, 380],
  ]),
  ...both([
    [197, 385],
    [183, 384],
    [186, 430],
    [192, 466],
    [197, 486],
  ]),
  // external oblique
  ...both([
    [177, 280],
    [160, 272],
    [146, 286],
    [141, 318],
    [141, 352],
    [143, 386],
    [152, 412],
    [168, 432],
    [180, 436],
    [180, 400],
    [178, 344],
  ]),
  // tensor fasciae latae + vastus lateralis
  ...both([
    [137, 446],
    [133, 478],
    [134, 520],
    [140, 574],
    [149, 626],
    [158, 648],
    [160, 612],
    [155, 556],
    [149, 500],
    [146, 458],
  ]),
  // rectus femoris
  ...both([
    [152, 470],
    [150, 512],
    [154, 566],
    [161, 616],
    [168, 646],
    [175, 636],
    [176, 588],
    [172, 530],
    [164, 484],
  ]),
  // vastus medialis (teardrop)
  ...both([
    [180, 588],
    [175, 616],
    [176, 648],
    [186, 660],
    [190, 640],
    [189, 608],
  ]),
  // sartorius (hip → inner knee)
  ...both([
    [146, 452],
    [153, 452],
    [174, 540],
    [190, 640],
    [190, 676],
    [184, 672],
    [180, 630],
    [166, 548],
  ]),
  // adductors
  ...both([
    [183, 494],
    [176, 520],
    [175, 560],
    [182, 588],
    [190, 570],
    [195, 530],
    [196, 504],
  ]),
  // tibialis anterior
  ...both([
    [160, 688],
    [157, 724],
    [160, 790],
    [168, 858],
    [173, 856],
    [170, 790],
    [168, 724],
    [167, 692],
  ]),
  // gastrocnemius (medial and lateral heads, visible at the edges)
  ...both([
    [185, 690],
    [189, 718],
    [188, 762],
    [182, 790],
    [179, 748],
    [180, 712],
  ]),
  ...both([
    [154, 694],
    [151, 722],
    [151, 760],
    [156, 770],
    [158, 736],
    [158, 704],
  ]),
]

// ── Organs ────────────────────────────────────────────────────────────
const LUNG_R: P[] = [
  [182, 186],
  [172, 191],
  [158, 205],
  [147, 226],
  [139, 254],
  [135, 284],
  [133, 312],
  [135, 334],
  [148, 329],
  [164, 320],
  [180, 317],
  [191, 316],
  [193, 296],
  [192, 264],
  [194, 234],
  [192, 206],
  [188, 191],
]
const LUNG_L: P[] = [
  [218, 186],
  [228, 191],
  [242, 205],
  [253, 226],
  [261, 254],
  [265, 284],
  [267, 312],
  [265, 334],
  [253, 330],
  [240, 326],
  [232, 322],
  [236, 309],
  [238, 293],
  [231, 276],
  [219, 262],
  [209, 246],
  [206, 226],
  [208, 205],
  [212, 191],
]
const BRAIN_HALF: P[] = [
  [200, 44],
  [184, 42],
  [170, 48],
  [161, 60],
  [157, 76],
  [158, 94],
  [162, 108],
  [170, 118],
  [180, 116],
  [190, 108],
  [200, 104],
]
const KIDNEY_R: P[] = [
  [164, 358],
  [174, 360],
  [181, 368],
  [182, 376],
  [178, 383],
  [182, 390],
  [181, 400],
  [174, 407],
  [164, 409],
  [156, 403],
  [152, 391],
  [152, 375],
  [156, 364],
]
const KIDNEY_L: P[] = KIDNEY_R.map(([x, y]) => [400 - x, y - 10])

/**
 * Inner kidney anatomy, drawn for the right kidney and mirrored for the left (same 10-unit lift as the
 * outline): cortex boundary, renal pelvis with three major calyces and their cup-shaped minor calyces,
 * and the renal artery/vein running from the hilum to the aorta and vena cava at the midline.
 */
const KIDNEY_INNER_R: P[][] = [
  // upper / middle / lower major calyx, from the pelvis at the hilum
  [
    [177, 383],
    [172, 380],
    [168, 375],
    [164, 369],
  ],
  [
    [176, 384],
    [170, 384],
    [164, 384],
    [159, 384],
  ],
  [
    [177, 386],
    [172, 389],
    [168, 394],
    [164, 400],
  ],
  // minor calyx cups (where the medullary pyramids drain)
  [
    [161, 369],
    [163, 366],
    [166, 366],
    [167, 369],
  ],
  [
    [158, 381],
    [156, 383],
    [156, 385],
    [158, 387],
  ],
  [
    [161, 400],
    [163, 403],
    [166, 403],
    [167, 400],
  ],
  // renal vein (to the vena cava) and artery (from the aorta)
  [
    [180, 380],
    [186, 378],
    [191, 377],
    [196, 377],
  ],
  [
    [180, 378],
    [188, 374],
    [196, 372],
    [203, 372],
  ],
]
const cubic = ([a, b, c, d]: P[]) => `M${a[0]},${a[1]} C${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`
const mirrorKidney = (pts: P[]): P[] => pts.map(([x, y]) => [400 - x, y - 10])
/** cortex/medulla boundary: the outline shrunk towards the kidney's centre */
const cortexOf = (outline: P[]): P[] => {
  const cx = outline.reduce((s, p) => s + p[0], 0) / outline.length
  const cy = outline.reduce((s, p) => s + p[1], 0) / outline.length
  return outline.map(([x, y]) => [cx + (x - cx) * 0.74, cy + (y - cy) * 0.8])
}

/**
 * Small intestine (jejunum + ileum): ~6 m of gut folded into tight loops inside the colon frame —
 * drawn as a serpentine of rows with a gentle wobble so it reads as a coiled mass, not a single tube.
 */
const SMALL_INTESTINE = spline(
  [
    // from the duodenojejunal flexure (under the stomach) …
    [214, 406],
    [226, 403],
    [235, 410],
    [233, 420],
    [222, 423],
    [211, 417],
    [200, 412],
    [188, 410],
    [178, 415],
    [175, 425],
    [183, 431],
    [195, 429],
    [206, 425],
    [218, 429],
    [230, 427],
    [237, 437],
    [231, 448],
    [219, 447],
    [208, 441],
    [196, 440],
    [184, 443],
    [176, 451],
    [181, 461],
    [193, 459],
    [204, 452],
    [216, 455],
    [228, 459],
    [233, 469],
    [221, 475],
    [207, 469],
    [194, 471],
    [181, 473],
    [172, 467],
    // … to the ileocaecal valve
    [167, 459],
  ],
  false,
)

export const ORGAN_SHAPES = {
  brain: {
    hit: symmetric(BRAIN_HALF),
    detail: [
      'M200,46 L200,103',
      // sulci seen from the front: irregular like a real cortex, not a repeating wave.
      // superior frontal sulcus runs roughly parallel to the midline, the inferior one obliquely,
      // with shorter tertiary sulci of varying length and angle between them
      ...both(
        [
          [190, 49],
          [187, 58],
          [189, 67],
          [186, 77],
          [188, 88],
        ],
        false,
      ),
      ...both(
        [
          [168, 58],
          [173, 66],
          [171, 75],
          [176, 84],
          [175, 92],
        ],
        false,
      ),
      ...both(
        [
          [177, 47],
          [181, 53],
          [179, 59],
        ],
        false,
      ),
      ...both(
        [
          [195, 60],
          [192, 65],
          [194, 71],
        ],
        false,
      ),
      ...both(
        [
          [179, 69],
          [183, 73],
          [182, 79],
        ],
        false,
      ),
      ...both(
        [
          [161, 80],
          [166, 83],
          [170, 81],
        ],
        false,
      ),
      ...both(
        [
          [194, 81],
          [191, 87],
          [194, 95],
        ],
        false,
      ),
      ...both(
        [
          [180, 91],
          [184, 95],
        ],
        false,
      ),
      // superior temporal sulcus on the temporal pole
      ...both(
        [
          [164, 109],
          [170, 111],
          [177, 110],
        ],
        false,
      ),
      // lateral (Sylvian) fissure above the temporal lobe
      ...both(
        [
          [161, 100],
          [170, 99],
          [180, 102],
          [188, 107],
        ],
        false,
      ),
    ],
  },
  eyes: { l: [182, 96] as P, r: [218, 96] as P },
  lungs: {
    hit: `${spline(LUNG_R)} ${spline(LUNG_L)}`,
    detail: [
      // trachea, carina and main bronchi
      'M197,150 L197,230 M203,150 L203,230',
      ...Array.from({ length: 9 }, (_, i) => `M197,${156 + i * 8.4} L203,${156 + i * 8.4}`),
      spline(
        [
          [199, 230],
          [192, 236],
          [184, 246],
          [174, 258],
        ],
        false,
      ),
      spline(
        [
          [201, 230],
          [209, 236],
          [218, 248],
          [228, 260],
        ],
        false,
      ),
      // bronchial branches
      spline(
        [
          [184, 246],
          [176, 236],
          [168, 222],
        ],
        false,
      ),
      spline(
        [
          [174, 258],
          [162, 270],
          [152, 288],
        ],
        false,
      ),
      spline(
        [
          [174, 258],
          [170, 280],
          [166, 304],
        ],
        false,
      ),
      spline(
        [
          [218, 248],
          [226, 234],
          [234, 222],
        ],
        false,
      ),
      spline(
        [
          [228, 260],
          [240, 274],
          [250, 294],
        ],
        false,
      ),
      spline(
        [
          [228, 260],
          [232, 284],
          [238, 300],
        ],
        false,
      ),
      // right lung: horizontal and oblique fissures (3 lobes); left lung: oblique fissure (2 lobes)
      spline(
        [
          [137, 274],
          [156, 271],
          [176, 269],
          [192, 268],
        ],
        false,
      ),
      spline(
        [
          [186, 212],
          [170, 240],
          [154, 282],
          [141, 326],
        ],
        false,
      ),
      spline(
        [
          [214, 212],
          [232, 242],
          [249, 284],
          [262, 328],
        ],
        false,
      ),
    ],
  },
  heart: {
    hit: spline([
      [198, 238],
      [191, 252],
      [188, 270],
      [190, 288],
      [200, 299],
      [218, 306],
      [236, 310],
      [247, 305],
      [249, 290],
      [245, 272],
      [237, 256],
      [228, 246],
      [217, 239],
      [207, 236],
    ]),
    /** great vessels drawn as tubes: aortic arch, pulmonary trunk, superior vena cava */
    vessels: [
      { d: 'M208,244 C204,228 209,215 219,214 C228,213 231,222 229,234', w: 5.5 },
      { d: 'M215,252 C218,242 226,236 236,237', w: 5 },
      { d: 'M196,246 L196,212', w: 4.5 },
    ],
    detail: [
      // left auricle (atrial appendage) on the upper left border
      'M231,250 C236,243 245,246 244,255 C241,261 234,259 231,250 Z',
      // interventricular and atrioventricular grooves
      'M224,248 C222,268 228,292 242,308',
      'M193,284 C205,270 222,260 238,256',
    ],
  },
  liver: {
    hit: spline([
      [136, 327],
      [150, 318],
      [170, 314],
      [190, 318],
      [206, 322],
      [226, 322],
      [244, 326],
      [251, 332],
      [239, 340],
      [220, 346],
      [200, 352],
      [180, 360],
      [160, 368],
      [144, 372],
      [136, 362],
      [133, 345],
    ]),
    detail: [
      // falciform ligament (right | left lobe) and gallbladder
      'M206,322 C204,334 202,344 200,352',
      'M173,356 C170,366 176,375 184,373 C189,369 187,360 182,355 Z',
    ],
  },
  stomach: {
    hit: spline([
      [224, 326],
      [232, 316],
      [246, 313],
      [258, 321],
      [264, 339],
      [262, 362],
      [254, 382],
      [240, 394],
      [222, 397],
      [208, 391],
      [202, 383],
      [210, 377],
      [222, 380],
      [234, 372],
      [240, 356],
      [238, 340],
      [230, 332],
    ]),
    detail: [
      // oesophagus entering at the cardia, pylorus, gastric folds (rugae)
      'M206,300 C212,312 218,320 225,327',
      'M207,380 L203,391',
      'M238,328 C247,339 251,355 247,370',
      'M233,346 C239,360 237,374 229,383',
      'M250,334 C256,350 256,366 250,380',
    ],
  },
  kidneys: {
    hit: `${spline(KIDNEY_R)} ${spline(KIDNEY_L)}`,
    detail: [
      spline(cortexOf(KIDNEY_R)),
      spline(cortexOf(KIDNEY_L)),
      ...KIDNEY_INNER_R.map(cubic),
      ...KIDNEY_INNER_R.map((c) => cubic(mirrorKidney(c))),
      // renal pelvis → ureters → bladder; adrenal glands on top
      'M178,385 C186,389 187,404 186,424 C186,444 190,466 195,478',
      'M222,375 C214,379 213,396 214,420 C214,442 210,466 205,478',
      'M158,358 C161,349 172,349 176,357',
      'M224,347 C228,339 239,339 242,348',
      'M190,476 C190,468 210,468 210,476 C212,488 204,494 200,494 C196,494 188,488 190,476 Z',
    ],
  },
  intestines: {
    hit: spline([
      [154, 390],
      [174, 384],
      [200, 398],
      [226, 384],
      [250, 384],
      [256, 410],
      [254, 450],
      [244, 474],
      [214, 482],
      [180, 474],
      [158, 466],
      [152, 430],
    ]),
    /** large intestine: caecum → ascending → transverse → descending → sigmoid → rectum */
    colon:
      'M166,460 C156,452 156,430 156,408 C156,392 162,386 172,388 C188,392 196,408 210,404 C224,400 236,384 248,388 C254,392 254,410 252,430 C250,450 252,462 244,470 C232,480 220,468 210,474 C204,478 202,484 202,490',
    appendix: 'M166,461 C165,470 159,476 153,474',
    /** small intestine (jejunum and ileum) coiled inside the colon frame */
    coil: SMALL_INTESTINE,
  },
}

/** Diaphragm (decorative, between the chest and the abdomen). */
export const DIAPHRAGM = 'M134,334 C148,314 178,310 198,318 C220,310 252,314 266,334'

/** Major vessels (arteries red, veins blue) — decorative, animated "flow" along the paths. */
const ART = '#ff6b7d'
const VEIN = '#6aa8ff'
export const VESSELS: { d: string; c: string; w: number }[] = [
  // aortic arch → descending aorta → common iliac, femoral, popliteal, posterior tibial arteries
  { d: 'M214,240 C212,224 200,220 197,230 C195,240 202,250 203,272 L203,402', c: ART, w: 3.2 },
  {
    d: 'M203,402 C196,420 184,440 176,470 C170,500 168,540 170,600 C172,640 176,668 176,690 C172,730 168,800 167,872',
    c: ART,
    w: 2.4,
  },
  {
    d: 'M203,402 C210,420 216,440 224,470 C230,500 232,540 230,600 C228,640 224,668 224,690 C228,730 232,800 233,872',
    c: ART,
    w: 2.4,
  },
  // common carotid arteries
  { d: 'M199,226 C195,200 190,176 188,150 C186,134 184,122 183,112', c: ART, w: 2 },
  { d: 'M207,226 C211,200 212,176 212,150 C214,134 216,122 217,112', c: ART, w: 2 },
  // subclavian → axillary → brachial → radial arteries
  {
    d: 'M198,228 C176,214 142,206 126,214 C118,228 118,262 116,300 C114,330 112,350 106,366 C98,400 88,440 82,478',
    c: ART,
    w: 1.8,
  },
  {
    d: 'M210,228 C224,214 258,206 274,214 C282,228 282,262 284,300 C286,330 288,350 294,366 C302,400 312,440 318,478',
    c: ART,
    w: 1.8,
  },
  // superior vena cava + internal jugular veins
  { d: 'M193,242 L193,214 C190,200 186,180 184,152 C183,136 181,124 180,114', c: VEIN, w: 1.8 },
  { d: 'M193,214 C200,206 210,200 216,176 C218,160 219,140 220,114', c: VEIN, w: 1.6 },
  // inferior vena cava → iliac, femoral, great saphenous veins
  {
    d: 'M195,300 L195,404 C188,422 178,444 172,472 C166,502 164,542 166,600 C168,640 172,668 172,690 C168,730 163,800 162,872',
    c: VEIN,
    w: 2.2,
  },
  {
    d: 'M195,404 C204,424 216,444 222,472 C228,502 230,542 228,600 C226,640 222,668 222,690 C226,730 231,800 232,872',
    c: VEIN,
    w: 2.2,
  },
]

/** Faint "dust" particles around the figure (deterministic so SSR and client match). */
export const PARTICLES: [number, number, number][] = Array.from({ length: 26 }, (_, i) => {
  const a = (i * 137.508 * Math.PI) / 180
  const r = 150 + ((i * 53) % 140)
  // rounded: Math.cos/sin can differ in the last bits between server and browser → hydration mismatch
  return [
    Math.round(200 + Math.cos(a) * r * 0.9),
    Math.round(430 + Math.sin(a) * r * 1.5),
    0.8 + (i % 3) * 0.6,
  ]
})

// ── Muscle fibre direction (drawn as hairlines inside the superficial muscles) ─────────────
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
/** point at fraction t along a polyline */
function along(poly: P[], t: number): P {
  const seg = poly.length - 1
  const f = Math.min(seg - 1e-9, t * seg)
  const i = Math.floor(f)
  return lerp(poly[i], poly[i + 1], f - i)
}
/** fibres converging from an arc onto one insertion point (pectoralis, deltoid) */
function fan(apex: P, arc: P[], n: number, bow = 0) {
  return Array.from({ length: n }, (_, k) => {
    const a = along(arc, (k + 0.5) / n)
    const m = lerp(apex, a, 0.5)
    return `M${pt(a)} Q${pt([m[0], m[1] + bow])} ${pt(apex)}`
  })
}
/** roughly parallel fibres between two edges (each edge given as a polyline) */
function sweep(from: P[], to: P[], n: number) {
  return Array.from({ length: n }, (_, k) => {
    const t = (k + 0.5) / n
    return `M${pt(along(from, t))} L${pt(along(to, t))}`
  })
}
const half = [
  // pectoralis major: from sternum and clavicle converging on the humerus
  ...fan(
    [121, 230],
    [
      [150, 202],
      [178, 202],
      [196, 210],
      [196, 240],
      [192, 264],
      [172, 266],
    ],
    11,
    4,
  ),
  // deltoid: from the clavicle/acromion to the deltoid tuberosity
  ...fan(
    [101, 284],
    [
      [124, 200],
      [108, 203],
      [96, 214],
      [91, 236],
    ],
    6,
  ),
  // rectus abdominis: vertical fibres
  ...sweep(
    [
      [185, 276],
      [195, 276],
    ],
    [
      [189, 482],
      [196, 484],
    ],
    3,
  ),
  // external oblique: "hands in pockets" — down and towards the midline
  ...Array.from({ length: 7 }, (_, k) => {
    const y = 290 + k * 17
    return `M${pt([144, y])} L${pt([176, y + 30])}`
  }),
  // biceps and forearm: along the limb
  ...sweep(
    [
      [109, 266],
      [116, 268],
    ],
    [
      [106, 350],
      [111, 350],
    ],
    3,
  ),
  ...sweep(
    [
      [90, 376],
      [102, 376],
    ],
    [
      [82, 458],
      [90, 462],
    ],
    4,
  ),
  // quadriceps: rectus femoris (bipennate), vastus lateralis and medialis
  ...fan(
    [170, 644],
    [
      [154, 486],
      [158, 520],
      [164, 560],
    ],
    5,
  ),
  ...sweep(
    [
      [138, 470],
      [146, 466],
    ],
    [
      [150, 630],
      [158, 644],
    ],
    4,
  ),
  ...fan(
    [180, 654],
    [
      [180, 596],
      [186, 606],
      [189, 626],
    ],
    4,
  ),
  // tibialis anterior and sartorius (one long strap)
  ...sweep(
    [
      [161, 694],
      [166, 694],
    ],
    [
      [168, 852],
      [172, 852],
    ],
    2,
  ),
  spline(
    [
      [150, 454],
      [170, 540],
      [186, 640],
      [187, 672],
    ],
    false,
  ),
]
/** person's-right half; the renderer mirrors it for the left side */
export const MUSCLE_FIBRES = half

/**
 * Supporting organs drawn faintly behind the interactive ones (not selectable): spleen behind the
 * stomach on the left, pancreas across the back of the abdomen (head in the duodenal "C", tail at the
 * spleen), the duodenum from the pylorus to the jejunum, and the thyroid wrapped around the trachea.
 */
export const SUPPORT_ORGANS: {
  id: string
  label: string
  d: string
  color: string
  tube?: number
  /** system filter it belongs to (thyroid and spleen belong to none of the site's systems) */
  system?: 'digestive'
}[] = [
  {
    id: 'spleen',
    label: 'Slezina',
    color: '#c77d9b',
    d: spline([
      [262, 330],
      [270, 334],
      [274, 346],
      [272, 362],
      [266, 374],
      [259, 372],
      [256, 358],
      [256, 342],
    ]),
  },
  {
    id: 'pancreas',
    system: 'digestive',
    label: 'Slinivka břišní',
    color: '#e8c27a',
    d: spline([
      [188, 388],
      [196, 382],
      [212, 380],
      [232, 374],
      [250, 366],
      [260, 364],
      [262, 370],
      [250, 376],
      [232, 384],
      [214, 390],
      [202, 398],
      [190, 400],
      [186, 394],
    ]),
  },
  {
    id: 'duodenum',
    system: 'digestive',
    label: 'Dvanáctník',
    color: '#ffd166',
    tube: 5,
    d: 'M204,388 C196,390 184,394 184,404 C184,414 196,418 208,414 C212,412 214,409 214,406',
  },
  {
    id: 'thyroid',
    label: 'Štítná žláza',
    color: '#7fd1c7',
    d: 'M197,168 C192,160 184,164 185,174 C186,184 194,184 197,178 L203,178 C206,184 214,184 215,174 C216,164 208,160 203,168 Z',
  },
]
