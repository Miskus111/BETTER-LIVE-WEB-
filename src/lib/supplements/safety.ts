import {
  EXCLUDED,
  SUPPLEMENT_BY_ID,
  type InteractionKey,
  type Supplement,
  type SupplementId,
} from '@/data/supplement-library'

/**
 * Supplement safety checks used by the stack tracker and the AI coach's `recommend_supplements` tool.
 * Wellness only: anything uncertain defers to a doctor or pharmacist.
 */

/** Medication text (free, cs/en) → interaction categories. Matching is deliberately broad. */
const MED_PATTERNS: [InteractionKey, RegExp][] = [
  [
    'anticoagulants',
    /warfarin|lawarin|apixaban|eliquis|rivaroxaban|xarelto|dabigatran|pradaxa|edoxaban|clopidogrel|antikoagul|anticoagul|ředění krve|blood thinner/i,
  ],
  ['levothyroxine', /levothyrox|euthyrox|letrox|thyrox|štítn|thyroid/i],
  [
    'antibiotics_quinolone_tetracycline',
    /ciproflox|levoflox|moxiflox|doxycyklin|doxycyclin|tetracyklin|tetracyclin|minocyc/i,
  ],
  ['metformin', /metformin|siofor|glucophage/i],
  [
    'antidepressants',
    /sertralin|escitalopram|citalopram|fluoxetin|paroxetin|venlafaxin|duloxetin|ssri|snri|antidepres/i,
  ],
  [
    'blood_pressure',
    /hypertenz|hypertens|tlak|ramipril|perindopril|amlodipin|bisoprolol|metoprolol|losartan|telmisartan/i,
  ],
  ['diuretics', /hydrochlorothiazid|indapamid|furosemid|diuretik|diuretic/i],
  ['sedatives', /benzodiazep|diazepam|alprazolam|zolpidem|hypnotik|sedativ|sleeping pill/i],
  [
    'immunosuppressants',
    /takrolimus|tacrolimus|cyklosporin|ciclosporin|methotrexat|imunosupres|immunosuppress|chemoterap|chemotherap/i,
  ],
  ['stimulants', /methylfenid|ritalin|concerta|amfetamin|amphetamin|elvanse|modafinil/i],
]

export function medicationCategories(medications: string | null | undefined): InteractionKey[] {
  if (!medications) return []
  return MED_PATTERNS.filter(([, re]) => re.test(medications)).map(([k]) => k)
}

export type Condition = 'pregnancy' | 'breastfeeding' | 'kidney' | 'liver' | 'anticoagulants' | 'thyroid'

export interface StackItem {
  id: SupplementId
  /** daily amount in the supplement's dose unit */
  dailyAmount: number
}

export interface SafetyIssue {
  supplement: SupplementId
  level: 'block' | 'doctor' | 'warn' | 'timing'
  code: 'excluded' | 'over_ul' | 'over_typical' | 'condition' | 'interaction' | 'combination'
  detail: { cs: string; en: string }
}

/** Is a requested product/ingredient on the hard exclusion list (steroids, SARMs, peptides…)? */
export const isExcluded = (name: string) => EXCLUDED.test(name)

/** Daily amount vs EFSA UL. Food intake is ignored for "supplements"-scoped limits. */
export function checkDose(s: Supplement, dailyAmount: number): SafetyIssue | null {
  if (s.ul && dailyAmount > s.ul.value)
    return {
      supplement: s.id,
      level: 'block',
      code: 'over_ul',
      detail: {
        cs: `Dávka ${dailyAmount} ${s.dose.unit} překračuje horní bezpečný limit ${s.ul.value} ${s.dose.unit}.`,
        en: `${dailyAmount} ${s.dose.unit} exceeds the upper safe limit of ${s.ul.value} ${s.dose.unit}.`,
      },
    }
  if (dailyAmount > s.dose.max)
    return {
      supplement: s.id,
      level: 'warn',
      code: 'over_typical',
      detail: {
        cs: `Dávka je nad běžným rozmezím (${s.dose.min}–${s.dose.max} ${s.dose.unit}).`,
        en: `Dose is above the typical range (${s.dose.min}–${s.dose.max} ${s.dose.unit}).`,
      },
    }
  return null
}

/** Full check of a personal stack against medications and health conditions. */
export function checkStack(
  stack: StackItem[],
  ctx: { medications?: string | null; conditions?: Condition[] },
): SafetyIssue[] {
  const issues: SafetyIssue[] = []
  const meds = new Set(medicationCategories(ctx.medications))
  const conds = new Set<Condition>(ctx.conditions ?? [])
  if (meds.has('anticoagulants')) conds.add('anticoagulants')
  if (meds.has('levothyroxine')) conds.add('thyroid')
  const ids = new Set(stack.map((x) => x.id))

  for (const item of stack) {
    const s = SUPPLEMENT_BY_ID[item.id]
    if (!s) continue
    const dose = checkDose(s, item.dailyAmount)
    if (dose) issues.push(dose)
    for (const c of s.avoidIf)
      if (c !== 'under18' && conds.has(c as Condition))
        issues.push({
          supplement: s.id,
          level: 'doctor',
          code: 'condition',
          detail: {
            cs: 'Při vašem zdravotním stavu nebo lécích užívejte jen po poradě s lékařem nebo lékárníkem.',
            en: 'Given your health condition or medication, only take this after checking with a doctor or pharmacist.',
          },
        })
    for (const i of s.interactions) {
      const hitMed = meds.has(i.with)
      const hitStack =
        (i.with === 'iron_supplement' && ids.has('iron')) ||
        (i.with === 'calcium_supplement' && ids.has('calcium'))
      if (hitMed || hitStack)
        issues.push({
          supplement: s.id,
          level: i.severity === 'avoid' ? 'doctor' : i.severity === 'timing' ? 'timing' : 'warn',
          code: hitStack ? 'combination' : 'interaction',
          detail: i.text,
        })
    }
  }
  // pregnancy/breastfeeding/kidney/liver: always defer the whole stack to a doctor
  if (
    ['pregnancy', 'breastfeeding', 'kidney', 'liver'].some((c) => conds.has(c as Condition)) &&
    stack.length
  )
    issues.push({
      supplement: stack[0].id,
      level: 'doctor',
      code: 'condition',
      detail: {
        cs: 'V těhotenství, při kojení nebo onemocnění ledvin či jater konzultujte všechny doplňky s lékařem.',
        en: 'During pregnancy, breastfeeding or with kidney/liver disease, check all supplements with your doctor.',
      },
    })
  return issues
}
