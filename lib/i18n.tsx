import type { ReactNode } from 'react'

// Both languages are rendered; CSS (globals.css) hides the one that is not active. This works in the
// static GitHub Pages build and in client components alike. No `ar` means the text is shown in every language.
export function T({ en, ar, as: Tag = 'span' }: { en: ReactNode; ar?: ReactNode; as?: 'span' | 'div' | 'li' }) {
  if (!ar) return <>{en}</>
  return (
    <>
      <Tag data-l="en">{en}</Tag>
      <Tag data-l="ar" lang="ar">{ar}</Tag>
    </>
  )
}

// Arabic overlay for a content file: index.ar.mdx / index.ar.md next to the English one.
export const arPath = (file: string) => file.replace(/\.(mdx?)$/, '.ar.$1')
