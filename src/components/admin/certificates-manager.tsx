'use client';

import React, { useState } from 'react';
import { Certificate } from '@/db/schema';
import { createCertificateAction, updateCertificateAction, deleteCertificateAction } from '@/actions/content.actions';
import { VCard, VCardHeader, VCardTitle, VCardSubtitle, VCardContent } from '@/components/ui/v-card';
import { VBtn } from '@/components/ui/v-btn';
import { VChip } from '@/components/ui/v-chip';
import { VIcon } from '@/components/ui/v-icon';
import { VDialog } from '@/components/ui/v-dialog';
import { VTextField } from '@/components/ui/v-text-field';
import { VImageUploader } from '@/components/ui/v-image-uploader';
import { VSnackbar } from '@/components/ui/v-snackbar';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';

export function CertificatesManager({ initialCertificates }: { initialCertificates: Certificate[] }) {
  const [certificatesList] = useState<Certificate[]>(initialCertificates);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Certificate | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Form State
  const [isPublished, setIsPublished] = useState(true);

  const openCreateDialog = () => {
    setSelectedItem(null);
    setIsPublished(true);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Certificate) => {
    setSelectedItem(item);
    setIsPublished(item.isPublished);
    setDialogOpen(true);
  };

  const openDeleteDialog = (item: Certificate) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const issuer = formData.get('issuer') as string;
    const issueDate = formData.get('issueDate') as string;
    const expirationDate = formData.get('expirationDate') as string;
    const credentialId = formData.get('credentialId') as string;
    const credentialUrl = formData.get('credentialUrl') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const orderIndex = Number(formData.get('orderIndex') || 0);

    const payload = {
      title,
      issuer,
      issueDate,
      expirationDate: expirationDate || null,
      credentialId: credentialId || null,
      credentialUrl: credentialUrl || null,
      imageUrl: imageUrl || null,
      orderIndex,
      isPublished,
    };

    let res;
    if (selectedItem) {
      res = await updateCertificateAction(selectedItem.id, payload);
    } else {
      res = await createCertificateAction(payload);
    }

    setActionLoading(false);

    if (res.success) {
      setDialogOpen(false);
      setSnackbar({
        show: true,
        message: selectedItem ? 'Sertifikat berhasil diperbarui!' : 'Sertifikat baru berhasil ditambahkan!',
        type: 'success',
      });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menyimpan sertifikat.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setActionLoading(true);

    const res = await deleteCertificateAction(selectedItem.id);
    setActionLoading(false);

    if (res.success) {
      setDeleteModalOpen(false);
      setSnackbar({ show: true, message: 'Sertifikat berhasil dihapus.', type: 'success' });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menghapus sertifikat.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <VCard elevation={1}>
        <VCardHeader>
          <div>
            <VCardTitle>Daftar Sertifikat & Lisensi</VCardTitle>
            <VCardSubtitle>Kelola sertifikasi kompetensi, penerbit, dan tautan verifikasi online</VCardSubtitle>
          </div>
          <VBtn variant="primary" size="sm" onClick={openCreateDialog} prependIcon="fa-solid fa-plus">
            Tambah Sertifikat
          </VBtn>
        </VCardHeader>

        <VCardContent className="p-0">
          {certificatesList.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <VIcon name="fa-solid fa-certificate" className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Belum ada sertifikat yang terdaftar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Sertifikat</th>
                    <th className="py-3.5 px-4">Penerbit</th>
                    <th className="py-3.5 px-4">Tanggal Terbit</th>
                    <th className="py-3.5 px-4">ID Kredensial</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Urutan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {certificatesList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 group/img"
                              title="Lihat berkas sertifikat"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                              />
                            </a>
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 flex-shrink-0">
                              <VIcon name="fa-solid fa-certificate" className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm truncate max-w-xs">{item.title}</div>
                            {item.credentialUrl && (
                              <a
                                href={item.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>Verifikasi Online</span>
                                <VIcon name="fa-solid fa-arrow-up-right-from-square" className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 font-medium">{item.issuer}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.issueDate}
                        {item.expirationDate && (
                          <span className="text-[11px] text-slate-400 block">Exp: {item.expirationDate}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{item.credentialId || '-'}</td>
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
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">{item.orderIndex}</td>
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
        title={selectedItem ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Judul Sertifikat (Opsional)"
              name="title"
              defaultValue={selectedItem?.title || ''}
              placeholder="Contoh: Sertifikasi Keahlian Komputer"
            />
            <VTextField
              label="Organisasi Penerbit (Opsional)"
              name="issuer"
              defaultValue={selectedItem?.issuer || ''}
              placeholder="Contoh: Universitas Sumatera Utara / BNSP"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Tanggal / Tahun Terbit (Opsional)"
              name="issueDate"
              defaultValue={selectedItem?.issueDate || ''}
              placeholder="Contoh: 2024 atau Jan 2024"
            />
            <VTextField
              label="Tanggal Kadaluarsa (Opsional)"
              name="expirationDate"
              defaultValue={selectedItem?.expirationDate || ''}
              placeholder="Contoh: 2027"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="ID Kredensial / Nomor Lisensi (Opsional)"
              name="credentialId"
              defaultValue={selectedItem?.credentialId || ''}
              placeholder="Contoh: CERT-2024-998"
            />
            <VTextField
              label="URL Verifikasi Kredensial (Opsional)"
              name="credentialUrl"
              defaultValue={selectedItem?.credentialUrl || ''}
              placeholder="https://... (Opsional)"
            />
          </div>

          <VImageUploader
            label="Gambar / Badge Sertifikat (GitHub CDN)"
            name="imageUrl"
            value={selectedItem?.imageUrl || ''}
            placeholder="https://raw.githubusercontent.com/dresar/hafizh/main/asset/..."
            hint="Unggah berkas atau lencana sertifikat ke GitHub CDN dresar/hafizh."
          />

          <div className="flex items-center justify-between pt-2">
            <VTextField
              label="Urutan Penataan (Index)"
              name="orderIndex"
              type="number"
              defaultValue={selectedItem?.orderIndex ?? 0}
              className="max-w-xs"
            />

            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer pt-4">
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
              Simpan Sertifikat
            </VBtn>
          </div>
        </form>
      </VDialog>

      {/* Modal Dialog Konfirmasi Hapus */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Sertifikat"
        description={`Apakah Anda yakin ingin menghapus sertifikat "${selectedItem?.title}"?`}
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
