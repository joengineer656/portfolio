import { MOMENTS_DIR } from '@/lib/moments'
import { serveImage } from '@/lib/media'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  return serveImage(MOMENTS_DIR, slug, file)
}
