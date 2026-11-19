/**
 * Pre-screen of the user's message before it reaches the model.
 * Emergencies and self-harm get a fixed, reviewed reply (no model call);
 * eating-disorder signals are passed through with an extra system instruction.
 */
export type Screen = 'emergency' | 'crisis' | 'eating' | null

const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Text is lower-cased and stripped of diacritics before matching. Err on the side of catching:
// a false positive shows a helpline, a miss leaves someone in crisis with a chatbot.
const CRISIS = [
  /zabit se|se zabit|zabiju se|chci umrit|chtel(a)? bych umrit|nechci (uz )?zit|nemam (pro )?co zit|skoncovat (se )?(se svym )?zivot|sebevrazd|sebeposkoz|ublizit si|ublizim si|ubliz(uj|ova)(u|t) si|podrezat|rezu se|rezat se|pozrat prasky|predavkovat se/,
  /kill myself|kms\b|suicid|end my life|end it all|want to die|hurt myself|self[- ]harm|cutting myself|overdose on purpose/,
]
const CHEST = '(hrud|hrudnik|prsou|prsa)'
const EMERGENCY = [
  new RegExp(
    `(bolest|boli|pali|svira|tlaci|pichani|pichá|picha|tlak)( me)? (na|v|ve) ${CHEST}|${CHEST}\\w* .{0,30}(vystreluje|brni|brneni) .{0,20}(ruk|celist)`,
  ),
  /nemuzu dychat|nemohu dychat|neda se mi dychat|dusim se|ochrnut|poklesly koutek|nemuzu mluvit|ztrata vedomi|omdlel|krev ve stolici|zvracim krev|necitim (rozkrok|genital)/,
  /chest pain|chest pressure|can'?t breathe|cannot breathe|face drooping|slurred speech|passed out|fainted|vomiting blood|numb(ness)? (in )?(my )?(groin|saddle)|lost (bladder|bowel) control/,
]
const EATING = [
  /zvracim po jidle|vyvolavam zvraceni|projimadl|laxativ|nejim (uz )?\d+ dn|zachvat prejidani|hladovim/,
  /purg(e|ing)|make myself (throw up|vomit)|laxative|binge and|haven'?t eaten (in|for) \d+ days|starving myself/,
]

export function screenMessage(text: string): Screen {
  const t = strip(text)
  if (CRISIS.some((r) => r.test(t))) return 'crisis'
  if (EMERGENCY.some((r) => r.test(t))) return 'emergency'
  if (EATING.some((r) => r.test(t))) return 'eating'
  return null
}

export const FIXED_REPLY: Record<'emergency' | 'crisis', Record<'cs' | 'en', string>> = {
  emergency: {
    cs: '**To může být akutní stav. Volejte prosím hned 155 (záchranná služba) nebo 112.** Nečekejte na odpověď aplikace a necvičte. Pokud nejste sami, řekněte to někomu poblíž.\n\nAž budete v pořádku, rád vám pomůžu s návratem k pohybu.',
    en: '**This could be an emergency. Please call 112 (or your local emergency number) now.** Do not wait for the app and do not exercise. If someone is nearby, tell them.\n\nOnce you have been checked, I am happy to help you get back to training.',
  },
  crisis: {
    cs: 'Je mi líto, že to teď prožíváte – nejste v tom sami. Prosím, ozvěte se hned někomu, kdo vám může pomoct:\n\n- **Linka první psychické pomoci: 116 123** (nonstop, zdarma)\n- **Slovensko – Linka dôvery Nezábudka: 0800 800 566**\n- **Akutní ohrožení: 112 nebo 155**\n\nPokud můžete, řekněte to i blízkému člověku. Jsem tu i potom, ale teď je důležitější mluvit s člověkem.',
    en: 'I am really sorry you are going through this — you are not alone. Please reach out to someone who can help right now:\n\n- **Czech crisis line: 116 123** (24/7, free)\n- **Slovakia: 0800 800 566**\n- **Immediate danger: 112**\n\nIf you can, tell someone close to you as well. I am still here, but talking to a person matters most right now.',
  },
}

export const EATING_INSTRUCTION =
  'The user may be describing disordered eating. Do not give calorie targets, deficits, fasting or weight-loss advice in this reply. Respond with empathy, avoid numbers about food or weight, and gently recommend professional help (a doctor or an eating-disorder service; in CZ e.g. anabell.cz). Ask how they are doing.'
