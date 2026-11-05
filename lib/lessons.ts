import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { IMAGE_EXT, listFiles } from './media'
import { asset } from './base'

// Lessons: write-ups that are not tied to one project (how-tos, theory, tool tips).
// One folder each: content/lessons/<slug>/index.mdx plus its photos, code and files in the same folder.
export const LESSONS_DIR = path.join(process.cwd(), 'content/lessons')

export type Lesson = { slug: string; title: string; date: string; when: string; summary: string; tags: string[]; cover: string; body: string }

const DAY = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function load(slug: string): Lesson | null {
  const file = path.join(LESSONS_DIR, slug, 'index.mdx')
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  if (!data.title) throw new Error(`content/lessons/${slug}/index.mdx: title is required`)
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '')
  const parsed = new Date(date)
  const cover = listFiles(path.join(LESSONS_DIR, slug), IMAGE_EXT).find(f => f.replace(IMAGE_EXT, '').toLowerCase() === 'cover')
  return {
    slug,
    title: String(data.title),
    date,
    when: date && !Number.isNaN(parsed.getTime()) ? DAY.format(parsed) : '',
    summary: String(data.summary ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: cover ? asset(`/media/lessons/${slug}/${encodeURIComponent(cover)}`) : '',
    body: content,
  }
}

// Newest first.
export function getLessons(): Lesson[] {
  if (!fs.existsSync(LESSONS_DIR)) return []
  return fs.readdirSync(LESSONS_DIR, { withFileTypes: true }).filter(d => d.isDirectory())
    .map(d => load(d.name)).filter((l): l is Lesson => l !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}

export const getLesson = (slug: string) => (/^[a-z0-9-]+$/i.test(slug) ? load(slug) : null)
