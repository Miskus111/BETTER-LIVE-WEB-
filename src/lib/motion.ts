/** "smooth" unless the visitor asked the system for reduced motion (JS scrolling ignores the CSS rule). */
export const scrollBehavior = (): ScrollBehavior =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'
