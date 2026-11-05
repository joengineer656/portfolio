import { MOMENTS_DIR } from '@/lib/moments'
import { isPlaceholder, mediaParams, placeholderResponse, serveMedia } from '@/lib/media'

export const dynamic = 'force-static'

// Every photo and download in a workshop folder gets its own address (used by the static GitHub Pages build).
export const generateStaticParams = () => mediaParams(MOMENTS_DIR)

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  if (isPlaceholder(slug, file)) return placeholderResponse()
  return serveMedia(MOMENTS_DIR, slug, file)
}
