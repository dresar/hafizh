'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Experience } from '@/db/schema';
import { VIcon } from '@/components/ui/v-icon';
import { VChip } from '@/components/ui/v-chip';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { TiltCard } from '@/components/ui/tilt-card';

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 border-t border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider"
          >
            <VIcon name="fa-solid fa-briefcase" className="w-3.5 h-3.5 text-slate-400" />
            <span>Pengalaman Profesional</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Linimasa Karier & Pengabdian
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Riwayat posisi teknis, tanggung jawab kepemimpinan, dan dedikasi eksekusi proyek nyata.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto relative pl-6 sm:pl-8 border-l border-slate-800 space-y-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative group"
            >
              <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-slate-500 group-hover:border-slate-300 transition-colors" />

              <TiltCard maxRotation={3} className="h-full">
                <SpotlightCard className="p-6">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {exp.role && exp.role !== '-' ? exp.role : exp.company}
                        </h3>
                        <div className="text-sm font-semibold text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="text-slate-600">&bull;</span>
                              <span className="text-xs text-slate-500 font-normal">{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <VChip color="default" size="sm">
                          {exp.employmentType}
                        </VChip>
                        {(exp.startDate !== '-' || exp.endDate || exp.isCurrent) && (
                          <VChip color="default" size="sm">
                            {exp.startDate !== '-' ? exp.startDate : ''}{' '}
                            {exp.isCurrent ? '- Sekarang' : exp.endDate ? `- ${exp.endDate}` : ''}
                          </VChip>
                        )}
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-3 border-t border-slate-800/80 whitespace-pre-wrap">
                        {exp.description}
                      </p>
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
