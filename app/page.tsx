import { me, skills, skillsAr, categories, stockCredits } from '@/content/site'
import { T } from '@/lib/i18n'
import LangSwitch from '@/components/LangSwitch'
import { getMoments } from '@/lib/moments'
import { getProjects } from '@/lib/projects'
import Socials from '@/components/Socials'
import { asset } from '@/lib/base'
import ProjectBoard from '@/components/ProjectBoard'
import Moments from '@/components/Moments'
import LessonCards from '@/components/LessonCards'
import { getLessons } from '@/lib/lessons'
import Link from 'next/link'

export default function Home() {
  const projects = getProjects()
  const moments = getMoments()
  const lessons = getLessons()
  // Fill the last row of the moments wall with "your photo here" places (at least one), 4 per row.
  const slotCount = Math.max(1, (4 - (moments.length % 4)) % 4)
  const slots = Array.from({ length: slotCount }, (_, n) => ({ key: `slot-${n}`, hint: `content/moments/<name>/photo.jpg` }))
  const hero = asset('/photos/stock/ur-arm.jpg')
  const heroCredit = stockCredits.find(c => c.slug === 'ur-arm')

  return (
    <>
      <nav className="nav" aria-label="Sections">
        <a href="#projects"><T en="Projects" ar="المشاريع" /></a><a href="#workshops"><T en="Workshops" ar="الورش" /></a><a href="#lessons"><T en="Lessons" ar="الدروس" /></a><a href="#toolbox"><T en="Toolbox" ar="الأدوات" /></a><a href="#contact"><T en="Contact" ar="تواصل" /></a>
        <LangSwitch />
      </nav>

      <main className="collage">
        <article className="tile name">
          <h1>{me.name}</h1>
          <p>{me.handle}. <T en={me.tagline} ar={me.ar.tagline} /></p>
        </article>

        <figure className="tile herophoto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="Collaborative robot arm on a workbench" />
          <figcaption><T en={`Stock photo${heroCredit ? `: ${heroCredit.author}, ${heroCredit.license}` : ''}. Replace with your best build.`} ar={`صورة جاهزة${heroCredit ? `: ${heroCredit.author}, ${heroCredit.license}` : ''}. استبدلها بأفضل مشروع لديك.`} /></figcaption>
        </figure>

        <article className="tile role"><h2><T en="Who I am" ar="من أنا" /></h2><p><T en={me.about} ar={me.ar.about} /></p></article>
        <article className="tile now"><h2><T en="On the bench today" ar="على الطاولة اليوم" /></h2><ul>{me.now.map((n, i) => <li key={n}><T en={n} ar={me.ar.now[i]} /></li>)}</ul></article>

        <h2 className="sectionhead" id="projects"><T en="Projects" ar="المشاريع" /></h2>
        <div className="projects">
          <ProjectBoard cats={[...categories]} projects={projects.map(({ body, arBody, photos, ...p }) => p)} skills={skills} />
        </div>

        <h2 className="sectionhead" id="workshops"><T en="Workshops & challenges" ar="الورش والتحديات" /></h2>
        <div className="photos">
          <Moments items={moments.map(m => ({ slug: m.slug, title: m.title, kind: m.kind, when: m.when, place: m.place, text: m.text, photo: m.photo?.src ?? null, stock: !!m.photo?.stock, credit: m.photo?.credit, ar: m.ar }))} slots={slots} />
        </div>

        <h2 className="sectionhead" id="lessons"><T en="Lessons" ar="الدروس" /></h2>
        <LessonCards lessons={lessons.slice(0, 4)} />
        {lessons.length > 4 && <Link className="tile pagetile alllessons" href="/lessons"><T en={`All ${lessons.length} lessons`} ar={`كل الدروس (${lessons.length})`} /></Link>}

        <article className="tile skills" id="toolbox">
          <h2><T en="Toolbox" ar="الأدوات" /></h2>
          {Object.entries(skills).map(([k, v]) => <p key={k}><b><T en={k} ar={skillsAr[k]} />:</b> {v.join(', ')}</p>)}
        </article>
        <article className="tile mail" id="contact">
          <h2><T en="Say hello" ar="قل مرحبًا" /></h2>
          <a className="email" href={`mailto:${me.email}`}>{me.email}</a>
          <Socials items={[{ label: 'GitHub', href: me.social.github, icon: 'github' }, { label: 'LinkedIn', href: me.social.linkedin, icon: 'linkedin' }, { label: 'YouTube', href: me.social.youtube, icon: 'youtube' }]} />
        </article>
      </main>
    </>
  )
}
