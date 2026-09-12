'use client';

import React, { useState } from 'react';
import { Experience } from '@/db/schema';
import { createExperienceAction, updateExperienceAction, deleteExperienceAction } from '@/actions/content.actions';
import { VCard, VCardHeader, VCardTitle, VCardSubtitle, VCardContent } from '@/components/ui/v-card';
import { VBtn } from '@/components/ui/v-btn';
import { VChip } from '@/components/ui/v-chip';
import { VIcon } from '@/components/ui/v-icon';
import { VDialog } from '@/components/ui/v-dialog';
import { VTextField, VTextarea } from '@/components/ui/v-text-field';
import { VSnackbar } from '@/components/ui/v-snackbar';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';

export function ExperienceManager({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [experiencesList] = useState<Experience[]>(initialExperiences);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Experience | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Form State
  const [isCurrent, setIsCurrent] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const openCreateDialog = () => {
    setSelectedItem(null);
    setIsCurrent(false);
    setIsPublished(true);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Experience) => {
    setSelectedItem(item);
    setIsCurrent(item.isCurrent);
    setIsPublished(item.isPublished);
    setDialogOpen(true);
  };

  const openDeleteDialog = (item: Experience) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const company = formData.get('company') as string;
    const role = formData.get('role') as string;
    const employmentType = formData.get('employmentType') as string;
    const location = formData.get('location') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const description = formData.get('description') as string;
    const orderIndex = Number(formData.get('orderIndex') || 0);

    const payload = {
      company,
      role,
      employmentType,
      location,
      startDate,
      endDate: isCurrent ? null : endDate,
      isCurrent,
      description,
      orderIndex,
      isPublished,
    };

    let res;
    if (selectedItem) {
      res = await updateExperienceAction(selectedItem.id, payload);
    } else {
      res = await createExperienceAction(payload);
    }

    setActionLoading(false);

    if (res.success) {
      setDialogOpen(false);
      setSnackbar({
        show: true,
        message: selectedItem ? 'Pengalaman berhasil diperbarui!' : 'Pengalaman baru berhasil ditambahkan!',
        type: 'success',
      });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menyimpan data pengalaman.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setActionLoading(true);

    const res = await deleteExperienceAction(selectedItem.id);
    setActionLoading(false);

    if (res.success) {
      setDeleteModalOpen(false);
      setSnackbar({ show: true, message: 'Data pengalaman berhasil dihapus.', type: 'success' });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menghapus data pengalaman.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <VCard elevation={1}>
        <VCardHeader>
          <div>
            <VCardTitle>Riwayat Pengalaman Kerja & Karier</VCardTitle>
            <VCardSubtitle>Kelola perjalanan karier, magang, dan tanggung jawab profesional</VCardSubtitle>
          </div>
          <VBtn variant="primary" size="sm" onClick={openCreateDialog} prependIcon="fa-solid fa-plus">
            Tambah Pengalaman
          </VBtn>
        </VCardHeader>

        <VCardContent className="p-0">
          {experiencesList.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <VIcon name="fa-solid fa-briefcase" className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Belum ada riwayat pengalaman yang terdaftar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Perusahaan</th>
                    <th className="py-3.5 px-4">Posisi & Tipe</th>
                    <th className="py-3.5 px-4">Periode & Lokasi</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Urutan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {experiencesList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{item.company}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{item.role}</div>
                        <div className="text-[11px] text-blue-400">{item.employmentType}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{item.startDate} - {item.isCurrent ? 'Sekarang' : item.endDate || '-'}</div>
                        <div className="text-[11px] text-slate-400">{item.location || '-'}</div>
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
        title={selectedItem ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Perusahaan / Instansi (Opsional)"
              name="company"
              defaultValue={selectedItem?.company || ''}
              placeholder="Nama perusahaan atau instansi"
            />
            <VTextField
              label="Posisi / Jabatan (Opsional)"
              name="role"
              defaultValue={selectedItem?.role || ''}
              placeholder="Contoh: Senior Full-Stack Engineer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Tipe Pekerjaan</label>
              <select
                name="employmentType"
                defaultValue={selectedItem?.employmentType || 'Full-time'}
                className="w-full h-10 px-3.5 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <VTextField
              label="Lokasi (Opsional)"
              name="location"
              defaultValue={selectedItem?.location || ''}
              placeholder="Contoh: Jakarta, Indonesia / Remote"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Tanggal / Bulan Mulai (Opsional)"
              name="startDate"
              defaultValue={selectedItem?.startDate || ''}
              placeholder="Contoh: Jan 2023 atau 2023"
            />
            <VTextField
              label="Tanggal Selesai (Opsional)"
              name="endDate"
              defaultValue={selectedItem?.endDate || ''}
              placeholder="Contoh: Des 2024"
              disabled={isCurrent}
            />
          </div>

          <VTextarea
            label="Deskripsi Tanggung Jawab & Pencapaian (Opsional)"
            name="description"
            defaultValue={selectedItem?.description || ''}
            placeholder="Jelaskan peran, kontribusi teknis, dan pencapaian selama bekerja..."
            rows={4}
          />

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <span>Masih Bekerja di Sini (Posisi Saat Ini)</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <VTextField
              label="Urutan Penataan (Index)"
              name="orderIndex"
              type="number"
              defaultValue={selectedItem?.orderIndex ?? 0}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <VBtn variant="outlined" size="sm" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
              Batal
            </VBtn>
            <VBtn type="submit" variant="primary" size="sm" loading={actionLoading} prependIcon="fa-solid fa-circle-check">
              Simpan Pengalaman
            </VBtn>
          </div>
        </form>
      </VDialog>

      {/* Modal Dialog Konfirmasi Hapus */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Pengalaman"
        description={`Apakah Anda yakin ingin menghapus pengalaman di "${selectedItem?.company}"?`}
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
