import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ThemeProvider } from 'next-themes'

import Footer from '@/components/ui/Footer'
import { NavbarLanding } from '@/components/try/NavbarLanding'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Service Booking App',
  description: 'Book services with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen ">
            <NavbarLanding/>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

