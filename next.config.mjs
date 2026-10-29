// Normal use (npm run dev / build / start): a regular Next.js site.
// GitHub Pages build (npm run build:pages): a fully static copy in ./out, served under /portfolio.
const pages = process.env.GITHUB_PAGES === 'true'
const basePath = pages ? '/portfolio' : ''

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  ...(pages ? { output: 'export', basePath, trailingSlash: true, images: { unoptimized: true } } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
}
