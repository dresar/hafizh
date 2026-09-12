import React from 'react';
import { PublicNavbar } from '@/components/public/navbar';
import { PublicFooter } from '@/components/public/footer';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-slate-700 selection:text-white relative">
      <AnimatedBackground />
      <div className="relative z-10 flex-1 flex flex-col">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
      <FloatingActionButton />
    </div>
  );
}
