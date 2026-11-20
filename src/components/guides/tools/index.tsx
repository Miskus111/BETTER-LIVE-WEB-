import { BloodPressureCheck } from './BloodPressureCheck'
import { CaffeineCalculator } from './CaffeineCalculator'
import { ProteinCalculatorTool } from './ProteinCalculatorTool'
import { SafeListening } from './SafeListening'
import { WaterCalculator } from './WaterCalculator'

/** Interactive tools shown inside specific guides ("Vyzkoušejte si"). */
export const GUIDE_TOOLS: Record<string, React.ComponentType> = {
  'energie-a-kofein': CaffeineCalculator,
  'sluch-a-sluchatka': SafeListening,
  'svaly-a-metabolismus': ProteinCalculatorTool,
  'srdce-a-tlak': BloodPressureCheck,
  'pitny-rezim': WaterCalculator,
}
