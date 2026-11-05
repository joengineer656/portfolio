import fs from 'node:fs'
import path from 'node:path'
import type { ReactNode } from 'react'
import Link from 'next/link'
import YouTube from './YouTube'
import { FILE_EXT, listFiles } from '@/lib/media'
import { T } from '@/lib/i18n'

// Everything a documentation page (project or lesson) can use inside its index.mdx:
//   <Photo file="01-wiring.jpg" caption="..." />   a photo from the same folder
//   <YouTube url="https://youtu.be/..." />          an embedded video
//   <Code file="balance.c" />                       a code file from the folder, shown in full + download
//   <File file="chassis.step" label="..." />        a download button
// Plus normal Markdown: ## headings (they build the table of contents), lists, ```code blocks```, links.

const slugify = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
const textOf = (n: ReactNode): string =>
  typeof n === 'string' || typeof n === 'number' ? String(n)
    : Array.isArray(n) ? n.map(textOf).join('')
      : n && typeof n === 'object' && 'props' in n ? textOf((n.props as { children?: ReactNode }).children) : ''

// The "## Heading" lines outside code fences, in order. The ids match the ones the h2s get below.
export function headings(body: string) {
  let fence = false
  return body.split('\n').flatMap(line => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence
    const m = !fence && line.match(/^##\s+(.+?)\s*#*$/)
    return m ? [{ id: slugify(m[1]), label: m[1].replace(/[*_`]/g, '') }] : []
  })
}

const size = (bytes: number) => (bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1048576).toFixed(1)} MB`)

// dir: the content folder on disk. base: the URL the media route serves that folder at.
export function docFiles(dir: string, base: string) {
  return listFiles(dir, FILE_EXT).map(file => ({ file, src: `${base}/${encodeURIComponent(file)}`, size: size(fs.statSync(path.join(dir, file)).size) }))
}

export function docComponents(dir: string, base: string, title: string) {
  // A typo in a file name stops the build with a clear message instead of shipping a broken link.
  const own = (file: string, ext: RegExp, tag: string) => {
    if (file !== path.basename(file) || !ext.test(file) || !fs.existsSync(path.join(dir, file)))
      throw new Error(`<${tag} file="${file}" />: no such file in ${path.relative(process.cwd(), dir)}/ (or its type is not allowed)`)
    return `${base}/${encodeURIComponent(file)}`
  }
  return {
    YouTube,
    // Links to other pages of this site ("/lessons/x") get the GitHub Pages prefix; outside links open in a new tab.
    a: ({ href = '', children }: { href?: string; children?: ReactNode }) =>
      href.startsWith('/') ? <Link href={href}>{children}</Link> : <a href={href} {...(/^https?:/.test(href) && { target: '_blank', rel: 'noreferrer' })}>{children}</a>,
    h2: ({ children }: { children?: ReactNode }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
    Photo: ({ file, caption }: { file: string; caption?: string }) => (
      <figure className="inline-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={own(file, /\.(jpe?g|png|webp|avif|gif)$/i, 'Photo')} alt={caption ?? title} loading="lazy" />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    ),
    File: ({ file, label }: { file: string; label?: string }) => (
      <a className="filebtn" href={own(file, FILE_EXT, 'File')} download>{label ?? file}</a>
    ),
    Code: ({ file }: { file: string }) => {
      const src = own(file, FILE_EXT, 'Code')
      return (
        <figure className="codefile">
          <figcaption><span>{file}</span><a href={src} download><T en="Download" ar="تنزيل" /></a></figcaption>
          <pre><code>{fs.readFileSync(path.join(dir, file), 'utf8')}</code></pre>
        </figure>
      )
    },
  }
}

// Side tiles: "On this page" and "Files". Each hides itself when there is nothing to show.
export function DocSide({ toc, tocAr, files }: { toc: { id: string; label: string }[]; tocAr?: { id: string; label: string }[]; files: ReturnType<typeof docFiles> }) {
  const list = (t: typeof toc) => <ol>{t.map(h => <li key={h.id}><a href={`#${h.id}`}>{h.label}</a></li>)}</ol>
  return (
    <>
      {toc.length > 1 && (
        <nav className="tile toctile" aria-label="On this page">
          <h2><T en="On this page" ar="في هذه الصفحة" /></h2>
          <T as="div" en={list(toc)} ar={tocAr && list(tocAr)} />
        </nav>
      )}
      {files.length > 0 && (
        <div className="tile filestile">
          <h2><T en="Files" ar="الملفات" /></h2>
          <ul>{files.map(f => <li key={f.file}><a href={f.src} download>{f.file}</a> <small>{f.size}</small></li>)}</ul>
        </div>
      )}
    </>
  )
}
