/** Content for the intestines "fermentation" explainer, following the ISAPP consensus (Marco et al. 2021). */
export const FERMENTATION = {
  intro:
    'Fermentation is a process, not a health claim. Microbes convert sugars into acids, gas or alcohol — which preserves food and changes flavour. What reaches your gut afterwards depends on how the food was handled.',
  terms: [
    {
      term: 'Fermented food',
      def: 'Made through desired microbial growth and enzymatic conversion. Bread, wine, most soy sauce and canned sauerkraut are fermented foods — but contain no live microbes by the time you eat them.',
    },
    {
      term: 'Live cultures',
      def: 'The fermenting microbes are still alive when eaten, e.g. yoghurt or kefir that has not been heat-treated after fermentation, or refrigerated raw sauerkraut and kimchi.',
    },
    {
      term: 'Probiotic',
      def: 'Defined, characterised strains shown in human studies to confer a health benefit at a stated dose. Benefits are strain-specific and cannot be transferred to "fermented foods" in general. "Probiotic" is not a permitted claim on EU food labels.',
    },
  ],
  heat: 'Pasteurised, canned, baked or shelf-stable products contain no live cultures, even if they were fermented. Look for "unpasteurised", "live cultures" and refrigerated storage.',
  claim:
    'The only EU-authorised claim for live cultures: live yoghurt cultures improve lactose digestion in individuals with difficulty digesting lactose.',
} as const
