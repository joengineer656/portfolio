import fs from 'node:fs'
import path from 'node:path'
import { MOMENTS_DIR } from '@/lib/moments'
import { IMAGE_EXT, serveImage } from '@/lib/media'

export const dynamic = 'force-static'

// Every photo that sits in a workshop folder gets its own address (used by the static GitHub Pages build).
export function generateStaticParams() {
  if (!fs.existsSync(MOMENTS_DIR)) return []
  return fs.readdirSync(MOMENTS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).flatMap(d =>
    fs.readdirSync(path.join(MOMENTS_DIR, d.name)).filter(f => IMAGE_EXT.test(f)).map(file => ({ slug: d.name, file })))
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  return serveImage(MOMENTS_DIR, slug, file)
}
