import { PROJECTS_DIR } from '@/lib/projects'
import { isPlaceholder, mediaParams, placeholderResponse, serveMedia } from '@/lib/media'

export const dynamic = 'force-static'

// Every photo and download in a project folder gets its own address (used by the static GitHub Pages build).
export const generateStaticParams = () => mediaParams(PROJECTS_DIR)

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  if (isPlaceholder(slug, file)) return placeholderResponse()
  return serveMedia(PROJECTS_DIR, slug, file)
}
