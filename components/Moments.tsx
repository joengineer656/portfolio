'use client'
import { useState } from 'react'
import Lightbox, { type ZoomPhoto } from './Lightbox'
import { T } from '@/lib/i18n'

export type MomentView = {
  slug: string; title: string; kind: string; when: string; place: string; text: string
  photo: string | null; stock: boolean; credit?: ZoomPhoto['credit']
  ar?: { title: string; kind: string; place: string; text: string; when: string }
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
              <button type="button" className="zoom" onClick={() => setZoom({ src: m.photo!, caption: document.documentElement.lang === 'ar' && m.ar ? `${m.ar.title}. ${m.ar.text}` : `${m.title}. ${m.text}`, credit: m.credit })} aria-label={`Enlarge: ${m.title} / تكبير`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo} alt={m.title} loading="lazy" />
              </button>
            )}
            <div className="mbody">
              <span className={`kind ${KIND_TONE[m.kind.toLowerCase()] ?? 'k3'}`}><T en={m.kind} ar={m.ar?.kind} /></span>
              <h3><T en={m.title} ar={m.ar?.title} /></h3>
              <p className="when"><T en={[m.when, m.place].filter(Boolean).join(', ')} ar={m.ar && [m.ar.when, m.ar.place].filter(Boolean).join('، ')} /></p>
              <p className="text"><T en={m.text} ar={m.ar?.text} /></p>
              {m.stock && <small className="stocknote"><T en="Stock photo" ar="صورة جاهزة" /></small>}
            </div>
          </article>
        ))}
        {slots.map((s, i) => (
          <div key={s.key} className="polaroid slot" style={{ ['--r' as string]: `${(i % 2 ? 1 : -1) * 1.4}deg` }}>
            <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="14" width="36" height="24" rx="3" /><circle cx="24" cy="26" r="7" /><path d="M16 14l3-5h10l3 5" /></svg>
            <strong><T en="Your next workshop or challenge" ar="ورشتك أو تحديك القادم" /></strong>
            <code>{s.hint}</code>
          </div>
        ))}
      </div>
      <Lightbox photo={zoom} onClose={() => setZoom(null)} />
    </>
  )
}
