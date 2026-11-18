import { CaffeineCalculator } from './CaffeineCalculator'
import { ProteinCalculator } from './ProteinCalculator'
import { SafeListening } from './SafeListening'

/** Interactive tools shown inside specific guides ("Vyzkoušejte si"). */
export const GUIDE_TOOLS: Record<string, React.ComponentType> = {
  'energie-a-kofein': CaffeineCalculator,
  'sluch-a-sluchatka': SafeListening,
  'svaly-a-metabolismus': ProteinCalculator,
}
