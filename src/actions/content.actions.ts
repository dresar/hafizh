'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import {
  profiles,
  educations,
  skills,
  projects,
  experiences,
  certificates,
  contactMessages,
} from '@/db/schema';
import {
  profileSchema,
  educationSchema,
  skillSchema,
  projectSchema,
  experienceSchema,
  certificateSchema,
} from '@/schemas';
import { getAdminSession } from '@/lib/auth';

export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
}

// Helper otorisasi admin
async function ensureAuthenticated() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Unauthorized: Akses dibatasi hanya untuk administrator.');
  }
  return session;
}

// ==========================================
// 1. PROFIL ACTIONS
// ==========================================
export async function updateProfileAction(data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = profileSchema.safeParse(data);
    if (!validated.success) {
      const errorMap = validated.error.flatten().fieldErrors;
      const details = Object.entries(errorMap)
        .map(([k, v]) => `${k}: ${v?.join(', ')}`)
        .join(' | ');
      return {
        success: false,
        error: details ? `Data profil tidak valid (${details})` : 'Data profil tidak valid.',
        fieldErrors: errorMap,
      };
    }

    const existing = await db.select().from(profiles).limit(1);
    if (existing.length > 0) {
      await db
        .update(profiles)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, existing[0].id));
    } else {
      await db.insert(profiles).values(validated.data);
    }

    revalidatePath('/');
    revalidatePath('/admin/profile');
    revalidatePath('/admin/dashboard');

    return { success: true, message: 'Profil berhasil diperbarui!' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Gagal memperbarui profil.' };
  }
}

// ==========================================
// 2. EDUCATION ACTIONS
// ==========================================
export async function createEducationAction(data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = educationSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data pendidikan tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db.insert(educations).values(validated.data);
    revalidatePath('/');
    revalidatePath('/admin/education');

    return { success: true, message: 'Riwayat pendidikan berhasil ditambahkan!' };
  } catch (error) {
    console.error('Create education error:', error);
    return { success: false, error: 'Gagal menambahkan riwayat pendidikan.' };
  }
}

export async function updateEducationAction(id: string, data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = educationSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data pendidikan tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db
      .update(educations)
      .set({ ...validated.data, updatedAt: new Date() })
      .where(eq(educations.id, id));

    revalidatePath('/');
    revalidatePath('/admin/education');

    return { success: true, message: 'Riwayat pendidikan berhasil diperbarui!' };
  } catch (error) {
    console.error('Update education error:', error);
    return { success: false, error: 'Gagal memperbarui riwayat pendidikan.' };
  }
}

export async function deleteEducationAction(id: string): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    await db.delete(educations).where(eq(educations.id, id));

    revalidatePath('/');
    revalidatePath('/admin/education');

    return { success: true, message: 'Riwayat pendidikan berhasil dihapus!' };
  } catch (error) {
    console.error('Delete education error:', error);
    return { success: false, error: 'Gagal menghapus riwayat pendidikan.' };
  }
}

// ==========================================
// 3. SKILLS ACTIONS
// ==========================================
export async function createSkillAction(data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = skillSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data keahlian tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db.insert(skills).values(validated.data);
    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { success: true, message: 'Keahlian berhasil ditambahkan!' };
  } catch (error) {
    console.error('Create skill error:', error);
    return { success: false, error: 'Gagal menambahkan keahlian.' };
  }
}

export async function updateSkillAction(id: string, data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = skillSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data keahlian tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db
      .update(skills)
      .set({ ...validated.data, updatedAt: new Date() })
      .where(eq(skills.id, id));

    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { success: true, message: 'Keahlian berhasil diperbarui!' };
  } catch (error) {
    console.error('Update skill error:', error);
    return { success: false, error: 'Gagal memperbarui keahlian.' };
  }
}

export async function deleteSkillAction(id: string): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    await db.delete(skills).where(eq(skills.id, id));

    revalidatePath('/');
    revalidatePath('/admin/skills');

    return { success: true, message: 'Keahlian berhasil dihapus!' };
  } catch (error) {
    console.error('Delete skill error:', error);
    return { success: false, error: 'Gagal menghapus keahlian.' };
  }
}

// ==========================================
// 4. PROJECTS ACTIONS
// ==========================================
export async function createProjectAction(data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = projectSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data proyek tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    let slug = validated.data.slug;
    if (!slug) {
      slug = validated.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
    }

    // Cek keunikan slug
    const existing = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug)).limit(1);
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    await db.insert(projects).values({
      ...validated.data,
      slug,
    });
    revalidatePath('/');
    revalidatePath('/admin/projects');

    return { success: true, message: 'Proyek portofolio berhasil ditambahkan!' };
  } catch (error) {
    console.error('Create project error:', error);
    return { success: false, error: 'Gagal menambahkan proyek.' };
  }
}

