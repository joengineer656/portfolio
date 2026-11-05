import type { Metadata } from 'next'
import Link from 'next/link'
import path from 'node:path'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { LESSONS_DIR, getLesson, getLessons } from '@/lib/lessons'
import { me } from '@/content/site'
import { asset } from '@/lib/base'
import { DocSide, docComponents, docFiles, headings } from '@/components/Doc'
import LangSwitch from '@/components/LangSwitch'
import { T } from '@/lib/i18n'

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
        <Link href="/"><T en="Back to the scrapbook" ar="العودة إلى الصفحة الرئيسية" /></Link>
        <Link href="/lessons"><T en="All lessons" ar="كل الدروس" /></Link>
        <LangSwitch />
      </nav>
      <main className="collage detail">
        <article className="tile name lessonhead">
          <span className="m"><T en={`Lesson${l.when ? `, ${l.when}` : ''}`} ar={`درس${l.ar?.when ? `، ${l.ar.when}` : ''}`} /></span>
          <h1><T en={l.title} ar={l.ar?.title} /></h1>
          <p><T en={l.summary} ar={l.ar?.summary} /></p>
          {l.tags.length > 0 && <ul className="stackchips">{l.tags.map(t => <li key={t}>{t}</li>)}</ul>}
        </article>
        <article className="tile writeup">
          <T as="div" en={<MDXRemote source={l.body} components={docComponents(dir, base, l.title)} />} ar={l.ar && <MDXRemote source={l.ar.body} components={docComponents(dir, base, l.ar.title || l.title)} />} />
        </article>
        <aside className="side">
          <div className="sidestick">
          <DocSide toc={headings(l.body)} tocAr={l.ar && headings(l.ar.body)} files={docFiles(dir, base)} />
          </div>
        </aside>
        <div className="pager">
          {older ? <Link className="tile pagetile" href={`/lessons/${older.slug}`}><small><T en="Older" ar="الأقدم" /></small><T en={older.title} ar={older.ar?.title} /></Link> : <span />}
          {newer ? <Link className="tile pagetile" href={`/lessons/${newer.slug}`}><small><T en="Newer" ar="الأحدث" /></small><T en={newer.title} ar={newer.ar?.title} /></Link> : <span />}
        </div>
      </main>
    </>
  )
}
