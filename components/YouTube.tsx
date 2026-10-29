// Embeds a YouTube video from a normal watch, share or embed link. Returns nothing for anything else.
export function youTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null
    if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
      if (u.searchParams.get('v')) return u.searchParams.get('v')
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]{6,})/)
      return m ? m[2] : null
    }
  } catch {}
  return null
}

export default function YouTube({ url, title = 'Project video' }: { url: string; title?: string }) {
  const id = youTubeId(url)
  if (!id || !/^[\w-]{6,}$/.test(id)) return null
  return (
    <div className="video">
      <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    </div>
  )
}
