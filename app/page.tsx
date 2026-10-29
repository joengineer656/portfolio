import { me, skills, categories, stockCredits } from '@/content/site'
import { getMoments } from '@/lib/moments'
import { getProjects } from '@/lib/projects'
import Socials from '@/components/Socials'
import { asset } from '@/lib/base'
import ProjectBoard from '@/components/ProjectBoard'
import Moments from '@/components/Moments'

export default function Home() {
  const projects = getProjects()
  const moments = getMoments()
  // Fill the last row of the moments wall with "your photo here" places (at least one), 4 per row.
  const slotCount = Math.max(1, (4 - (moments.length % 4)) % 4)
  const slots = Array.from({ length: slotCount }, (_, n) => ({ key: `slot-${n}`, hint: `content/moments/<name>/photo.jpg` }))
  const hero = asset('/photos/stock/ur-arm.jpg')
  const heroCredit = stockCredits.find(c => c.slug === 'ur-arm')

  return (
    <>
      <nav className="nav" aria-label="Sections">
        <a href="#projects">Projects</a><a href="#workshops">Workshops</a><a href="#toolbox">Toolbox</a><a href="#contact">Contact</a>
      </nav>

      <main className="collage">
        <article className="tile name">
          <h1>{me.name}</h1>
          <p>{me.handle}. {me.tagline}</p>
        </article>

        <figure className="tile herophoto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="Collaborative robot arm on a workbench" />
          <figcaption>Stock photo{heroCredit ? `: ${heroCredit.author}, ${heroCredit.license}` : ''}. Replace with your best build.</figcaption>
        </figure>

        <article className="tile role"><h2>Who I am</h2><p>{me.about}</p></article>
        <article className="tile now"><h2>On the bench today</h2><ul>{me.now.map(n => <li key={n}>{n}</li>)}</ul></article>

        <h2 className="sectionhead" id="projects">Projects</h2>
        <div className="projects">
          <ProjectBoard cats={[...categories]} projects={projects} skills={skills} />
        </div>

        <h2 className="sectionhead" id="workshops">Workshops &amp; challenges</h2>
        <div className="photos">
          <Moments items={moments.map(m => ({ slug: m.slug, title: m.title, kind: m.kind, when: m.when, place: m.place, text: m.text, photo: m.photo?.src ?? null, stock: !!m.photo?.stock, credit: m.photo?.credit }))} slots={slots} />
        </div>

        <article className="tile skills" id="toolbox">
          <h2>Toolbox</h2>
          {Object.entries(skills).map(([k, v]) => <p key={k}><b>{k}:</b> {v.join(', ')}</p>)}
        </article>
        <article className="tile mail" id="contact">
          <h2>Say hello</h2>
          <a className="email" href={`mailto:${me.email}`}>{me.email}</a>
          <Socials items={[{ label: 'GitHub', href: me.social.github, icon: 'github' }, { label: 'LinkedIn', href: me.social.linkedin, icon: 'linkedin' }, { label: 'YouTube', href: me.social.youtube, icon: 'youtube' }]} />
        </article>
      </main>
    </>
  )
}
