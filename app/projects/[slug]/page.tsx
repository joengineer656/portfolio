import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getProject, getProjects } from '@/lib/projects'
import { me } from '@/content/site'
import PhotoWall, { type WallItem } from '@/components/PhotoWall'
import Socials from '@/components/Socials'
import Tools from '@/components/Tools'
import YouTube, { youTubeId } from '@/components/YouTube'

// Read the project folders on every request, so new photos and edits show up without a rebuild.
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug)
  return p ? { title: `${p.title} | ${me.name}`, description: p.summary } : { title: 'Project not found' }
}

const WALL_MIN = 4 // fill the wall to at least this many places with "your photo here" slots

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()

  const all = getProjects()
  const i = all.findIndex(x => x.slug === p.slug)
  const prev = i > 0 ? all[i - 1] : null
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null

  const items: WallItem[] = p.photos.map(ph => ({ kind: 'photo', key: ph.src, src: ph.src, caption: ph.caption }))
  for (let n = items.length; n < WALL_MIN; n++) items.push({ kind: 'slot', key: `slot-${n}`, hint: `content/projects/${p.slug}/${String(n + 1).padStart(2, '0')}-name.jpg` })

  const hasVideo = !!(p.links.youtube && youTubeId(p.links.youtube))
  const mdxComponents = {
    YouTube,
    // <Photo file="01-gearbox.jpg" caption="..." /> puts one of this project's photos inside the text.
    Photo: ({ file, caption }: { file: string; caption?: string }) => (
      <figure className="inline-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/media/projects/${p.slug}/${encodeURIComponent(file)}`} alt={caption ?? p.title} loading="lazy" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    ),
  }

  return (
    <>
      <nav className="nav" aria-label="Project navigation">
        <Link href="/">Back to the scrapbook</Link>
        <Link href="/#projects">All projects</Link>
      </nav>

      <main className="collage detail">
        <article className="tile name">
          <span className="m">{p.categoryLabel}, {p.status}, {p.year}</span>
          <h1>{p.title}</h1>
          <p>{p.summary}</p>
        </article>

        <figure className="tile herophoto">
          {p.cover.src && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.cover.src} alt={p.title} />}
          <figcaption>{p.cover.stock ? 'Stock photo. Add cover.jpg to this project folder to replace it.' : p.title}</figcaption>
        </figure>

        <section className="tile facts" aria-label="Project facts">
          <h2>The numbers</h2>
          <dl>{Object.entries(p.metrics).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <p className="result"><b>Result:</b> {p.result}</p>
        </section>

        <article className="tile writeup">
          <MDXRemote source={p.body} components={mdxComponents} />
        </article>

        <aside className="side">
          {hasVideo && (
            <div className="tile videotile"><h2>Watch it work</h2><YouTube url={p.links.youtube!} title={`${p.title} video`} /></div>
          )}
          <div className="tile sourcetile">
            <h2>Source and links</h2>
            {p.links.github || p.links.youtube || p.links.website ? (
              <Socials big items={[{ label: 'GitHub', href: p.links.github, icon: 'github' }, { label: 'YouTube', href: p.links.youtube, icon: 'youtube' }, { label: 'Website', href: p.links.website, icon: 'web' }]} />
            ) : (
              <p>No links yet. Add <code>links.github</code> or <code>links.youtube</code> to this project&apos;s index.mdx.</p>
            )}
            <h3>Built with</h3>
            <Tools big names={p.stack} />
          </div>
        </aside>

        <h2 className="sectionhead">Photos</h2>
        <div className="photos"><PhotoWall items={items} /></div>

        <div className="pager">
          {prev ? <Link className="tile pagetile" href={`/projects/${prev.slug}`}><small>Previous</small>{prev.title}</Link> : <span />}
          {next ? <Link className="tile pagetile" href={`/projects/${next.slug}`}><small>Next</small>{next.title}</Link> : <span />}
        </div>
      </main>
    </>
  )
}
