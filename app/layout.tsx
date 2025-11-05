import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Footer from '@/components/ui/Footer'
import { NavbarLanding } from '@/components/try/NavbarLanding'

const inter = Inter({ subsets: ['latin'] })

// PWA Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e40af' }, // blue-800
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },  // blue-900
  ],
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// Business-specific SEO metadata
export const metadata: Metadata = {
  title: {
    default: 'GRSWorker Business - Enterprise Staffing & Service Solutions',
    template: '%s | GRSWorker Business'
  },
  description: 'Streamline your business operations with GRSWorker Business. Get verified professionals, manage staffing, and scale your enterprise with our premium business solutions.',
  keywords: [
    'business staffing solutions',
    'enterprise service providers',
    'verified professionals business',
    'staff management platform',
    'business service booking',
    'enterprise workforce solutions',
    'GRSWorker business',
    'corporate service management'
  ],
  authors: [
    { name: 'Kaushalendra Singh', url: 'https://kaushalendra-portfolio.vercel.app/' },
    { name: 'Harsh Gupta' }
  ],
  creator: 'GRSWorker Business Team',
  publisher: 'GRSWorker Business',
  metadataBase: new URL('https://business.grsworker.com'),
  alternates: {
    canonical: '/',
  },
  // PWA Manifest
  manifest: '/manifest.json',
  // Icons for PWA
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GRSWorker Business',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://business.grsworker.com',
    siteName: 'GRSWorker Business',
    title: 'GRSWorker Business - Enterprise Staffing & Service Solutions',
    description: 'Streamline your business operations with verified professionals and enterprise-grade solutions.',
    images: [
      {
        url: '/business-og-image.png',
        width: 1200,
        height: 630,
        alt: 'GRSWorker Business - Enterprise Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@grsworker',
    creator: '@grsworker',
    title: 'GRSWorker Business - Enterprise Solutions',
    description: 'Premium business staffing and service management platform',
    images: ['/business-og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'business services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* PWA Links */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="GRSWorker Business" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GRSWorker Business" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Icons */}
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Structured Data for Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GRSWorker Business',
              description: 'Enterprise staffing and service management platform',
              url: 'https://business.grsworker.com',
              logo: 'https://business.grsworker.com/icons/icon-512x512.png',
              telephone: '+91-9555602536',
              email: 'business@grsworker.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Delhi',
                addressRegion: 'Delhi NCR',
                addressCountry: 'IN'
              },
              areaServed: 'India',
              serviceType: [
                'Business Staffing',
                'Enterprise Services', 
                'Professional Workforce',
                'Service Management'
              ],
              offers: {
                '@type': 'Service',
                name: 'Business Staffing Solutions'
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen">
            <NavbarLanding/>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('Business SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('Business SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}