import { GitHubIcon, LinkedInIcon, YouTubeIcon, LinkIcon } from './Icons'

type Item = { label: string; href?: string; icon: 'github' | 'linkedin' | 'youtube' | 'web' }
const ICONS = { github: GitHubIcon, linkedin: LinkedInIcon, youtube: YouTubeIcon, web: LinkIcon }

// Sticker-style links. An empty href hides the sticker.
export default function Socials({ items, big = false }: { items: Item[]; big?: boolean }) {
  const shown = items.filter(i => i.href)
  if (!shown.length) return null
  return (
    <ul className={`social${big ? ' big' : ''}`}>
      {shown.map((i, n) => {
        const Icon = ICONS[i.icon]
        return (
          <li key={i.label} style={{ ['--r' as string]: `${n % 2 ? 2 : -2}deg` }}>
            <a href={i.href} target="_blank" rel="noreferrer"><Icon /><span>{i.label}</span></a>
          </li>
        )
      })}
    </ul>
  )
}
