'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VIcon } from '@/components/ui/v-icon';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actionItems = [
    {
      id: 'whatsapp',
      label: 'Chat WhatsApp',
      icon: 'fa-brands fa-whatsapp',
      href: 'https://wa.me/6282273187213?text=Halo%20Hafizh%2C%20saya%20tertarik%20dengan%20portofolio%20Anda',
      target: '_blank',
      color: 'hover:border-emerald-500/50 hover:text-emerald-400',
    },
    {
      id: 'cv',
      label: 'Unduh / Lihat CV',
      icon: 'fa-solid fa-file-arrow-down',
      href: '/cv',
      target: '_blank',
      color: 'hover:border-blue-500/50 hover:text-blue-400',
    },
    {
      id: 'email',
      label: 'Kirim Email',
      icon: 'fa-solid fa-envelope',
      href: 'mailto:alhafizhfauzan5@gmail.com?subject=Pertanyaan%20Proyek%20Portofolio',
      target: '_blank',
      color: 'hover:border-slate-400 hover:text-slate-200',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15, delay: idx * 0.04 }}
                className="group flex items-center gap-3 no-underline"
              >
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-800 shadow-lg shadow-black/50 backdrop-blur-md transition-colors group-hover:text-white group-hover:border-slate-700">
                  {item.label}
                </span>
                <div
                  className={`w-10 h-10 rounded-lg bg-slate-900/95 border border-slate-800 text-slate-300 flex items-center justify-center shadow-xl shadow-black/60 backdrop-blur-md transition-all duration-200 group-hover:scale-105 active:scale-95 ${item.color}`}
                >
                  <VIcon name={item.icon} className="w-4 h-4" />
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
                transition={{ duration: 0.15, delay: actionItems.length * 0.04 }}
                className="group flex items-center gap-3 cursor-pointer"
              >
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-800 shadow-lg shadow-black/50 backdrop-blur-md transition-colors group-hover:text-white group-hover:border-slate-700">
                  Kembali ke Atas
                </span>
                <div className="w-10 h-10 rounded-lg bg-slate-900/95 border border-slate-800 text-slate-300 flex items-center justify-center shadow-xl shadow-black/60 backdrop-blur-md transition-all duration-200 group-hover:scale-105 group-hover:border-slate-600 group-hover:text-white active:scale-95">
                  <VIcon name="fa-solid fa-arrow-up" className="w-4 h-4" />
                </div>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Aksi Cepat Portofolio"
        className="relative group w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-300 hover:border-slate-500 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-slate-800/40 to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 flex items-center justify-center"
        >
          {isOpen ? (
            <VIcon name="fa-solid fa-xmark" className="w-5 h-5 text-slate-200" />
          ) : (
            <VIcon name="fa-solid fa-bolt" className="w-5 h-5 text-slate-200 group-hover:text-white" />
          )}
        </motion.div>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950" />
        )}
      </button>
    </div>
  );
}
