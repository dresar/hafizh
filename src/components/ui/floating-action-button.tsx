'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VIcon } from '@/components/ui/v-icon';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const actionItems = [
    {
      id: 'whatsapp',
      label: 'Chat WhatsApp',
      icon: 'fa-brands fa-whatsapp',
      href: 'https://wa.me/6285363520813?text=Halo%20Hafizh%2C%20saya%20tertarik%20dengan%20portofolio%20Anda',
      target: '_blank',
      color: 'hover:border-emerald-500/60 hover:text-emerald-400 active:border-emerald-500/60 active:text-emerald-400',
    },
    {
      id: 'cv',
      label: 'Unduh / Lihat CV',
      icon: 'fa-solid fa-file-arrow-down',
      href: '/cv',
      target: '_blank',
      color: 'hover:border-blue-500/60 hover:text-blue-400 active:border-blue-500/60 active:text-blue-400',
    },
    {
      id: 'email',
      label: 'Kirim Email',
      icon: 'fa-solid fa-envelope',
      href: 'mailto:fauzanalhafiz1007@gmail.com?subject=Pertanyaan%20Proyek%20Portofolio',
      target: '_blank',
      color: 'hover:border-slate-400 hover:text-slate-200 active:border-slate-400 active:text-slate-200',
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3 select-none pointer-events-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-end gap-2.5 mb-1"
            >
              {actionItems.map((item, idx) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  target={item.target}
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15, delay: idx * 0.03 }}
                  className="group flex items-center gap-2.5 no-underline active:scale-95 transition-transform"
                >
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/95 text-slate-200 border border-slate-700/90 shadow-xl shadow-black/60 backdrop-blur-md transition-colors group-hover:text-white group-hover:border-slate-500">
                    {item.label}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-200 flex items-center justify-center shadow-xl shadow-black/70 backdrop-blur-md transition-all duration-200 group-hover:scale-105 active:scale-90 ${item.color}`}
                  >
                    <VIcon name={item.icon} className="w-4 h-4 pointer-events-none" />
                  </div>
                </motion.a>
              ))}

              {showBackToTop && (
                <motion.button
                  type="button"
                  onClick={scrollToTop}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15, delay: actionItems.length * 0.03 }}
                  className="group flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/95 text-slate-200 border border-slate-700/90 shadow-xl shadow-black/60 backdrop-blur-md transition-colors group-hover:text-white group-hover:border-slate-500">
                    Kembali ke Atas
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-200 flex items-center justify-center shadow-xl shadow-black/70 backdrop-blur-md transition-all duration-200 group-hover:scale-105 group-hover:border-slate-500 group-hover:text-white active:scale-90">
                    <VIcon name="fa-solid fa-arrow-up" className="w-4 h-4 pointer-events-none" />
                  </div>
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Aksi Cepat Portofolio"
          className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center shadow-2xl shadow-black/90 backdrop-blur-xl transition-all duration-200 hover:border-slate-500 active:scale-90 cursor-pointer touch-manipulation"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-800/60 to-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex items-center justify-center pointer-events-none"
          >
            {isOpen ? (
              <VIcon name="fa-solid fa-xmark" className="w-5 h-5 text-slate-200" />
            ) : (
              <VIcon name="fa-solid fa-bolt" className="w-5 h-5 text-slate-200 group-hover:text-white" />
            )}
          </motion.div>
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-950 pointer-events-none" />
          )}
        </button>
      </div>
    </>
  );
}
