'use client'
import { useState } from 'react'
import Lightbox, { type ZoomPhoto } from './Lightbox'

export type MomentView = {
  slug: string; title: string; kind: string; when: string; place: string; text: string
  photo: string | null; stock: boolean; credit?: ZoomPhoto['credit']
}

const KIND_TONE: Record<string, string> = { workshop: 'k0', challenge: 'k1', event: 'k2' }

// A wall of polaroids, each with a small caption: what it was, when, where, and a few words about it.
export default function Moments({ items, slots }: { items: MomentView[]; slots: { key: string; hint: string }[] }) {
  const [zoom, setZoom] = useState<ZoomPhoto | null>(null)
  return (
    <>
      <div className="moments">
        {items.map((m, i) => (
          <article key={m.slug} className="polaroid moment" style={{ ['--r' as string]: `${(i % 2 ? 1 : -1) * (0.8 + (i % 3) * 0.7)}deg` }}>
            {m.photo && (
              <button type="button" className="zoom" onClick={() => setZoom({ src: m.photo!, caption: `${m.title}. ${m.text}`, credit: m.credit })} aria-label={`Enlarge: ${m.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo} alt={m.title} loading="lazy" />
              </button>
            )}
            <div className="mbody">
              <span className={`kind ${KIND_TONE[m.kind.toLowerCase()] ?? 'k3'}`}>{m.kind}</span>
              <h3>{m.title}</h3>
              <p className="when">{[m.when, m.place].filter(Boolean).join(', ')}</p>
              <p className="text">{m.text}</p>
              {m.stock && <small className="stocknote">Stock photo</small>}
            </div>
          </article>
        ))}
        {slots.map((s, i) => (
          <div key={s.key} className="polaroid slot" style={{ ['--r' as string]: `${(i % 2 ? 1 : -1) * 1.4}deg` }}>
            <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="14" width="36" height="24" rx="3" /><circle cx="24" cy="26" r="7" /><path d="M16 14l3-5h10l3 5" /></svg>
            <strong>Your next workshop or challenge</strong>
            <code>{s.hint}</code>
          </div>
        ))}
      </div>
      <Lightbox photo={zoom} onClose={() => setZoom(null)} />
    </>
  )
}
