'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Profile } from '@/db/schema';
import { VBtn } from '@/components/ui/v-btn';
import { VIcon } from '@/components/ui/v-icon';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TiltCard } from '@/components/ui/tilt-card';

export function HeroSection({ profile }: { profile: Profile | null }) {
  const fullName = profile?.fullName || 'Muhammad Fauzan Al Hafizh';
  const headline = profile?.headline || 'Full-Stack Software Engineer';
  const bio =
    profile?.bio ||
    'Membangun aplikasi web modern, skalabel, dan berkinerja tinggi dengan arsitektur rekayasa perangkat lunak terstandarisasi.';

  const initialAvatar = profile?.avatarUrl || '/avatar.jpg';
  const [imgSrc, setImgSrc] = useState(initialAvatar);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-slate-800/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left space-y-6"
          >
            {profile?.isAvailable !== false && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 text-slate-300 text-xs font-semibold select-none backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tersedia untuk Pekerjaan / Kolaborasi Teknis</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
              >
                Halo, Saya <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent">
                  {fullName}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg sm:text-xl font-bold text-slate-300"
              >
                {headline}
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <ShimmerButton
                href="/cv"
                target="_blank"
                rel="noopener noreferrer"
                icon="fa-solid fa-file-pdf"
                className="py-3 px-6 text-xs sm:text-sm font-bold"
              >
                Lihat & Unduh CV
              </ShimmerButton>

              <a href="#projects">
                <VBtn variant="primary" size="lg" prependIcon="fa-solid fa-laptop-code" className="shadow-lg shadow-black/40">
                  Lihat Proyek
                </VBtn>
              </a>

              <a href="#contact">
                <VBtn variant="outlined" size="lg" prependIcon="fa-solid fa-envelope">
                  Hubungi Saya
                </VBtn>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-slate-400"
            >
              <span className="text-xs text-slate-500 font-semibold mr-1">Temukan Saya:</span>
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                  title="GitHub"
                >
                  <VIcon name="fa-brands fa-github" className="w-4 h-4" />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                  title="LinkedIn"
                >
                  <VIcon name="fa-brands fa-linkedin" className="w-4 h-4" />
                </a>
              )}
              {profile?.whatsappUrl && (
                <a
                  href={profile.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-emerald-400 hover:border-slate-700 transition-colors"
                  title="WhatsApp"
                >
                  <VIcon name="fa-brands fa-whatsapp" className="w-4 h-4" />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                  title="Email"
                >
                  <VIcon name="fa-solid fa-envelope" className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <TiltCard maxRotation={8} scale={1.03}>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl p-2.5 bg-slate-900/80 border border-slate-700/60 shadow-2xl shadow-black/80 backdrop-blur-md">
                {!imgFailed ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950">
                    <Image
                      src={imgSrc}
                      alt={fullName}
                      fill
                      sizes="(max-width: 640px) 256px, 320px"
                      className="object-cover"
                      priority
                      onError={() => {
                        if (imgSrc !== '/avatar.jpg') {
                          setImgSrc('/avatar.jpg');
                        } else {
                          setImgFailed(true);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-950 flex flex-col items-center justify-center text-slate-500">
                    <VIcon name="fa-solid fa-user" className="w-24 h-24 text-slate-700" />
                  </div>
                )}

                <div className="absolute -bottom-4 -left-4 bg-slate-900/95 border border-slate-700/80 rounded-lg px-3 py-2 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs select-none">
                  <div className="w-7 h-7 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center">
                    <VIcon name="fa-brands fa-react" className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Stack Utama</div>
                    <div className="font-bold text-white">Next.js & React</div>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-slate-900/95 border border-slate-700/80 rounded-lg px-3 py-2 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs select-none">
                  <div className="w-7 h-7 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center">
                    <VIcon name="fa-solid fa-database" className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Basis Data</div>
                    <div className="font-bold text-white">Neon PostgreSQL</div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
