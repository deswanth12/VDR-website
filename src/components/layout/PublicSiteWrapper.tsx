// src/components/layout/PublicSiteWrapper.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileStickyDock from './MobileStickyDock';
import CompareBar from '@/components/products/CompareBar';
import AssistantEntryPill from '@/components/common/AssistantEntryPill';

export default function PublicSiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="flex-1 min-w-0 max-w-full">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileStickyDock />
      <CompareBar />
      <AssistantEntryPill />
    </>
  );
}
