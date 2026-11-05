import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abdallah Alreba (Jo Engineer): mechatronics & robotics engineer',
  description: 'Portfolio of Abdallah Alreba: robots, boards, firmware and the notes behind them.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Courier+Prime:wght@400;700&family=Permanent+Marker&family=Cairo:wght@400;700&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('lang')==='ar'){var h=document.documentElement;h.lang='ar';h.dir='rtl'}}catch(e){}" }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
