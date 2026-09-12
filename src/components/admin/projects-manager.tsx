'use client';

import React, { useState } from 'react';
import { Project } from '@/db/schema';
import { createProjectAction, updateProjectAction, deleteProjectAction } from '@/actions/content.actions';
import { VCard, VCardHeader, VCardTitle, VCardSubtitle, VCardContent } from '@/components/ui/v-card';
import { VBtn } from '@/components/ui/v-btn';
import { VChip } from '@/components/ui/v-chip';
import { VIcon } from '@/components/ui/v-icon';
import { VDialog } from '@/components/ui/v-dialog';
import { VTextField, VTextarea } from '@/components/ui/v-text-field';
import { VImageUploader } from '@/components/ui/v-image-uploader';
import { VSnackbar } from '@/components/ui/v-snackbar';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projectsList] = useState<Project[]>(initialProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Form State
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const openCreateDialog = () => {
    setSelectedProject(null);
    setTechnologies([]);
    setIsFeatured(false);
    setIsPublished(true);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Project) => {
    setSelectedProject(item);
    setTechnologies(Array.isArray(item.technologies) ? item.technologies : []);
    setIsFeatured(item.isFeatured);
    setIsPublished(item.isPublished);
    setDialogOpen(true);
  };

  const openDeleteDialog = (item: Project) => {
    setSelectedProject(item);
    setDeleteModalOpen(true);
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (techInput.trim() && !technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
        setTechInput('');
      }
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const thumbnailUrl = formData.get('thumbnailUrl') as string;
    const demoUrl = formData.get('demoUrl') as string;
    const repoUrl = formData.get('repoUrl') as string;
    const orderIndex = Number(formData.get('orderIndex') || 0);

    const payload = {
      title,
      slug,
      description,
      content,
      thumbnailUrl,
      technologies,
      demoUrl,
      repoUrl,
      isFeatured,
      isPublished,
      orderIndex,
    };

    let res;
    if (selectedProject) {
      res = await updateProjectAction(selectedProject.id, payload);
    } else {
      res = await createProjectAction(payload);
    }

    setActionLoading(false);

    if (res.success) {
      setDialogOpen(false);
      setSnackbar({
        show: true,
        message: selectedProject ? 'Proyek berhasil diperbarui!' : 'Proyek baru berhasil ditambahkan!',
        type: 'success',
      });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menyimpan proyek.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    setActionLoading(true);

    const res = await deleteProjectAction(selectedProject.id);
    setActionLoading(false);

    if (res.success) {
      setDeleteModalOpen(false);
      setSnackbar({ show: true, message: 'Proyek berhasil dihapus.', type: 'success' });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menghapus proyek.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <VCard elevation={1}>
        <VCardHeader>
          <div>
            <VCardTitle>Daftar Portofolio Proyek</VCardTitle>
            <VCardSubtitle>Kelola karya aplikasi, repositori kode, dan tautan demo langsung</VCardSubtitle>
          </div>
          <VBtn variant="primary" size="sm" onClick={openCreateDialog} prependIcon="fa-solid fa-plus">
            Tambah Proyek
          </VBtn>
        </VCardHeader>

        <VCardContent className="p-0">
          {projectsList.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <VIcon name="fa-solid fa-laptop-code" className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Belum ada proyek yang terdaftar.</p>
              <VBtn variant="tonal" size="sm" onClick={openCreateDialog} className="mt-3">
                Tambah Proyek Pertama
              </VBtn>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Proyek</th>
                    <th className="py-3.5 px-4">Teknologi</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-center">Urutan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {projectsList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{item.title}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(Array.isArray(item.technologies) ? item.technologies : []).map((tech) => (
                            <VChip key={tech} size="sm">
                              {tech}
                            </VChip>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.isPublished ? (
                          <VChip color="success" size="sm">
                            Terbit
                          </VChip>
                        ) : (
                          <VChip color="default" size="sm">
                            Draft
                          </VChip>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.isFeatured ? (
                          <VChip color="warning" size="sm" icon="fa-solid fa-circle-check">
                            Ya
                          </VChip>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                        {item.orderIndex}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <VBtn
                            variant="text"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 px-2"
                            title="Edit"
                          >
                            <VIcon name="fa-solid fa-pen-to-square" className="w-3.5 h-3.5" />
                          </VBtn>
                          <VBtn
                            variant="text"
                            size="sm"
                            onClick={() => openDeleteDialog(item)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2"
                            title="Hapus"
                          >
                            <VIcon name="fa-solid fa-trash-can" className="w-3.5 h-3.5" />
                          </VBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </VCardContent>
      </VCard>

      {/* Modal Dialog Form Tambah / Edit */}
      <VDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={selectedProject ? 'Edit Proyek Portofolio' : 'Tambah Proyek Portofolio Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Judul Proyek (Opsional)"
              name="title"
              defaultValue={selectedProject?.title || ''}
              placeholder="Nama proyek aplikasi (bisa dikosongkan)"
            />
            <VTextField
              label="Slug URL (Otomatis jika kosong)"
              name="slug"
              defaultValue={selectedProject?.slug || ''}
              placeholder="contoh: aplikasi-ecommerce-modern"
            />
          </div>

          <VTextarea
            label="Deskripsi Singkat (Opsional)"
            name="description"
            defaultValue={selectedProject?.description || ''}
            placeholder="Jelaskan ringkasan proyek dan nilai tambahnya (bisa dikosongkan)..."
            rows={3}
          />

          <VTextarea
            label="Detail Konten / Fitur Unggulan (Opsional)"
            name="content"
            defaultValue={selectedProject?.content || ''}
            placeholder="Penjelasan arsitektur, tantangan yang dihadapi, fitur kunci..."
            rows={4}
          />

          <div className="space-y-4">
            <VImageUploader
              label="Thumbnail Gambar Proyek (GitHub CDN)"
              name="thumbnailUrl"
              value={selectedProject?.thumbnailUrl || ''}
              placeholder="https://raw.githubusercontent.com/dresar/PORTOFOLIO/main/asset/..."
              hint="Unggah thumbnail langsung ke GitHub CDN dresar/PORTOFOLIO."
            />

            <VTextField
              label="Urutan Penataan (Index)"
              name="orderIndex"
              type="number"
              defaultValue={selectedProject?.orderIndex ?? 0}
            />
          </div>

          {/* Input Tag Teknologi */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Teknologi yang Digunakan (Ketik & Tekan Enter)
            </label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex flex-wrap gap-1.5 min-h-6">
                {technologies.map((tech) => (
                  <VChip key={tech} size="sm" closable onClose={() => handleRemoveTech(tech)}>
                    {tech}
                  </VChip>
                ))}
              </div>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="Tambah teknologi (contoh: Next.js, Docker, Tailwind)..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="URL Demo Langsung (Live Demo) (Opsional)"
              name="demoUrl"
              defaultValue={selectedProject?.demoUrl || ''}
              placeholder="https://example.com (Opsional)"
            />
            <VTextField
              label="URL Repositori GitHub (Opsional)"
              name="repoUrl"
              defaultValue={selectedProject?.repoUrl || ''}
              placeholder="https://github.com/... (Opsional)"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <span>Tandai sebagai Proyek Unggulan (Featured)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <span>Publikasikan di Website</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <VBtn variant="outlined" size="sm" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
              Batal
            </VBtn>
            <VBtn type="submit" variant="primary" size="sm" loading={actionLoading} prependIcon="fa-solid fa-circle-check">
              Simpan Proyek
            </VBtn>
          </div>
        </form>
      </VDialog>

      {/* Modal Dialog Konfirmasi Hapus */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Proyek Portofolio"
        description={`Apakah Anda yakin ingin menghapus proyek "${selectedProject?.title}"?`}
        loading={actionLoading}
      />

      <VSnackbar
        show={snackbar.show}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
