'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Profile } from '@/db/schema';
import { submitContactMessageAction } from '@/actions/contact.actions';
import { VTextField, VTextarea } from '@/components/ui/v-text-field';
import { VBtn } from '@/components/ui/v-btn';
import { VIcon } from '@/components/ui/v-icon';
import { VSnackbar } from '@/components/ui/v-snackbar';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { TiltCard } from '@/components/ui/tilt-card';

export function ContactSection({ profile }: { profile: Profile | null }) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await submitContactMessageAction(formData);
    setLoading(false);

    if (res.success) {
      setSnackbar({
        show: true,
        message: res.message || 'Pesan Anda berhasil terkirim!',
        type: 'success',
      });
      form.reset();
    } else {
      setSnackbar({
        show: true,
        message: res.error || 'Gagal mengirim pesan. Silakan periksa kembali isian Anda.',
        type: 'error',
      });
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider"
          >
            <VIcon name="fa-solid fa-envelope" className="w-3.5 h-3.5 text-slate-400" />
            <span>Koneksi & Kolaborasi</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
          >
            Mari Terhubung
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Punya tawaran proyek, peluang kolaborasi teknis, atau pertanyaan rekayasa? Kirimkan pesan langsung melalui formulir di bawah ini.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            <TiltCard maxRotation={3}>
              <SpotlightCard className="p-6 sm:p-7 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Informasi Kontak Langsung</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Saya selalu terbuka untuk berdiskusi seputar peluang rekayasa perangkat lunak, arsitektur basis data, dan inovasi web modern.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {profile?.email && (
                    <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <div className="w-9 h-9 rounded-lg bg-slate-850 border border-slate-700/80 text-slate-200 flex items-center justify-center flex-shrink-0">
                        <VIcon name="fa-solid fa-envelope" className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">Email:</div>
                        <a href={`mailto:${profile.email}`} className="text-white font-semibold hover:text-blue-300 transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.whatsappUrl && (
                    <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      <div className="w-9 h-9 rounded-lg bg-slate-850 border border-slate-700/80 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <VIcon name="fa-brands fa-whatsapp" className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">WhatsApp:</div>
                        <a
                          href={profile.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-emerald-400 transition-colors"
                        >
                          Kirim Pesan WhatsApp Langsung
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="w-9 h-9 rounded-lg bg-slate-850 border border-slate-700/80 text-slate-300 flex items-center justify-center flex-shrink-0">
                      <VIcon name="fa-solid fa-location-dot" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Domisili:</div>
                      <div className="text-white font-semibold">{profile?.location || 'Indonesia'}</div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <SpotlightCard className="p-6 sm:p-8">
              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-bold text-white">Kirimkan Pesan Anda</h3>
                <p className="text-xs text-slate-400">Pesan akan tersimpan aman di database dan diteruskan langsung ke email admin.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website_url_honey"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VTextField
                    label="Nama Lengkap Anda"
                    name="name"
                    placeholder="Contoh: Budi Santoso"
                    required
                    prependInnerIcon="fa-solid fa-user"
                  />
                  <VTextField
                    label="Alamat Email Anda"
                    name="email"
                    type="email"
                    placeholder="budi@example.com"
                    required
                    prependInnerIcon="fa-solid fa-envelope"
                  />
                </div>

                <VTextField
                  label="Subjek / Topik Pembicaraan (Opsional)"
                  name="subject"
                  placeholder="Contoh: Diskusi Proyek / Peluang Kerja (Bisa dikosongkan)"
                  prependInnerIcon="fa-solid fa-pen-to-square"
                />

                <VTextarea
                  label="Isi Pesan Lengkap"
                  name="message"
                  placeholder="Tuliskan pesan, pertanyaan, atau rincian kolaborasi Anda..."
                  rows={5}
                  required
                />

                <div className="pt-2 flex items-center justify-end">
                  <VBtn
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    prependIcon="fa-solid fa-paper-plane"
                    className="w-full sm:w-auto shadow-lg shadow-black/40"
                  >
                    Kirim Pesan Sekarang
                  </VBtn>
                </div>
              </form>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>

      <VSnackbar
        show={snackbar.show}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, show: false }))}
      />
    </section>
  );
}