export async function updateProjectAction(id: string, data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = projectSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data proyek tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    let slug = validated.data.slug;
    if (!slug) {
      slug = validated.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
    }

    await db
      .update(projects)
      .set({ ...validated.data, slug, updatedAt: new Date() })
      .where(eq(projects.id, id));

    revalidatePath('/');
    revalidatePath('/admin/projects');

    return { success: true, message: 'Proyek portofolio berhasil diperbarui!' };
  } catch (error) {
    console.error('Update project error:', error);
    return { success: false, error: 'Gagal memperbarui proyek.' };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    await db.delete(projects).where(eq(projects.id, id));

    revalidatePath('/');
    revalidatePath('/admin/projects');

    return { success: true, message: 'Proyek berhasil dihapus!' };
  } catch (error) {
    console.error('Delete project error:', error);
    return { success: false, error: 'Gagal menghapus proyek.' };
  }
}

// ==========================================
// 5. EXPERIENCES ACTIONS
// ==========================================
export async function createExperienceAction(data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = experienceSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data pengalaman tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db.insert(experiences).values(validated.data);
    revalidatePath('/');
    revalidatePath('/admin/experience');

    return { success: true, message: 'Pengalaman berhasil ditambahkan!' };
  } catch (error) {
    console.error('Create experience error:', error);
    return { success: false, error: 'Gagal menambahkan pengalaman.' };
  }
}

export async function updateExperienceAction(id: string, data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = experienceSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data pengalaman tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db
      .update(experiences)
      .set({ ...validated.data, updatedAt: new Date() })
      .where(eq(experiences.id, id));

    revalidatePath('/');
    revalidatePath('/admin/experience');

    return { success: true, message: 'Pengalaman berhasil diperbarui!' };
  } catch (error) {
    console.error('Update experience error:', error);
    return { success: false, error: 'Gagal memperbarui pengalaman.' };
  }
}

export async function deleteExperienceAction(id: string): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    await db.delete(experiences).where(eq(experiences.id, id));

    revalidatePath('/');
    revalidatePath('/admin/experience');

    return { success: true, message: 'Pengalaman berhasil dihapus!' };
  } catch (error) {
    console.error('Delete experience error:', error);
    return { success: false, error: 'Gagal menghapus pengalaman.' };
  }
}

// ==========================================
// 6. CERTIFICATES ACTIONS
// ==========================================
export async function createCertificateAction(data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = certificateSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data sertifikat tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db.insert(certificates).values(validated.data);
    revalidatePath('/');
    revalidatePath('/admin/certificates');

    return { success: true, message: 'Sertifikat berhasil ditambahkan!' };
  } catch (error) {
    console.error('Create certificate error:', error);
    return { success: false, error: 'Gagal menambahkan sertifikat.' };
  }
}

export async function updateCertificateAction(id: string, data: unknown): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    const validated = certificateSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: 'Data sertifikat tidak valid.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    await db
      .update(certificates)
      .set({ ...validated.data, updatedAt: new Date() })
      .where(eq(certificates.id, id));

    revalidatePath('/');
    revalidatePath('/admin/certificates');

    return { success: true, message: 'Sertifikat berhasil diperbarui!' };
  } catch (error) {
    console.error('Update certificate error:', error);
    return { success: false, error: 'Gagal memperbarui sertifikat.' };
  }
}

export async function deleteCertificateAction(id: string): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    await db.delete(certificates).where(eq(certificates.id, id));

    revalidatePath('/');
    revalidatePath('/admin/certificates');

    return { success: true, message: 'Sertifikat berhasil dihapus!' };
  } catch (error) {
    console.error('Delete certificate error:', error);
    return { success: false, error: 'Gagal menghapus sertifikat.' };
  }
}

// ==========================================
// 7. CONTACT MESSAGES ACTIONS (ADMIN)
// ==========================================
export async function markMessageAsReadAction(id: string, isRead: boolean): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id));

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');

    return { success: true, message: `Status pesan berhasil diperbarui!` };
  } catch (error) {
    console.error('Mark message error:', error);
    return { success: false, error: 'Gagal mengubah status pesan.' };
  }
}

export async function deleteMessageAction(id: string): Promise<ActionResponse> {
  try {
    await ensureAuthenticated();
    await db.delete(contactMessages).where(eq(contactMessages.id, id));

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');

    return { success: true, message: 'Pesan berhasil dihapus.' };
  } catch (error) {
    console.error('Delete message error:', error);
    return { success: false, error: 'Gagal menghapus pesan.' };
  }
}
