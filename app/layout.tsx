import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SiteProvider } from '@/context/SiteContext'

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair'
})

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
})

// Advanced SEO and Favicon Metadata
export const metadata: Metadata = {
  title: 'The Baker Bro | Handcrafted Premium Cakes & Pastries',
  description: 'Baking memories since 2017. Jalandhar\'s elite destination for 100% eggless custom cakes, luxury pastries, and gourmet breads, baked by Chef Gurdeep (Ex-Radisson).',
  icons: {
    icon: 'https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png',
    apple: 'https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png',
  },
  openGraph: {
    title: 'The Baker Bro - Premium Handcrafted Cakes',
    description: 'Order 100% eggless gourmet cakes & pastries handcrafted by ex-Radisson Chef Gurdeep. Delivery in Jalandhar.',
    images: ['https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png'],
    type: 'website',
  }
}

import LayoutShell from '@/components/LayoutShell'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-sans antialiased selection:bg-brand-plum/10 selection:text-brand-plum-dark">
        {/* Luxury Background Ambient elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6F0] via-[#FAF6F0] to-[#F3EDE2]"></div>
          
          {/* Elegant gold mesh pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#D9B382_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          {/* Animated luxury background blobs */}
          <div className="absolute top-[-15%] left-[-10%] w-[45rem] h-[45rem] bg-brand-plum/5 rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] bg-accent-gold/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '-3s' }}></div>
          <div className="absolute top-[40%] left-[60%] w-[25rem] h-[25rem] bg-accent-gold/5 rounded-full blur-3xl float-animation" style={{ animationDelay: '-1.5s' }}></div>
        </div>
        
        {/* Main App Layout */}
        <SiteProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <LayoutShell>{children}</LayoutShell>
          </div>
        </SiteProvider>
      </body>
    </html>
  )
}