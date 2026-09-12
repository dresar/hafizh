'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Certificate } from '@/db/schema';
import { VIcon } from '@/components/ui/v-icon';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { TiltCard } from '@/components/ui/tilt-card';

export function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider"
          >
            <VIcon name="fa-solid fa-certificate" className="w-3.5 h-3.5 text-slate-400" />
            <span>Kredensial Resmi</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Sertifikasi Profesional
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Validasi kualifikasi dan keahlian teknis terakreditasi dari institusi dan platform terkemuka.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="h-full"
            >
              <TiltCard maxRotation={4} className="h-full">
                <SpotlightCard className="h-full flex flex-col justify-between group overflow-hidden">
                  <div>
                    {cert.imageUrl ? (
                      <a
                        href={cert.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative w-full h-52 sm:h-56 bg-slate-950 border-b border-slate-800/80 overflow-hidden cursor-pointer group/img"
                        title="Klik untuk melihat sertifikat ukuran penuh"
                      >
                        <Image
                          src={cert.imageUrl}
                          alt={cert.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 text-white border border-slate-700 shadow-xl backdrop-blur-md">
                            <VIcon name="fa-solid fa-expand" className="w-3 h-3 text-slate-300" />
                            <span>Lihat Sertifikat</span>
                          </span>
                        </div>
                        {cert.issueDate && cert.issueDate !== '-' && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-700/80 shadow-md backdrop-blur-md">
                              {cert.issueDate}
                            </span>
                          </div>
                        )}
                      </a>
                    ) : (
                      <div className="relative w-full h-32 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-center text-slate-700">
                        <VIcon name="fa-solid fa-certificate" className="w-12 h-12" />
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-850 border border-slate-700/80 text-slate-300 flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors">
                          <VIcon name="fa-solid fa-certificate" className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors leading-snug">
                            {cert.title}
                          </h3>
                          {cert.issuer && cert.issuer !== '-' && (
                            <p className="text-xs font-semibold text-slate-400 mt-1">{cert.issuer}</p>
                          )}
                        </div>
                      </div>

                      {(cert.issueDate !== '-' || cert.credentialId) && (
                        <div className="space-y-1.5 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                          {cert.issueDate && cert.issueDate !== '-' && !cert.imageUrl && (
                            <div className="flex items-center justify-between">
                              <span>Terbit:</span>
                              <span className="font-mono text-slate-300">{cert.issueDate}</span>
                            </div>
                          )}
                          {cert.credentialId && (
                            <div className="flex items-center justify-between">
                              <span>ID Kredensial:</span>
                              <span className="font-mono text-slate-300 text-[11px] truncate max-w-[170px]">
                                {cert.credentialId}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-2 flex flex-col gap-2">
                    {cert.imageUrl && (
                      <a
                        href={cert.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:bg-slate-750 hover:text-white transition-all active:scale-[0.98]"
                      >
                        <VIcon name="fa-solid fa-file-image" className="w-3 h-3 text-slate-400" />
                        <span>Lihat Dokumen Sertifikat</span>
                        <VIcon name="fa-solid fa-arrow-up-right-from-square" className="w-3 h-3 text-slate-400 ml-auto" />
                      </a>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
                      >
                        <VIcon name="fa-solid fa-shield-halved" className="w-3 h-3 text-blue-400" />
                        <span>Verifikasi Kredensial Online</span>
                        <VIcon name="fa-solid fa-arrow-up-right-from-square" className="w-3 h-3 text-slate-500 ml-auto" />
                      </a>
                    )}
                  </div>
                </SpotlightCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
