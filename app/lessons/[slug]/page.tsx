import type { Metadata } from 'next'
import Link from 'next/link'
import path from 'node:path'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { LESSONS_DIR, getLesson, getLessons } from '@/lib/lessons'
import { me } from '@/content/site'
import { asset } from '@/lib/base'
import { DocSide, docComponents, docFiles, headings } from '@/components/Doc'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getLessons().map(l => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = getLesson((await params).slug)
  return l ? { title: `${l.title} | ${me.name}`, description: l.summary } : { title: 'Lesson not found' }
}

export default async function LessonPage({ params }: Params) {
  const l = getLesson((await params).slug)
  if (!l) notFound()

  const all = getLessons()
  const i = all.findIndex(x => x.slug === l.slug)
  const newer = i > 0 ? all[i - 1] : null
  const older = i < all.length - 1 ? all[i + 1] : null
  const dir = path.join(LESSONS_DIR, l.slug)
  const base = asset(`/media/lessons/${l.slug}`)

  return (
    <>
      <nav className="nav" aria-label="Lesson navigation">
        <Link href="/">Back to the scrapbook</Link>
        <Link href="/lessons">All lessons</Link>
      </nav>
      <main className="collage detail">
        <article className="tile name lessonhead">
          <span className="m">Lesson{l.when ? `, ${l.when}` : ''}</span>
          <h1>{l.title}</h1>
          <p>{l.summary}</p>
          {l.tags.length > 0 && <ul className="stackchips">{l.tags.map(t => <li key={t}>{t}</li>)}</ul>}
        </article>
        <article className="tile writeup">
          <MDXRemote source={l.body} components={docComponents(dir, base, l.title)} />
        </article>
        <aside className="side">
          <div className="sidestick">
          <DocSide toc={headings(l.body)} files={docFiles(dir, base)} />
          </div>
        </aside>
        <div className="pager">
          {older ? <Link className="tile pagetile" href={`/lessons/${older.slug}`}><small>Older</small>{older.title}</Link> : <span />}
          {newer ? <Link className="tile pagetile" href={`/lessons/${newer.slug}`}><small>Newer</small>{newer.title}</Link> : <span />}
        </div>
      </main>
    </>
  )
}
