import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Who's In Both?",
  description: 'See which cast members are in two of your favorite movies!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
