import type React from 'react'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Vocalis — Voice to Speech Studio',
  description:
    'Turn any text into natural speech. Use free in-browser voices, or clone a voice from an uploaded sample.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#15181f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background font-sans antialiased">{children}</body>
    </html>
  )
}
