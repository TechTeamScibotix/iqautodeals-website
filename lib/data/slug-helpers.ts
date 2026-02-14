import { makes } from './makes'
import { models } from './models'

/**
 * Convert a DB make name (e.g. "Ford") to the makes data slug (e.g. "ford")
 */
export function toMakeSlug(makeName: string): string | null {
  const entry = Object.entries(makes).find(
    ([, data]) => data.name.toLowerCase() === makeName.toLowerCase()
  )
  return entry ? entry[0] : null
}

/**
 * Convert a DB make + model to the /models/[model] page slug (e.g. "ford-f150")
 * These use brand-prefixed slugs like "ford-f150", "honda-civic"
 */
export function toModelPageSlug(makeName: string, modelName: string): string | null {
  const entry = Object.entries(models).find(
    ([, data]) =>
      data.brand.toLowerCase() === makeName.toLowerCase() &&
      data.model.toLowerCase() === modelName.toLowerCase()
  )
  return entry ? entry[0] : null
}

/**
 * Convert a DB make + model to /cars/make/[make]/[model] URL parts
 * Returns { makeSlug: "ford", modelSlug: "f-150" } for URL construction
 */
export function toMakeModelUrl(makeName: string, modelName: string): { makeSlug: string; modelSlug: string } | null {
  const makeSlug = toMakeSlug(makeName)
  if (!makeSlug) return null

  // Find the model in the data to get the canonical model name
  const modelEntry = Object.entries(models).find(
    ([, data]) =>
      data.brand.toLowerCase() === makeName.toLowerCase() &&
      data.model.toLowerCase() === modelName.toLowerCase()
  )

  if (!modelEntry) return null

  // Use model name slug (e.g. "F-150" → "f-150", "Grand Cherokee" → "grand-cherokee")
  const modelSlug = modelEntry[1].model
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  return { makeSlug, modelSlug }
}
