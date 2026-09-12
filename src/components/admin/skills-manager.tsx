'use client';

import React, { useState } from 'react';
import { Skill } from '@/db/schema';
import { createSkillAction, updateSkillAction, deleteSkillAction } from '@/actions/content.actions';
import { VCard, VCardHeader, VCardTitle, VCardSubtitle, VCardContent } from '@/components/ui/v-card';
import { VBtn } from '@/components/ui/v-btn';
import { VChip } from '@/components/ui/v-chip';
import { VIcon } from '@/components/ui/v-icon';
import { VDialog } from '@/components/ui/v-dialog';
import { VTextField } from '@/components/ui/v-text-field';
import { VSnackbar } from '@/components/ui/v-snackbar';
import { DeleteConfirmModal } from '@/components/admin/delete-confirm-modal';

const CATEGORIES = ['Semua', 'Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'Tools'];

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Form State
  const [iconClassInput, setIconClassInput] = useState('fa-solid fa-code');
  const [proficiency, setProficiency] = useState(85);
  const [isPublished, setIsPublished] = useState(true);

  const filteredSkills = initialSkills.filter((s) =>
    selectedCategory === 'Semua' ? true : s.category === selectedCategory
  );

  const openCreateDialog = () => {
    setSelectedSkill(null);
    setIconClassInput('fa-solid fa-code');
    setProficiency(85);
    setIsPublished(true);
    setDialogOpen(true);
  };

  const openEditDialog = (item: Skill) => {
    setSelectedSkill(item);
    setIconClassInput(item.iconClass);
    setProficiency(item.proficiencyLevel);
    setIsPublished(item.isPublished);
    setDialogOpen(true);
  };

  const openDeleteDialog = (item: Skill) => {
    setSelectedSkill(item);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const orderIndex = Number(formData.get('orderIndex') || 0);

    const payload = {
      name,
      category,
      iconClass: iconClassInput.trim() || 'fa-solid fa-code',
      proficiencyLevel: proficiency,
      orderIndex,
      isPublished,
    };

    let res;
    if (selectedSkill) {
      res = await updateSkillAction(selectedSkill.id, payload);
    } else {
      res = await createSkillAction(payload);
    }

    setActionLoading(false);

    if (res.success) {
      setDialogOpen(false);
      setSnackbar({
        show: true,
        message: selectedSkill ? 'Keahlian berhasil diperbarui!' : 'Keahlian baru berhasil ditambahkan!',
        type: 'success',
      });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menyimpan keahlian.', type: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSkill) return;
    setActionLoading(true);

    const res = await deleteSkillAction(selectedSkill.id);
    setActionLoading(false);

    if (res.success) {
      setDeleteModalOpen(false);
      setSnackbar({ show: true, message: 'Keahlian berhasil dihapus.', type: 'success' });
      window.location.reload();
    } else {
      setSnackbar({ show: true, message: res.error || 'Gagal menghapus keahlian.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <VCard elevation={1}>
        <VCardHeader>
          <div>
            <VCardTitle>Katalog Keterampilan & Teknologi</VCardTitle>
            <VCardSubtitle>Kelola daftar kemampuan teknis dengan ikon Font Awesome</VCardSubtitle>
          </div>
          <VBtn variant="primary" size="sm" onClick={openCreateDialog} prependIcon="fa-solid fa-plus">
            Tambah Keahlian
          </VBtn>
        </VCardHeader>

        <VCardContent className="p-0">
          {filteredSkills.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <VIcon name="fa-solid fa-code" className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium">Tidak ada keahlian pada kategori ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ikon</th>
                    <th className="py-3.5 px-4">Nama Keahlian</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4 text-center">Kemahiran</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Urutan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredSkills.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 text-sm">
                          <VIcon name={item.iconClass} className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <VChip color="primary" size="sm">
                          {item.category}
                        </VChip>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                        {item.proficiencyLevel}%
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
        title={selectedSkill ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Nama Keahlian (Opsional)"
              name="name"
              defaultValue={selectedSkill?.name || ''}
              placeholder="Contoh: Next.js, PostgreSQL, Docker"
            />
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Kategori</label>
              <select
                name="category"
                defaultValue={selectedSkill?.category || 'Frontend'}
                className="w-full h-10 px-3.5 text-sm rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Tools">Tools</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Ikon Font Awesome dengan Pratinjau Langsung */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Kelas Ikon Font Awesome (Opsional, default: fa-solid fa-code)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Pratinjau:</span>
                <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 text-sm">
                  <VIcon name={iconClassInput || 'fa-solid fa-code'} className="w-4 h-4" />
                </div>
              </div>
            </div>
            <input
              type="text"
              value={iconClassInput}
              onChange={(e) => setIconClassInput(e.target.value)}
              placeholder="fa-solid fa-code (atau biarkan kosong)"
              className="w-full h-9 px-3 text-sm rounded-md bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Tingkat Kemahiran</span>
              <span className="font-mono text-blue-400">{proficiency}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VTextField
              label="Urutan Penataan (Index)"
              name="orderIndex"
              type="number"
              defaultValue={selectedSkill?.orderIndex ?? 0}
            />
            <div className="flex items-end pb-2">
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
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <VBtn variant="outlined" size="sm" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
              Batal
            </VBtn>
            <VBtn type="submit" variant="primary" size="sm" loading={actionLoading} prependIcon="fa-solid fa-circle-check">
              Simpan Keahlian
            </VBtn>
          </div>
        </form>
      </VDialog>

      {/* Modal Dialog Konfirmasi Hapus */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Keahlian"
        description={`Apakah Anda yakin ingin menghapus keahlian "${selectedSkill?.name}"?`}
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
