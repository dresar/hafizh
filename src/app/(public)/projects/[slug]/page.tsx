import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { VIcon } from '@/components/ui/v-icon';
import { VChip } from '@/components/ui/v-chip';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const projectList = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, resolvedParams.slug), eq(projects.isPublished, true)))
    .limit(1);

  if (projectList.length === 0) {
    return {
      title: 'Proyek Tidak Ditemukan - Portofolio Muhammad Fauzan Al Hafizh',
    };
  }

  const project = projectList[0];
  return {
    title: `${project.title} - Muhammad Fauzan Al Hafizh`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnailUrl ? [{ url: project.thumbnailUrl }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const projectList = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, resolvedParams.slug), eq(projects.isPublished, true)))
    .limit(1);

  if (projectList.length === 0) {
    notFound();
  }

  const project = projectList[0];

  const otherProjects = await db
    .select()
    .from(projects)
    .where(and(eq(projects.isPublished, true), ne(projects.id, project.id)))
    .limit(3);

  const technologies = Array.isArray(project.technologies) ? project.technologies : [];

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <VIcon name="fa-solid fa-house" className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <span className="text-slate-600">/</span>
            <Link href="/#projects" className="hover:text-white transition-colors">
              Portofolio Proyek
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 truncate max-w-[200px]">{project.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <VIcon name="fa-solid fa-arrow-left" className="w-3 h-3" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <VIcon name="fa-solid fa-star" className="w-3 h-3" />
                Featured Showcase
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800">
              <VIcon name="fa-regular fa-calendar" className="w-3 h-3" />
              {new Date(project.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            {project.demoUrl && (
              <ShimmerButton
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                icon="fa-solid fa-arrow-up-right-from-square"
              >
                Kunjungi Live Demo
              </ShimmerButton>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-slate-500 transition-all active:scale-[0.98]"
              >
                <VIcon name="fa-brands fa-github" className="w-4 h-4 text-slate-400" />
                <span>Repositori GitHub</span>
              </a>
            )}
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-3">
              <VIcon name="fa-solid fa-laptop-code" className="w-16 h-16" />
              <span className="text-sm font-medium">Pratinjau visual belum tersedia</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SpotlightCard className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <VIcon name="fa-solid fa-circle-info" className="w-5 h-5 text-blue-400" />
                <span>Ringkasan Solusi & Implementasi</span>
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                {project.content ? (
                  <div className="whitespace-pre-line">{project.content}</div>
                ) : (
                  <p>
                    Proyek <strong>{project.title}</strong> dirancang dan diimplementasikan untuk
                    menjawab kebutuhan pemrosesan data dan integrasi antarmuka yang modern, cepat,
                    dan andal. Solusi ini memprioritaskan performa tinggi, aksesibilitas lintas
                    perangkat, serta struktur kode yang bersih dan mudah dipelihara.
                  </p>
                )}
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <VIcon name="fa-solid fa-list-check" className="w-5 h-5 text-slate-300" />
                <span>Karakteristik & Fitur Unggulan</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <VIcon name="fa-solid fa-gauge-high" className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Optimasi Performa</span>
                    <span className="text-slate-400">Rendering responsif dengan latensi rendah dan resource efisien.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <VIcon name="fa-solid fa-shield-halved" className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Arsitektur Terstruktur</span>
                    <span className="text-slate-400">Pemisahan concerns modular untuk kemudahan skalabilitas.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <VIcon name="fa-solid fa-mobile-screen" className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Responsif Multi-Device</span>
                    <span className="text-slate-400">Tampilan adaptif di perangkat mobile, tablet, hingga desktop.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <VIcon name="fa-solid fa-code-branch" className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Maintainability</span>
                    <span className="text-slate-400">Kode terdokumentasi dan teruji mengikuti konvensi clean code.</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="space-y-6">
            <SpotlightCard className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <VIcon name="fa-solid fa-layer-group" className="w-4 h-4 text-slate-300" />
                <span>Teknologi Digunakan</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                  <VChip key={tech} size="sm" color="default">
                    {tech}
                  </VChip>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <VIcon name="fa-solid fa-link" className="w-4 h-4 text-slate-300" />
                <span>Tautan Langsung</span>
              </h3>
              <div className="space-y-2 text-xs">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <VIcon name="fa-solid fa-globe" className="w-3.5 h-3.5 text-blue-400" />
                      <span>URL Aplikasi Live</span>
                    </span>
                    <VIcon name="fa-solid fa-arrow-up-right-from-square" className="w-3 h-3 text-slate-500" />
                  </a>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-950/30 border border-slate-800/40 text-slate-500 text-xs">
                    Tautan live demo tidak tersedia
                  </div>
                )}

                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <VIcon name="fa-brands fa-github" className="w-3.5 h-3.5 text-slate-300" />
                      <span>Repositori Kode</span>
                    </span>
                    <VIcon name="fa-solid fa-arrow-up-right-from-square" className="w-3 h-3 text-slate-500" />
                  </a>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-950/30 border border-slate-800/40 text-slate-500 text-xs">
                    Repositori kode bersifat privat
                  </div>
                )}
              </div>
            </SpotlightCard>
          </div>
        </div>

        {otherProjects.length > 0 && (
          <div className="pt-10 border-t border-slate-800/80 space-y-6">
            <h2 className="text-xl font-bold text-white">Proyek Unggulan Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="group block p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
