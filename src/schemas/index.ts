import { z } from 'zod';

const optionalString = z
  .string()
  .optional()
  .nullable()
  .transform((v) => v?.trim() || '');

const flexibleUrl = z
  .string()
  .optional()
  .nullable()
  .transform((val) => {
    if (!val) return '';
    const trimmed = val.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  });

const flexibleWhatsapp = z
  .string()
  .optional()
  .nullable()
  .transform((val) => {
    if (!val) return '';
    const trimmed = val.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const cleanNumber = trimmed.replace(/[^0-9]/g, '');
    if (!cleanNumber) return '';
    const normalized = cleanNumber.startsWith('0')
      ? `62${cleanNumber.slice(1)}`
      : cleanNumber.startsWith('62')
      ? cleanNumber
      : `62${cleanNumber}`;
    return `https://wa.me/${normalized}`;
  });

const flexibleEmail = z
  .string()
  .optional()
  .nullable()
  .transform((v) => v?.trim() || '')
  .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: 'Format email tidak valid',
  });

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username atau email wajib diisi').max(255),
  password: z.string().min(1, 'Password wajib diisi').max(100),
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : 'Muhammad Fauzan Al Hafizh')),
  headline: optionalString,
  bio: optionalString,
  avatarUrl: optionalString,
  resumeUrl: optionalString,
  location: optionalString,
  email: flexibleEmail,
  phone: optionalString,
  githubUrl: flexibleUrl,
  linkedinUrl: flexibleUrl,
  whatsappUrl: flexibleWhatsapp,
  isAvailable: z.boolean().default(true),
});

export const educationSchema = z.object({
  institution: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : 'Institusi Pendidikan')),
  degree: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || '-'),
  fieldOfStudy: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || '-'),
  startDate: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || '-'),
  endDate: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  isCurrent: z.boolean().default(false),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  orderIndex: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const skillSchema = z.object({
  name: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : 'Keahlian Baru')),
  category: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || 'Frontend'),
  iconClass: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || 'fa-solid fa-code'),
  proficiencyLevel: z.coerce.number().min(0).max(100).default(80),
  orderIndex: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const projectSchema = z.object({
  title: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : 'Proyek Baru')),
  slug: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || ''),
  description: optionalString,
  content: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  thumbnailUrl: optionalString,
  technologies: z.array(z.string()).default([]),
  demoUrl: flexibleUrl,
  repoUrl: flexibleUrl,
  isFeatured: z.boolean().default(false),
  orderIndex: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const experienceSchema = z.object({
  company: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : 'Perusahaan / Organisasi')),
  role: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || '-'),
  employmentType: z.string().default('Full-time'),
  location: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  startDate: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || '-'),
  endDate: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  isCurrent: z.boolean().default(false),
  description: optionalString,
  orderIndex: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const certificateSchema = z.object({
  title: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : 'Sertifikat Baru')),
  issuer: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || '-'),
  issueDate: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || '-'),
  expirationDate: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  credentialId: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  credentialUrl: flexibleUrl,
  imageUrl: optionalString,
  orderIndex: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Nama lengkap wajib diisi').max(150),
  email: z.string().email('Format email tidak valid').max(255),
  subject: optionalString,
  message: z.string().min(1, 'Pesan tidak boleh kosong').max(5000),
  honeypot: z.string().max(0, 'Spam terdeteksi').optional(),
});
