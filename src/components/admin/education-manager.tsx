'use client';

import React, { useState } from 'react';
import { Education } from '@/db/schema';
import { createEducationAction, updateEducationAction, deleteEducationAction } from '@/actions/content.actions';
import { VCard, VCardHeader, VCardTitle, VCardSubtitle, VCardContent } from '@/components/ui/v-card';
import { VBtn } from '@/components/ui/v-btn';
import { VChip } from '@/components/ui/v-chip';
import { VIcon } from '@/components/ui/v-icon';
import { VDialog } from '@/components/ui/v-dialog';
import { VTextField, VTextarea } from '@/components/ui/v-text-field';
import { VSnackbar } from '@/components/ui/v-snackbar';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';

export function EducationManager({ initialEducations }: { initialEducations: Education[] }) {
  const [educationsList] = useState<Education[]>(initialEducations);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Education | null>(null);
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

  const openEditDialog = (item: Education) => {
    setSelectedItem(item);
    setIsCurrent(item.isCurrent);
    setIsPublished(item.isPublished);
    setDialogOpen(true);
  };

  const openDeleteDialog = (item: Education) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const institution = formData.get('institution') as string;
    const degree = formData.get('degree') as string;
    const fieldOfStudy = formData.get('fieldOfStudy') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const description = formData.get('description') as string;
    const orderIndex = Number(formData.get('orderIndex') || 0);

    const payload = {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate: isCurrent ? null : endDate,
      isCurrent,
      description,
      orderIndex,
      isPublished,
    };

    let res;
    if (selectedItem) {
      res = await updateEducationAction(selectedItem.id, payload);
    } else {
      res = await createEducationAction(payload);
    }

    setActionLoading(false);

    if (res.success) {
      setDialogOpen(false);
      setSnackbar({
        show: true,
        message: selectedItem ? 'Pendidikan berhasil diperbarui!' : 'Pendidikan baru berhasil ditambahkan!',
        type: 'success',
      });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menyimpan data pendidikan.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setActionLoading(true);

    const res = await deleteEducationAction(selectedItem.id);
    setActionLoading(false);

    if (res.success) {
      setDeleteModalOpen(false);
      setSnackbar({ show: true, message: 'Data pendidikan berhasil dihapus.', type: 'success' });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menghapus data pendidikan.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <VCard elevation={1}>
        <VCardHeader>
          <div>
            <VCardTitle>Riwayat Pendidikan</VCardTitle>
            <VCardSubtitle>Kelola data institusi akademik, gelar, dan periode studi</VCardSubtitle>
          </div>
          <VBtn variant="primary" size="sm" onClick={openCreateDialog} prependIcon="fa-solid fa-plus">
            Tambah Pendidikan
          </VBtn>
        </VCardHeader>

        <VCardContent className="p-0">
          {educationsList.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <VIcon name="fa-solid fa-graduation-cap" className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Belum ada riwayat pendidikan yang terdaftar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Institusi</th>
                    <th className="py-3.5 px-4">Gelar & Jurusan</th>
                    <th className="py-3.5 px-4">Periode</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Urutan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {educationsList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{item.institution}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{item.degree}</div>
                        <div className="text-[11px] text-slate-400">{item.fieldOfStudy}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.startDate} - {item.isCurrent ? 'Sekarang' : item.endDate || '-'}
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
        title={selectedItem ? 'Edit Riwayat Pendidikan' : 'Tambah Riwayat Pendidikan'}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          <VTextField
            label="Nama Institusi / Universitas (Opsional)"
            name="institution"
            defaultValue={selectedItem?.institution || ''}
            placeholder="Contoh: Universitas Sumatera Utara"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Gelar Akademik (Opsional)"
              name="degree"
              defaultValue={selectedItem?.degree || ''}
              placeholder="Contoh: Sarjana Komputer (S.Kom)"
            />
            <VTextField
              label="Jurusan / Program Studi (Opsional)"
              name="fieldOfStudy"
              defaultValue={selectedItem?.fieldOfStudy || ''}
              placeholder="Contoh: Teknik Informatika"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Tahun / Tanggal Mulai (Opsional)"
              name="startDate"
              defaultValue={selectedItem?.startDate || ''}
              placeholder="Contoh: 2020"
            />
            <VTextField
              label="Tahun / Tanggal Selesai (Opsional)"
              name="endDate"
              defaultValue={selectedItem?.endDate || ''}
              placeholder="Contoh: 2024"
              disabled={isCurrent}
            />
          </div>

          <VTextarea
            label="Deskripsi / Prestasi (Opsional)"
            name="description"
            defaultValue={selectedItem?.description || ''}
            placeholder="Aktivitas riset, topik skripsi, pencapaian..."
            rows={3}
          />

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <span>Sedang Berjalan / Menempuh Studi</span>
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
              Simpan Pendidikan
            </VBtn>
          </div>
        </form>
      </VDialog>

      {/* Modal Dialog Konfirmasi Hapus */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Pendidikan"
        description={`Apakah Anda yakin ingin menghapus "${selectedItem?.institution}"?`}
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
