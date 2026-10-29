// When the site is published on GitHub Pages it lives under /portfolio, so image paths need that prefix.
// Locally the prefix is empty. (Links made with next/link get the prefix automatically.)
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${p}`
