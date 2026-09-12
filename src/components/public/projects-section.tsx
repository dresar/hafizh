'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '@/db/schema';
import { VIcon } from '@/components/ui/v-icon';
import { VChip } from '@/components/ui/v-chip';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { TiltCard } from '@/components/ui/tilt-card';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  if (projects.length === 0) return null;

  const filteredProjects = projects.filter((p) =>
    filter === 'featured' ? p.isFeatured : true
  );

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider"
          >
            <VIcon name="fa-solid fa-laptop-code" className="w-3.5 h-3.5 text-blue-400" />
            <span>Karya & Implementasi</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Portofolio Unggulan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Implementasi solusi rekayasa perangkat lunak dengan arsitektur modern, performa teruji, dan desain antarmuka presisi.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-800 text-white border border-slate-600 shadow-md shadow-black/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Semua Proyek ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'featured'
                ? 'bg-slate-800 text-white border border-slate-600 shadow-md shadow-black/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Proyek Unggulan (Featured)
          </button>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="h-full"
              >
                <TiltCard maxRotation={5} className="h-full">
                  <SpotlightCard className="h-full flex flex-col justify-between group">
                    <div>
                      <div className="relative w-full h-52 bg-slate-950 border-b border-slate-800/80 overflow-hidden">
                        {project.thumbnailUrl ? (
                          <Image
                            src={project.thumbnailUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700">
                            <VIcon name="fa-solid fa-laptop-code" className="w-12 h-12" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                        {project.isFeatured && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                              <VIcon name="fa-solid fa-star" className="w-3 h-3 text-amber-400" />
                              <span>Featured</span>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 sm:p-6 space-y-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group/link"
                        >
                          <h3 className="text-lg font-bold text-white group-hover/link:text-blue-400 transition-colors flex items-center justify-between gap-2">
                            <span>{project.title}</span>
                            <VIcon
                              name="fa-solid fa-arrow-up-right-from-square"
                              className="w-3.5 h-3.5 text-slate-500 group-hover/link:text-blue-400 transition-colors flex-shrink-0"
                            />
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {(Array.isArray(project.technologies) ? project.technologies : []).map(
                            (tech) => (
                              <VChip key={tech} size="sm" color="default">
                                {tech}
                              </VChip>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 pt-0 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                          >
                            <VIcon name="fa-solid fa-globe" className="w-3 h-3 text-blue-400" />
                            <span>Demo</span>
                          </a>
                        )}

                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-all active:scale-95"
                          >
                            <VIcon name="fa-brands fa-github" className="w-3 h-3 text-slate-400" />
                            <span>Kode</span>
                          </a>
                        )}
                      </div>

                      <ShimmerButton
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon="fa-solid fa-arrow-right"
                        iconPosition="right"
                        className="py-1.5 px-3 text-xs"
                      >
                        Detail Tab Baru
                      </ShimmerButton>
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
