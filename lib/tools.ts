import fs from 'node:fs'
import path from 'node:path'
import { asset } from './base'

// Tool images live in public/tools/<slug>.svg (or .png/.webp). To use your own logo for a tool,
// drop a file with the tool's slug there, e.g. "Fusion 360" -> fusion-360.svg, "C++" -> cpp.svg.
export const toolSlug = (name: string) => name.toLowerCase().replace(/\+/g, 'p').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const DIR = path.join(process.cwd(), 'public/tools')
export function toolImage(name: string): string | null {
  const slug = toolSlug(name)
  for (const ext of ['svg', 'png', 'webp']) if (fs.existsSync(path.join(DIR, `${slug}.${ext}`))) return asset(`/tools/${slug}.${ext}`)
  return null
}
