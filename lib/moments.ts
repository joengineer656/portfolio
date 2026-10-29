import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { stockCredits } from '@/content/site'
import { IMAGE_EXT } from './media'
import { asset } from './base'

// Workshops, challenges and other moments. One folder each: content/moments/<slug>/index.md
// (frontmatter + a few sentences of text) and a photo named photo.jpg (or .png/.webp) in the same folder.
export const MOMENTS_DIR = path.join(process.cwd(), 'content/moments')

export type Moment = {
  slug: string
  title: string
  kind: string
  date: string // sortable, e.g. 2025-05
  when: string // display, e.g. May 2025
  place: string
  text: string
  photo: { src: string; stock: boolean; credit?: { author: string; license: string; source: string } } | null
}

const asString = (v: unknown) => (v == null ? '' : v instanceof Date ? v.toISOString().slice(0, 10) : String(v))
const MONTH = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })

function load(slug: string): Moment | null {
  const file = ['index.md', 'index.mdx'].map(f => path.join(MOMENTS_DIR, slug, f)).find(f => fs.existsSync(f))
  if (!file) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  if (!data.title) throw new Error(`content/moments/${slug}: title is required`)

  const date = asString(data.date)
  const parsed = date ? new Date(date.length === 7 ? `${date}-01` : date) : null
  const images = fs.readdirSync(path.join(MOMENTS_DIR, slug)).filter(f => IMAGE_EXT.test(f)).sort()
  const own = images.find(f => f.replace(IMAGE_EXT, '').toLowerCase() === 'photo') ?? images[0]
  const stockSlug = asString(data.stockPhoto)
  const credit = stockCredits.find(c => c.slug === stockSlug)

  return {
    slug,
    title: asString(data.title),
    kind: asString(data.kind) || 'Moment',
    date,
    when: parsed && !Number.isNaN(parsed.getTime()) ? MONTH.format(parsed) : '',
    place: asString(data.place),
    text: content.trim(),
    photo: own
      ? { src: asset(`/media/moments/${slug}/${encodeURIComponent(own)}`), stock: false }
      : stockSlug
        ? { src: asset(`/photos/stock/${stockSlug}.jpg`), stock: true, credit: credit && { author: credit.author, license: credit.license, source: credit.source } }
        : null,
  }
}

export function getMoments(): Moment[] {
  if (!fs.existsSync(MOMENTS_DIR)) return []
  return fs
    .readdirSync(MOMENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => load(d.name))
    .filter((m): m is Moment => m !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}
