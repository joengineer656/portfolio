import type { Metadata } from 'next'
import Link from 'next/link'
import { getLessons } from '@/lib/lessons'
import { me } from '@/content/site'
import LessonCards from '@/components/LessonCards'

export const metadata: Metadata = { title: `Lessons | ${me.name}`, description: 'How-tos, theory and tool tips from the bench.' }

export default function LessonsPage() {
  return (
    <>
      <nav className="nav" aria-label="Navigation">
        <Link href="/">Back to the scrapbook</Link>
        <Link href="/#projects">Projects</Link>
      </nav>
      <main className="collage detail">
        <article className="tile name">
          <h1>Lessons</h1>
          <p>How-tos, theory and tool tips from the bench. Project write-ups live on each project&apos;s page.</p>
        </article>
        <LessonCards lessons={getLessons()} />
      </main>
    </>
  )
}
