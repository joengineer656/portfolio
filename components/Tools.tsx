import { toolImage } from '@/lib/tools'

// Tools and technologies as small logo stickers. The name shows on hover and on keyboard focus.
export default function Tools({ names, big = false }: { names: string[]; big?: boolean }) {
  return (
    <ul className={`tools${big ? ' big' : ''}`}>
      {names.map((name, i) => {
        const src = toolImage(name)
        return (
          <li key={name} className="tool" tabIndex={0} data-name={name} style={{ ['--r' as string]: `${i % 2 ? 2 : -2}deg` }}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={name} loading="lazy" />
            ) : (
              <span className="monogram" role="img" aria-label={name}>{name.slice(0, 2)}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
