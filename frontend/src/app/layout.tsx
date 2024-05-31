'use client'

import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NextUIProvider } from '@nextui-org/react'

import '../styles/_main.scss'
import { Toaster } from '@/components/ui/sonner'

declare global {
  interface Window {
    fbq: any
  }
}

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

  useEffect(() => {
    ;(function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      t = b.createElement(e)
      t.async = true
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
      null,
      null,
      null,
    )

    window.fbq('init', '1541959706676239')
    window.fbq('track', 'PageView')
  }, [])

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
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1541959706676239&ev=PageView&noscript=1"
        />
      </noscript>
    </html>
  )
}

export default RootLayout
