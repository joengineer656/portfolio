import { LESSONS_DIR } from '@/lib/lessons'
import { isPlaceholder, mediaParams, placeholderResponse, serveMedia } from '@/lib/media'

export const dynamic = 'force-static'

// Every photo and download in a lesson folder gets its own address (used by the static GitHub Pages build).
export const generateStaticParams = () => mediaParams(LESSONS_DIR)

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  if (isPlaceholder(slug, file)) return placeholderResponse()
  return serveMedia(LESSONS_DIR, slug, file)
}
