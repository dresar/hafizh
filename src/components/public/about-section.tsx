'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Profile } from '@/db/schema';
import { VIcon } from '@/components/ui/v-icon';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { TiltCard } from '@/components/ui/tilt-card';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export function AboutSection({
  profile,
  projectCount,
  skillCount,
  certCount,
}: {
  profile: Profile | null;
  projectCount: number;
  skillCount: number;
  certCount: number;
}) {
  const bio =
    profile?.bio ||
    'Saya adalah seorang Software Engineer yang berfokus pada arsitektur web modern, keandalan performa basis data, dan antarmuka berpusat pada pengguna. Berkomitmen untuk menghasilkan kode bersih, type-safe, dan teruji secara menyeluruh.';

  return (
    <section id="about" className="py-24 border-t border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider"
          >
            <VIcon name="fa-solid fa-user" className="w-3.5 h-3.5 text-slate-400" />
            <span>Tentang Saya</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Profil & Filosofi Rekayasa
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Mengenal lebih dekat latar belakang profesional, standar integritas kode, dan kompetensi teknis saya.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <SpotlightCard className="p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <VIcon name="fa-solid fa-code" className="text-slate-300 w-4 h-4" />
                <span>Pengembangan Full-Stack Berstandar Tinggi</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {bio}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pendekatan saya terhadap rekayasa perangkat lunak mengutamakan struktur yang bersih, performa tinggi, modularitas komponen, dan pemanfaatan basis data relasional secara optimal melalui Neon PostgreSQL dan Drizzle ORM.
              </p>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <VIcon name="fa-solid fa-location-dot" className="text-slate-400 w-3.5 h-3.5" />
                  <span>Domisili: {profile?.location || 'Indonesia'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ShimmerButton
                    href="/cv"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon="fa-solid fa-file-pdf"
                    className="py-2 px-3 text-xs"
                  >
                    Lihat CV Online
                  </ShimmerButton>
                  <a
                    href="/cv-hafizh.pdf"
                    download="CV_Muhammad_Fauzan_Al_Hafizh.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all active:scale-95"
                  >
                    <VIcon name="fa-solid fa-download" className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unduh PDF</span>
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4"
          >
            <TiltCard maxRotation={4}>
              <SpotlightCard className="p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors">
                  <VIcon name="fa-solid fa-laptop-code" className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{projectCount}</div>
                  <div className="text-xs text-slate-400 font-medium">Proyek Terselesaikan</div>
                </div>
              </SpotlightCard>
            </TiltCard>

            <TiltCard maxRotation={4}>
              <SpotlightCard className="p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors">
                  <VIcon name="fa-solid fa-code" className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{skillCount}+</div>
                  <div className="text-xs text-slate-400 font-medium">Keahlian & Perkakas Teknis</div>
                </div>
              </SpotlightCard>
            </TiltCard>

            <TiltCard maxRotation={4}>
              <SpotlightCard className="p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors">
                  <VIcon name="fa-solid fa-certificate" className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{certCount}</div>
                  <div className="text-xs text-slate-400 font-medium">Sertifikasi Kompetensi</div>
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
