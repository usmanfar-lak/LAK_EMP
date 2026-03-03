import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lakarya ESS',
  description: 'Lakarya Employee Self Service',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
