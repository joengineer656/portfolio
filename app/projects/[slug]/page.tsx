import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getProject, getProjects } from '@/lib/projects'
import { me, categories } from '@/content/site'
import PhotoWall, { type WallItem } from '@/components/PhotoWall'
import Socials from '@/components/Socials'
import Tools from '@/components/Tools'
import { asset } from '@/lib/base'
import YouTube, { youTubeId } from '@/components/YouTube'
import { DocSide, docComponents, docFiles, headings } from '@/components/Doc'
import path from 'node:path'
import { PROJECTS_DIR } from '@/lib/projects'
import LangSwitch from '@/components/LangSwitch'
import { T } from '@/lib/i18n'

type Params = { params: Promise<{ slug: string }> }

// One page per project folder. (Needed for the static GitHub Pages build; harmless otherwise.)
export function generateStaticParams() {
  return getProjects().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug)
  return p ? { title: `${p.title} | ${me.name}`, description: p.summary } : { title: 'Project not found' }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()

  const all = getProjects()
  const i = all.findIndex(x => x.slug === p.slug)
  const prev = i > 0 ? all[i - 1] : null
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null

  const catAr = categories.find(c => c.id === p.category)?.ar
  const items: WallItem[] = p.photos.map(ph => ({ kind: 'photo', key: ph.src, src: ph.src, caption: ph.caption, captionAr: p.ar?.captions[ph.file] }))

  const hasVideo = !!(p.links.youtube && youTubeId(p.links.youtube))
  // The write-up is the project's full documentation: photos, videos, code and files from its folder (see components/Doc.tsx).
  const dir = path.join(PROJECTS_DIR, p.slug)
  const base = asset(`/media/projects/${p.slug}`)
  const mdxComponents = docComponents(dir, base, p.title)
  const files = docFiles(dir, base)

  return (
    <>
      <nav className="nav" aria-label="Project navigation">
        <Link href="/"><T en="Back to the scrapbook" ar="العودة إلى الصفحة الرئيسية" /></Link>
        <Link href="/#projects"><T en="All projects" ar="كل المشاريع" /></Link>
        <LangSwitch />
      </nav>

      <main className="collage detail">
        <article className="tile name">
          <span className="m"><T en={`${p.categoryLabel}, ${p.status}, ${p.year}`} ar={p.ar && `${catAr?.label}، ${p.ar.status || p.status}، ${p.year}`} /></span>
          <h1><T en={p.title} ar={p.ar?.title} /></h1>
          <p><T en={p.summary} ar={p.ar?.summary} /></p>
        </article>

        <figure className="tile herophoto">
          {p.cover.src && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.cover.src} alt={p.title} />}
          <figcaption>{p.cover.stock ? <T en="Stock photo. Add cover.jpg to this project folder to replace it." ar="صورة جاهزة. أضف cover.jpg إلى مجلد المشروع لاستبدالها." /> : <T en={p.title} ar={p.ar?.title} />}</figcaption>
        </figure>

        <section className="tile facts" aria-label="Project facts">
          <h2><T en="The numbers" ar="الأرقام" /></h2>
          <dl>{Object.entries(p.metrics).map(([k, v], i) => <div key={k}><dt><T en={k} ar={p.ar && Object.keys(p.ar.metrics)[i]} /></dt><dd><T en={v} ar={p.ar && Object.values(p.ar.metrics)[i]} /></dd></div>)}</dl>
          <p className="result"><T en={<><b>Result:</b> {p.result}</>} ar={p.ar && <><b>النتيجة:</b> {p.ar.result}</>} /></p>
        </section>

        <article className="tile writeup">
          <T as="div" en={<MDXRemote source={p.body} components={mdxComponents} />} ar={p.arBody && <MDXRemote source={p.arBody} components={mdxComponents} />} />
        </article>

        <aside className="side">
          <div className="sidestick">
          <DocSide toc={headings(p.body)} tocAr={p.arBody ? headings(p.arBody) : undefined} files={files} />
          {hasVideo && (
            <div className="tile videotile"><h2><T en="Watch it work" ar="شاهده يعمل" /></h2><YouTube url={p.links.youtube!} title={`${p.title} video`} /></div>
          )}
          <div className="tile sourcetile">
            <h2><T en="Source and links" ar="المصدر والروابط" /></h2>
            {p.links.github || p.links.youtube || p.links.website ? (
              <Socials big items={[{ label: 'GitHub', href: p.links.github, icon: 'github' }, { label: 'YouTube', href: p.links.youtube, icon: 'youtube' }, { label: 'Website', href: p.links.website, icon: 'web' }]} />
            ) : (
              <p><T en={<>No links yet. Add <code>links.github</code> or <code>links.youtube</code> to this project&apos;s index.mdx.</>} ar="لا توجد روابط بعد." /></p>
            )}
            <h3><T en="Built with" ar="المستخدم في البناء" /></h3>
            <Tools big names={p.stack} />
          </div>
          <blockquote lang="ar" dir="rtl" className="tile quote">ما أجمل الانشغال بالنَّفسِ<br />وتَركُ الأنفُس</blockquote>
          </div>
        </aside>

        {items.length > 0 && (
          <>
            <h2 className="sectionhead"><T en="Photos" ar="الصور" /></h2>
            <div className="photos"><PhotoWall items={items} /></div>
          </>
        )}

        <div className="pager">
          {prev ? <Link className="tile pagetile" href={`/projects/${prev.slug}`}><small><T en="Previous" ar="السابق" /></small><T en={prev.title} ar={prev.ar?.title} /></Link> : <span />}
          {next ? <Link className="tile pagetile" href={`/projects/${next.slug}`}><small><T en="Next" ar="التالي" /></small><T en={next.title} ar={next.ar?.title} /></Link> : <span />}
        </div>
      </main>
    </>
  )
}
