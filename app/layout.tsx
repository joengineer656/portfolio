import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abdallah Alreba (Jo Engineer): mechatronics & robotics engineer',
  description: 'Portfolio of Abdallah Alreba: robots, boards, firmware and the notes behind them.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Courier+Prime:wght@400;700&family=Permanent+Marker&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  )
}
