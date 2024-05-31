'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NextUIProvider } from '@nextui-org/react'

import '../styles/_main.scss'
import { Toaster } from '@/components/ui/sonner'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 0,
          },
        },
      }),
  )

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Plumera | Accueil</title>
        <meta
          name="description"
          content="Invoicer.ia est un outil de facturation en ligne pour les auto-entrepreneurs."
        />
        <meta
          name="keywords"
          content="facturation, auto-entrepreneur, freelance, facture, devis, comptabilité"
        />
        <meta name="author" content="Invoicer.ia" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main className="c-layout">
          <NextUIProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <Toaster />
              <ReactQueryDevtools initialIsOpen />
            </QueryClientProvider>
          </NextUIProvider>
        </main>
      </body>
      <script
        defer
        data-domain="app.plumera.fr"
        src="https://plausible-analytics-production-3969.up.railway.app/js/script.js"
      ></script>
    </html>
  )
}

export default RootLayout
