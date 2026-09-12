'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VIcon } from '@/components/ui/v-icon';
import { VBtn } from '@/components/ui/v-btn';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Tentang', href: '#about' },
  { label: 'Pendidikan', href: '#education' },
  { label: 'Keahlian', href: '#skills' },
  { label: 'Proyek', href: '#projects' },
  { label: 'Pengalaman', href: '#experience' },
  { label: 'Sertifikat', href: '#certificates' },
  { label: 'Kontak', href: '#contact' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 py-3.5 shadow-lg shadow-black/20'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Personal Brand */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              H
            </div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight group-hover:text-blue-400 transition-colors">
              Fauzan Al Hafizh
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                    isActive
                      ? 'text-white bg-blue-600 shadow-sm shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTA & Admin Link */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link href="/cv" title="Lihat Curriculum Vitae (CV)">
              <VBtn variant="tonal" size="sm" prependIcon="fa-solid fa-file-pdf" className="text-amber-400 border border-amber-500/30 hover:bg-amber-500/10">
                Lihat CV
              </VBtn>
            </Link>
            <a href="#contact">
              <VBtn variant="primary" size="sm" prependIcon="fa-solid fa-envelope">
                Hubungi Saya
              </VBtn>
            </a>
            <Link href="/admin/dashboard" title="Admin CMS Panel">
              <VBtn
                variant="outlined"
                size="sm"
                className="h-8 px-2.5 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-blue-400"
              >
                <VIcon name="fa-solid fa-user-gear" className="w-3.5 h-3.5" />
              </VBtn>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none cursor-pointer touch-manipulation active:scale-95 transition-transform"
              aria-label="Buka Menu"
            >
              <VIcon name="fa-solid fa-bars" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Vuetify-Style Mobile Slide-Over Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="fixed right-0 top-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    H
                  </div>
                  <span className="font-bold text-sm text-white">Menu Portofolio</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <VIcon name="fa-solid fa-xmark" className="w-4 h-4" />
                </button>
              </div>

              <nav className="mt-5 space-y-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={cn(
                        'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link href="/cv" onClick={() => setMobileDrawerOpen(false)} className="block w-full">
                <VBtn variant="tonal" size="md" className="w-full text-amber-400 border border-amber-500/30" prependIcon="fa-solid fa-file-pdf">
                  Lihat & Unduh CV
                </VBtn>
              </Link>
              <a href="#contact" onClick={() => setMobileDrawerOpen(false)} className="block w-full">
                <VBtn variant="primary" size="md" className="w-full" prependIcon="fa-solid fa-envelope">
                  Hubungi Saya
                </VBtn>
              </a>
              <Link href="/login" onClick={() => setMobileDrawerOpen(false)} className="block w-full">
                <VBtn variant="outlined" size="sm" className="w-full" prependIcon="fa-solid fa-user-gear">
                  Admin CMS Portal
                </VBtn>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
