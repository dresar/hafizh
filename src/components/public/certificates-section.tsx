'use client';

import React from 'react';
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
              <TiltCard maxRotation={5} className="h-full">
                <SpotlightCard className="p-6 h-full flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors">
                        <VIcon name="fa-solid fa-certificate" className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {cert.title}
                        </h3>
                        {cert.issuer && cert.issuer !== '-' && (
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">{cert.issuer}</p>
                        )}
                      </div>
                    </div>

                    {(cert.issueDate !== '-' || cert.credentialId) && (
                      <div className="space-y-1 text-xs text-slate-400 pt-3 border-t border-slate-800">
                        {cert.issueDate && cert.issueDate !== '-' && (
                          <div className="flex items-center justify-between">
                            <span>Terbit:</span>
                            <span className="font-mono text-slate-300">{cert.issueDate}</span>
                          </div>
                        )}
                        {cert.credentialId && (
                          <div className="flex items-center justify-between">
                            <span>ID Kredensial:</span>
                            <span className="font-mono text-slate-300 text-[11px] truncate max-w-[150px]">
                              {cert.credentialId}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <div className="pt-4 mt-3 border-t border-slate-800/80">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-slate-200 hover:bg-slate-700 hover:text-white transition-all active:scale-[0.98]"
                      >
                        <span>Verifikasi Kredensial Online</span>
                        <VIcon name="fa-solid fa-arrow-up-right-from-square" className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  )}
                </SpotlightCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
