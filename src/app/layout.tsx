`use client`
import type { Metadata } from 'next'
import { Providers } from '../components/providers'
import dynamic from 'next/dynamic'


export const metadata: Metadata = {
  title: 'Showpiece Tech Assessment',
  description: 'Generated by create next app',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({children} : RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Providers>
        <body suppressHydrationWarning={true}>
          {/*<SiteHeader />*/}
          <main>{children}</main>
        </body>
      </Providers>
    </html>
  )
}
