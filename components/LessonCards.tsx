import Link from 'next/link'
import type { Lesson } from '@/lib/lessons'

// Taped cards linking to lessons. Used on the home page (latest few) and on /lessons (all).
export default function LessonCards({ lessons }: { lessons: Lesson[] }) {
  if (!lessons.length) return <p className="tile lessoncard">No lessons yet. Add a folder in <code>content/lessons/</code>.</p>
  return (
    <div className="lessons">
      {lessons.map(l => (
        <Link key={l.slug} className="tile lessoncard" href={`/lessons/${l.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {l.cover && <img src={l.cover} alt="" loading="lazy" />}
          <span className="when">{l.when}</span>
          <h3>{l.title}</h3>
          <p>{l.summary}</p>
          {l.tags.length > 0 && <ul className="stackchips">{l.tags.map(t => <li key={t}>{t}</li>)}</ul>}
        </Link>
      ))}
    </div>
  )
}
