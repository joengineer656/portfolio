'use client'
import { useEffect, useRef, useState } from 'react'
import ProjectTile from './ProjectTile'

type P = {
  slug: string; title: string; category: string; categoryLabel: string; status: string; year: number; summary: string
  cover: { src: string; stock: boolean }; metrics: Record<string, string>; links: { github?: string; youtube?: string }
}
type Cat = { id: string; label: string; blurb: string }

// Which skills list (content/site.ts) belongs to which category.
const SKILL_KEY: Record<string, string> = { robotics: 'Robotics', embedded: 'Embedded', 'software-ai': 'Software / AI', cad: 'CAD' }

// One category's projects on a single horizontal line. More than fit? Scroll sideways or use the arrows.
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setMore(el.scrollWidth > el.clientWidth + 4)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <div className="rowwrap">
      {more && <button type="button" className="arrow prev" aria-label={`Scroll ${label} left`} onClick={() => go(-1)}>&#8249;</button>}
      <div className="cards" ref={ref} tabIndex={0} role="group" aria-label={`${label} projects`}>{children}</div>
      {more && <button type="button" className="arrow next" aria-label={`Scroll ${label} right`} onClick={() => go(1)}>&#8250;</button>}
    </div>
  )
}

export default function ProjectBoard({ cats, projects, skills }: { cats: Cat[]; projects: P[]; skills: Record<string, string[]> }) {
  const [filter, setFilter] = useState('all')
  const groups = cats.map(c => ({ ...c, items: projects.filter(p => p.category === c.id) })).filter(g => g.items.length && (filter === 'all' || g.id === filter))
  return (
    <>
      <div className="filters" role="group" aria-label="Project categories">
        {[{ id: 'all', label: 'All projects' }, ...cats.filter(c => projects.some(p => p.category === c.id))].map(c => (
          <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>
      {groups.map(g => (
        <section key={g.id} className="group" id={`projects-${g.id}`} aria-labelledby={`g-${g.id}`}>
          <div className="grouphead">
            <h3 id={`g-${g.id}`}>{g.label}</h3>
            <p>{g.blurb}</p>
            <ul className="skillchips">{(skills[SKILL_KEY[g.id]] ?? []).map(t => <li key={t}>{t}</li>)}</ul>
            <span className="count">{g.items.length} {g.items.length === 1 ? 'project' : 'projects'}</span>
          </div>
          <Row label={g.label}>
            {g.items.map((p, i) => (
              <ProjectTile key={p.slug} tone={i % 4} slug={p.slug} title={p.title} category={p.categoryLabel} status={p.status} year={p.year}
                summary={p.summary} photo={p.cover.src} stock={p.cover.stock} github={p.links.github} youtube={p.links.youtube} metrics={p.metrics} />
            ))}
          </Row>
        </section>
      ))}
    </>
  )
}
