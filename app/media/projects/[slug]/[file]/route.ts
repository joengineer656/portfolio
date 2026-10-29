import fs from 'node:fs'
import path from 'node:path'
import { PROJECTS_DIR } from '@/lib/projects'
import { IMAGE_EXT, serveImage } from '@/lib/media'

export const dynamic = 'force-static'

// Every photo that sits in a project folder gets its own address (used by the static GitHub Pages build).
export function generateStaticParams() {
  if (!fs.existsSync(PROJECTS_DIR)) return []
  return fs.readdirSync(PROJECTS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).flatMap(d =>
    fs.readdirSync(path.join(PROJECTS_DIR, d.name)).filter(f => IMAGE_EXT.test(f)).map(file => ({ slug: d.name, file })))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  return serveImage(PROJECTS_DIR, slug, file)
}
