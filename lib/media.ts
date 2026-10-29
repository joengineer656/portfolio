import fs from 'node:fs'
import path from 'node:path'

export const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i
const TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif' }

// Serves an image that sits inside <baseDir>/<slug>/. Only plain image file names are allowed,
// so nothing outside that folder (index files, parent folders) can be read.
export function serveImage(baseDir: string, slug: string, encodedFile: string): Response {
  const name = decodeURIComponent(encodedFile)
  const bad = !/^[a-z0-9-]+$/i.test(slug) || name !== path.basename(name) || name.startsWith('.') || !IMAGE_EXT.test(name)
  if (bad) return new Response('Not found', { status: 404 })
  const dir = path.join(baseDir, slug)
  const full = path.join(dir, name)
  if (!full.startsWith(dir + path.sep) || !fs.existsSync(full)) return new Response('Not found', { status: 404 })
  const ext = name.split('.').pop()!.toLowerCase()
  return new Response(fs.readFileSync(full), { headers: { 'Content-Type': TYPES[ext] ?? 'application/octet-stream', 'Cache-Control': 'public, max-age=300' } })
}

// A static export needs every image route to list at least one file. When there are no photos yet,
// this one-pixel transparent GIF stands in so the build still works. It is never shown on a page.
export const PLACEHOLDER = { slug: 'placeholder', file: 'none.gif' }
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
export const isPlaceholder = (slug: string, file: string) => slug === PLACEHOLDER.slug && file === PLACEHOLDER.file
export const placeholderResponse = () => new Response(PIXEL, { headers: { 'Content-Type': 'image/gif' } })
