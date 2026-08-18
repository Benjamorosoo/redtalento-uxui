import type { Metadata } from 'next'
import Script from 'next/script'
import '@/styles/globals.css'
import { RootNavWrapper } from '@/components/layout/RootNavWrapper'
import { CeibboDecor } from '@/components/ui/CeibboDecor'

const GA_TRACKING_ID = 'G-WBQYX05G9J'

export const metadata: Metadata = {
  title: {
    default: 'Ceibbo',
    template: '%s | Ceibbo',
  },
  description: 'La red profesional para talento técnico. Conecta estudiantes, colegios y empresas.',
  keywords: ['talento técnico', 'pasantías', 'prácticas', 'colegio técnico profesional', 'empleabilidad'],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-primary focus:text-on-primary focus:text-sm focus:font-bold focus:shadow-elevated"
        >
          Saltar al contenido principal
        </a>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        <CeibboDecor />
        <RootNavWrapper />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  )
}
