import { PROJECTS_DIR } from '@/lib/projects'
import { serveImage } from '@/lib/media'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  return serveImage(PROJECTS_DIR, slug, file)
}
