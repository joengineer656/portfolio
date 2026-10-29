'use client'
import { useState } from 'react'
import Lightbox, { type ZoomPhoto } from './Lightbox'

export type WallItem =
  | { kind: 'photo'; key: string; src: string; caption: string; note?: string; credit?: ZoomPhoto['credit'] }
  | { kind: 'slot'; key: string; hint: string }

// A row-of-polaroids wall. Photos open in the lightbox, empty places are dashed "your photo here" slots.
export default function PhotoWall({ items }: { items: WallItem[] }) {
  const [zoom, setZoom] = useState<ZoomPhoto | null>(null)
  return (
    <>
      <div className="wall">
        {items.map((it, i) => {
          const r = `${(i % 2 ? 1 : -1) * (0.8 + (i % 3) * 0.7)}deg`
          return it.kind === 'slot' ? (
            <div key={it.key} className="polaroid slot" style={{ ['--r' as string]: r }}>
              <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="14" width="36" height="24" rx="3" /><circle cx="24" cy="26" r="7" /><path d="M16 14l3-5h10l3 5" /></svg>
              <strong>Your photo here</strong>
              <code>{it.hint}</code>
            </div>
          ) : (
            <figure key={it.key} className={`polaroid ${it.note ? 'stock' : 'mine'}`} style={{ ['--r' as string]: r }}>
              <button type="button" className="zoom" onClick={() => setZoom({ src: it.src, caption: it.caption, credit: it.credit })} aria-label={`Enlarge: ${it.caption}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={it.caption} loading="lazy" />
              </button>
              <figcaption>{it.caption}{it.note && <small>{it.note}</small>}</figcaption>
            </figure>
          )
        })}
      </div>
      <Lightbox photo={zoom} onClose={() => setZoom(null)} />
    </>
  )
}
