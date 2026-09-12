'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Education } from '@/db/schema';
import { VIcon } from '@/components/ui/v-icon';
import { VChip } from '@/components/ui/v-chip';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { TiltCard } from '@/components/ui/tilt-card';

export function EducationSection({ educations }: { educations: Education[] }) {
  if (educations.length === 0) return null;

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider"
          >
            <VIcon name="fa-solid fa-graduation-cap" className="w-3.5 h-3.5 text-slate-400" />
            <span>Pendidikan Formal</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Latar Belakang Akademik
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Fondasi keilmuan dan institusi pendidikan yang membentuk kompetensi analitis dan rekayasa saya.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {educations.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <TiltCard maxRotation={3}>
                <SpotlightCard className="p-6">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <VIcon name="fa-solid fa-graduation-cap" className="text-slate-400 w-4 h-4" />
                          <span>{edu.institution}</span>
                        </h3>
                        {(edu.degree !== '-' || edu.fieldOfStudy !== '-') && (
                          <div className="text-sm font-semibold text-slate-300 mt-0.5">
                            {[edu.degree !== '-' ? edu.degree : null, edu.fieldOfStudy !== '-' ? edu.fieldOfStudy : null]
                              .filter(Boolean)
                              .join(' • ')}
                          </div>
                        )}
                      </div>

                      {(edu.startDate !== '-' || edu.endDate || edu.isCurrent) && (
                        <VChip color="default" size="sm">
                          {edu.startDate !== '-' ? edu.startDate : ''}{' '}
                          {edu.isCurrent ? '- Sekarang' : edu.endDate ? `- ${edu.endDate}` : ''}
                        </VChip>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
                        {edu.description}
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
