import fs from 'node:fs'
import path from 'node:path'

export const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i
// Files people can download from a project or lesson page: code, CAD, PCB, docs, archives.
// No .md/.mdx (the page text itself) and no .svg/.html (they could run scripts on this site).
export const FILE_EXT = /\.(pdf|zip|7z|tar|gz|stl|step|stp|3mf|f3d|sldprt|sldasm|dxf|gcode|kicad_pcb|kicad_sch|kicad_pro|gbr|c|h|cpp|hpp|ino|py|ipynb|rs|js|ts|m|sh|yaml|yml|json|csv|txt|xlsx|docx|pptx)$/i
const isMedia = (f: string) => IMAGE_EXT.test(f) || FILE_EXT.test(f)
const TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif', pdf: 'application/pdf', zip: 'application/zip', json: 'application/json' }
const TEXT = /\.(c|h|cpp|hpp|ino|py|rs|js|ts|m|sh|yaml|yml|csv|txt|gcode)$/i

// Lists the photos-or-files in one content folder, in file-name order.
export const listFiles = (dir: string, ext: RegExp) =>
  fs.readdirSync(dir).filter(f => ext.test(f) && !f.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

// Every image and download in every <baseDir>/<slug>/ folder, for the static build's route list.
export function mediaParams(baseDir: string) {
  if (!fs.existsSync(baseDir)) return [PLACEHOLDER]
  const all = fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory())
    .flatMap(d => fs.readdirSync(path.join(baseDir, d.name)).filter(isMedia).map(file => ({ slug: d.name, file })))
  return all.length ? all : [PLACEHOLDER]
}

// Serves a photo or download that sits inside <baseDir>/<slug>/. Only plain file names with an allowed
// extension are served, so nothing outside that folder (index files, parent folders) can be read.
export function serveMedia(baseDir: string, slug: string, encodedFile: string): Response {
  const name = decodeURIComponent(encodedFile)
  const bad = !/^[a-z0-9-]+$/i.test(slug) || name !== path.basename(name) || name.startsWith('.') || !isMedia(name)
  if (bad) return new Response('Not found', { status: 404 })
  const dir = path.join(baseDir, slug)
  const full = path.join(dir, name)
  if (!full.startsWith(dir + path.sep) || !fs.existsSync(full)) return new Response('Not found', { status: 404 })
  const ext = name.split('.').pop()!.toLowerCase()
  return new Response(fs.readFileSync(full), { headers: { 'Content-Type': TYPES[ext] ?? (TEXT.test(name) ? 'text/plain; charset=utf-8' : 'application/octet-stream'), 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=300' } })
}

// A static export needs every image route to list at least one file. When there are no photos yet,
// this one-pixel transparent GIF stands in so the build still works. It is never shown on a page.
export const PLACEHOLDER = { slug: 'placeholder', file: 'none.gif' }
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
export const isPlaceholder = (slug: string, file: string) => slug === PLACEHOLDER.slug && file === PLACEHOLDER.file
export const placeholderResponse = () => new Response(PIXEL, { headers: { 'Content-Type': 'image/gif' } })
