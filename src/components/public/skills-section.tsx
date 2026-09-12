'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill } from '@/db/schema';
import { VIcon } from '@/components/ui/v-icon';
import { VChip } from '@/components/ui/v-chip';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { TiltCard } from '@/components/ui/tilt-card';

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  if (skills.length === 0) return null;

  const categories = ['Semua', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = skills.filter((s) =>
    selectedCategory === 'Semua' ? true : s.category === selectedCategory
  );

  return (
    <section id="skills" className="py-24 border-t border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider"
          >
            <VIcon name="fa-solid fa-code" className="w-3.5 h-3.5 text-slate-400" />
            <span>Keahlian Teknis</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Tech Stack & Perkakas
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Bahasa pemrograman, framework, dan sistem basis data yang saya kuasai secara mendalam untuk rekayasa sistem modern.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-md shadow-black/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredSkills.map((skill, idx) => (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="h-full"
              >
                <TiltCard maxRotation={4} className="h-full">
                  <SpotlightCard className="p-4 h-full flex flex-col justify-between group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-200 text-base group-hover:scale-110 group-hover:text-white transition-all flex-shrink-0">
                        <VIcon name={skill.iconClass} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-white truncate">{skill.name}</h3>
                        <VChip color="default" size="sm" className="mt-1">
                          {skill.category}
                        </VChip>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Tingkat Kemahiran</span>
                        <span className="font-mono text-slate-200">{skill.proficiencyLevel}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 group-hover:bg-white rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiencyLevel}%` }}
                        />
                      </div>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
