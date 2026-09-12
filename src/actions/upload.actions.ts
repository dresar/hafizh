'use server';

import { getAdminSession } from '@/lib/auth';

export interface UploadResponse {
  success: boolean;
  url?: string;
  cdnUrl?: string;
  error?: string;
}

export async function uploadImageToGithubAction(formData: FormData): Promise<UploadResponse> {
  try {
    const session = await getAdminSession();
    if (!session) {
      return {
        success: false,
        error: 'Akses ditolak: Anda harus login sebagai admin untuk mengunggah gambar.',
      };
    }

    const file = formData.get('file') as File | null;
    if (!file || !(file instanceof File) || file.size === 0) {
      return {
        success: false,
        error: 'Berkas gambar tidak ditemukan atau kosong.',
      };
    }

    // Batasan ukuran maksimum 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: 'Ukuran berkas melebihi batas maksimal (10 MB).',
      };
    }

    // Validasi tipe berkas gambar
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Format berkas tidak didukung. Harap unggah PNG, JPG, WebP, GIF, atau SVG.',
      };
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'dresar';
    const repo = process.env.GITHUB_REPO || 'hafizh';
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token) {
      return {
        success: false,
        error: 'GITHUB_TOKEN belum dikonfigurasi di environment server.',
      };
    }

    // Siapkan nama file unik dan sanitasi
    const originalName = file.name;
    const ext = originalName.split('.').pop()?.toLowerCase() || 'png';
    const cleanBaseName = originalName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);
    const fileName = `${Date.now()}-${cleanBaseName}.${ext}`;
    const targetPath = `asset/uploads/${fileName}`;

    // Konversi file buffer ke base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString('base64');

    // Kirim ke GitHub Contents API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Antigravity-Portfolio-Uploader',
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: `upload(portfolio): ${fileName}`,
          content: base64Content,
          branch,
        }),
      }
    );

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      console.error('GitHub API error:', errorJson);
      return {
        success: false,
        error: `Gagal mengunggah ke GitHub (${response.status}): ${errorJson.message || 'Error API'}`,
      };
    }

    // Format URL GitHub CDN dan jsDelivr
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${targetPath}`;
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${targetPath}`;

    return {
      success: true,
      url: rawUrl,
      cdnUrl,
    };
  } catch (error) {
    console.error('Upload action unhandled error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan internal saat memproses unggahan gambar.',
    };
  }
}
