import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { categories, type CategoryId } from '@/content/site'
import { IMAGE_EXT } from './media'

// One folder per project: content/projects/<slug>/index.mdx plus any photos in the same folder.
export const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

export type ProjectLinks = { github?: string; youtube?: string; website?: string }
export type ProjectMeta = {
  slug: string
  title: string
  category: CategoryId
  categoryLabel: string
  status: string
  year: number
  order: number
  summary: string
  stack: string[]
  metrics: Record<string, string>
  result: string
  links: ProjectLinks
  captions: Record<string, string>
  cover: { src: string; stock: boolean }
}
export type ProjectPhoto = { src: string; caption: string; file: string }
export type Project = ProjectMeta & { body: string; photos: ProjectPhoto[] }

const asString = (v: unknown, fallback = '') => (typeof v === 'string' ? v : v == null ? fallback : String(v))
const mediaUrl = (slug: string, file: string) => `/media/projects/${slug}/${encodeURIComponent(file)}`
const prettify = (file: string) => file.replace(IMAGE_EXT, '').replace(/^\d+[-_.]?/, '').replace(/[-_]+/g, ' ').trim() || 'Project photo'

function listImages(slug: string): string[] {
  const dir = path.join(PROJECTS_DIR, slug)
  return fs.readdirSync(dir).filter(f => IMAGE_EXT.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function load(slug: string): Project | null {
  const file = path.join(PROJECTS_DIR, slug, 'index.mdx')
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const category = categories.find(c => c.id === data.category)
  if (!category) throw new Error(`content/projects/${slug}/index.mdx: category must be one of ${categories.map(c => c.id).join(', ')}`)
  if (!data.title) throw new Error(`content/projects/${slug}/index.mdx: title is required`)

  const captions: Record<string, string> = data.captions && typeof data.captions === 'object' ? data.captions : {}
  const images = listImages(slug)
  const coverFile = images.find(f => f.replace(IMAGE_EXT, '').toLowerCase() === 'cover')
  // The gallery is every image except the cover, in file-name order.
  const gallery = images.filter(f => f !== coverFile)
  const stock = asString(data.stockPhoto)
  const firstPhoto = coverFile ?? gallery[0]
  const cover = firstPhoto
    ? { src: mediaUrl(slug, firstPhoto), stock: false }
    : { src: stock ? `/photos/stock/${stock}.jpg` : '', stock: true }

  const metrics: Record<string, string> = {}
  for (const [k, v] of Object.entries((data.metrics ?? {}) as Record<string, unknown>)) metrics[k] = asString(v)
  const links = (data.links ?? {}) as Record<string, unknown>

  return {
    slug,
    title: asString(data.title),
    category: category.id,
    categoryLabel: category.label,
    status: asString(data.status),
    year: Number(data.year) || new Date().getFullYear(),
    order: Number(data.order) || 99,
    summary: asString(data.summary),
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    metrics,
    result: asString(data.result),
    links: { github: asString(links.github), youtube: asString(links.youtube), website: asString(links.website) },
    captions,
    cover,
    body: content,
    photos: gallery.map(f => ({ file: f, src: mediaUrl(slug, f), caption: captions[f] ?? prettify(f) })),
  }
}

export function getProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return []
  return fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => load(d.name))
    .filter((p): p is Project => p !== null)
    .sort((a, b) => a.order - b.order || b.year - a.year || a.title.localeCompare(b.title))
}

export const getProject = (slug: string) => (/^[a-z0-9-]+$/i.test(slug) ? load(slug) : null)
