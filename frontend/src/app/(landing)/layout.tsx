import type { Metadata } from 'next'

import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Plumera | Language Learning',
  description: 'Facturez sans prise de tête',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={cn('flex min-h-screen flex-col font-sans antialiased')}>
        {children}
      </body>
    </html>
  )
}
