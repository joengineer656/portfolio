import Link from 'next/link'
import type { Lesson } from '@/lib/lessons'
import { T } from '@/lib/i18n'

// Taped cards linking to lessons. Used on the home page (latest few) and on /lessons (all).
export default function LessonCards({ lessons }: { lessons: Lesson[] }) {
  if (!lessons.length) return <p className="tile lessoncard"><T en={<>No lessons yet. Add a folder in <code>content/lessons/</code>.</>} ar="لا توجد دروس بعد." /></p>
  return (
    <div className="lessons">
      {lessons.map(l => (
        <Link key={l.slug} className="tile lessoncard" href={`/lessons/${l.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {l.cover && <img src={l.cover} alt="" loading="lazy" />}
          <span className="when"><T en={l.when} ar={l.ar?.when} /></span>
          <h3><T en={l.title} ar={l.ar?.title} /></h3>
          <p><T en={l.summary} ar={l.ar?.summary} /></p>
          {l.tags.length > 0 && <ul className="stackchips">{l.tags.map(t => <li key={t}>{t}</li>)}</ul>}
        </Link>
      ))}
    </div>
  )
}
