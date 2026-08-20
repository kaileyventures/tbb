'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/tbb') || pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="flex-grow min-h-screen bg-[#0b0f19]">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
