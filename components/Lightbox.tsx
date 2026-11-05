'use client'
import { useEffect, useRef } from 'react'
import { T } from '@/lib/i18n'

export type ZoomPhoto = { src: string; caption: string; credit?: { author: string; license: string; source: string } }

// A native <dialog> that shows one photo large. Used by the photo board and the project pages.
export default function Lightbox({ photo, onClose }: { photo: ZoomPhoto | null; onClose: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (photo && !d.open) d.showModal()
    if (!photo && d.open) d.close()
  }, [photo])

  return (
    <dialog ref={dlg} className="lightbox" onClose={onClose} onClick={e => e.target === dlg.current && onClose()}>
      {photo && (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt={photo.caption} />
          <figcaption>
            {photo.caption}
            {photo.credit && (
              <small><T en="Photo by" ar="تصوير" /> {photo.credit.author}, {photo.credit.license}. <a href={photo.credit.source} target="_blank" rel="noreferrer"><T en="Source" ar="المصدر" /></a></small>
            )}
          </figcaption>
          <button type="button" onClick={onClose}><T en="Close" ar="إغلاق" /></button>
        </figure>
      )}
    </dialog>
  )
}
