/**
 * Link to a food's record in USDA FoodData Central. The site's own detail address (/food-details/<id>/nutrients)
 * only works when navigating inside the FDC app — opened from another site it answers 404 and never finishes
 * loading (checked 25 Nov 2026). Its search, given the FDC number and dataset, opens fine and lists exactly that
 * food, one click from the detail.
 */
export function fdcUrl(sourceId: string | number, sourceVersion: string): string {
  const type = /^Foundation/.test(sourceVersion) ? 'Foundation' : 'SR Legacy'
  return `https://fdc.nal.usda.gov/food-search?query=${encodeURIComponent(String(sourceId))}&type=${encodeURIComponent(type)}`
}
