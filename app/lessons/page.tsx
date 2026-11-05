import type { Metadata } from 'next'
import Link from 'next/link'
import { getLessons } from '@/lib/lessons'
import { me } from '@/content/site'
import LessonCards from '@/components/LessonCards'
import LangSwitch from '@/components/LangSwitch'
import { T } from '@/lib/i18n'

export const metadata: Metadata = { title: `Lessons | ${me.name}`, description: 'How-tos, theory and tool tips from the bench.' }

export default function LessonsPage() {
  return (
    <>
      <nav className="nav" aria-label="Navigation">
        <Link href="/"><T en="Back to the scrapbook" ar="العودة إلى الصفحة الرئيسية" /></Link>
        <Link href="/#projects"><T en="Projects" ar="المشاريع" /></Link>
        <LangSwitch />
      </nav>
      <main className="collage detail">
        <article className="tile name">
          <h1><T en="Lessons" ar="الدروس" /></h1>
          <p><T en="How-tos, theory and tool tips from the bench. Project write-ups live on each project's page." ar="شروحات عملية ونظرية ونصائح للأدوات من ورشة العمل. تجد شرح كل مشروع في صفحته." /></p>
        </article>
        <LessonCards lessons={getLessons()} />
      </main>
    </>
  )
}
