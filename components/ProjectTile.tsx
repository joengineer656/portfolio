import Link from 'next/link'
import { GitHubIcon, YouTubeIcon } from './Icons'

type Props = {
  slug: string; title: string; category: string; status: string; year: number; summary: string
  photo: string; stock: boolean; tone: number; github?: string; youtube?: string; metrics?: Record<string, string>
}

// A compact project clipping: photo, title, two lines of summary, source icons and a link to the full page.
export default function ProjectTile(p: Props) {
  const numbers = Object.entries(p.metrics ?? {}).slice(0, 3)
  return (
    <article className={`tile proj tone${p.tone}`}>
      <span className="m">{p.status}, {p.year}</span>
      <h3><Link href={`/projects/${p.slug}`}>{p.title}</Link></h3>
      <figure className="shot">
        {p.photo && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.photo} alt={p.title} loading="lazy" />}
        {p.stock && <figcaption>Stock photo</figcaption>}
        {numbers.length > 0 && (
          <dl className="numbers" aria-label="Key numbers">
            {numbers.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        )}
      </figure>
      <p>{p.summary}</p>
      <div className="actions">
        {p.github && <a className="src" href={p.github} target="_blank" rel="noreferrer" aria-label={`${p.title}: source code on GitHub`} title="Source code on GitHub"><GitHubIcon /></a>}
        {p.youtube && <a className="src" href={p.youtube} target="_blank" rel="noreferrer" aria-label={`${p.title}: video on YouTube`} title="Video on YouTube"><YouTubeIcon /></a>}
        <Link className="more-link" href={`/projects/${p.slug}`}>Details</Link>
      </div>
    </article>
  )
}
