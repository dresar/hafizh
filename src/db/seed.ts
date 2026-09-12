import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import bcrypt from 'bcryptjs';
import { db } from './index';
import {
  adminUsers,
  profiles,
  educations,
  skills,
  projects,
  experiences,
  certificates,
  contactMessages,
} from './schema';
import { count } from 'drizzle-orm';

async function seed() {
  console.log('Seeding initial development database for Muhammad Fauzan Al Hafizh...');

  // 1. Admin User
  const existingUsers = await db.select({ value: count() }).from(adminUsers);
  if (Number(existingUsers[0]?.value || 0) === 0) {
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'password_dev_hafizh_2026';
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(adminUsers).values({
      username: process.env.INITIAL_ADMIN_USERNAME || 'hafizh',
      email: process.env.INITIAL_ADMIN_EMAIL || 'hafizh@example.com',
      passwordHash,
    });
    console.log('Admin user initialized.');
  }

  // 2. Profile
  const existingProfile = await db.select({ value: count() }).from(profiles);
  if (Number(existingProfile[0]?.value || 0) === 0) {
    await db.insert(profiles).values({
      fullName: 'Muhammad Fauzan Al Hafizh',
      headline: 'Mahasiswa D3 Teknik Informatika – Fakultas Vokasi Universitas Sumatera Utara',
      bio: 'Mahasiswa D3 Teknik Informatika di Universitas Sumatera Utara yang memiliki rasa ingin tahu tinggi dan ketertarikan mendalam untuk mempelajari teknologi komputer, perangkat lunak, perangkat keras, pemrograman, serta basis data. Memiliki kemampuan komunikasi dan kerja sama yang baik, mudah beradaptasi, serta aktif mengembangkan potensi melalui kegiatan akademik maupun organisasi.',
      avatarUrl: 'https://raw.githubusercontent.com/dresar/hafizh/main/asset/avatar.jpg',
      resumeUrl: '/cv-hafizh.pdf',
      location: 'Lubuk Pakam, Sumatera Utara',
      email: 'fauzanalhafiz1007@gmail.com',
      phone: '0853-6352-0813',
      githubUrl: 'https://github.com/dresar',
      linkedinUrl: 'https://linkedin.com',
      whatsappUrl: 'https://wa.me/6285363520813',
      isAvailable: true,
    });
    console.log('Profile initialized.');
  }

  // 3. Educations
  const existingEdu = await db.select({ value: count() }).from(educations);
  if (Number(existingEdu[0]?.value || 0) === 0) {
    await db.insert(educations).values([
      {
        institution: 'Universitas Sumatera Utara',
        degree: 'D3 Teknik Informatika',
        fieldOfStudy: 'Fakultas Vokasi',
        startDate: '2026',
        endDate: null,
        isCurrent: true,
        description: 'Pendidikan vokasi rekayasa perangkat lunak, struktur data, algoritma komputer, dan arsitektur basis data relasional.',
        orderIndex: 1,
        isPublished: true,
      },
      {
        institution: 'MAS Raudhatussalam',
        degree: 'Madrasah Aliyah',
        fieldOfStudy: 'Jurusan IPA (Ilmu Pengetahuan Alam)',
        startDate: '2022',
        endDate: '2025',
        isCurrent: false,
        description: 'Menyelesaikan pendidikan menengah atas peminatan Matematika & Ilmu Pengetahuan Alam (MIPA). Lulus tahun 2025.',
        orderIndex: 2,
        isPublished: true,
      },
    ]);
    console.log('Real CV educations initialized.');
  }

  // 4. Skills
  const existingSkills = await db.select({ value: count() }).from(skills);
  if (Number(existingSkills[0]?.value || 0) === 0) {
    await db.insert(skills).values([
      {
        name: 'Python (dasar)',
        category: 'Backend',
        iconClass: 'fa-brands fa-python',
        proficiencyLevel: 75,
        orderIndex: 1,
        isPublished: true,
      },
      {
        name: 'HTML (dasar)',
        category: 'Frontend',
        iconClass: 'fa-brands fa-html5',
        proficiencyLevel: 80,
        orderIndex: 2,
        isPublished: true,
      },
      {
        name: 'Bahasa C / C++ (dasar)',
        category: 'Backend',
        iconClass: 'fa-solid fa-code',
        proficiencyLevel: 72,
        orderIndex: 3,
        isPublished: true,
      },
      {
        name: 'Basis Data (Database)',
        category: 'Database',
        iconClass: 'fa-solid fa-database',
        proficiencyLevel: 78,
        orderIndex: 4,
        isPublished: true,
      },
      {
        name: 'Visual Studio Code',
        category: 'Tools',
        iconClass: 'fa-solid fa-laptop-code',
        proficiencyLevel: 88,
        orderIndex: 5,
        isPublished: true,
      },
      {
        name: 'Code::Blocks',
        category: 'Tools',
        iconClass: 'fa-solid fa-cube',
        proficiencyLevel: 76,
        orderIndex: 6,
        isPublished: true,
      },
      {
        name: 'Canva & Photoshop',
        category: 'Tools',
        iconClass: 'fa-solid fa-palette',
        proficiencyLevel: 84,
        orderIndex: 7,
        isPublished: true,
      },
      {
        name: 'Microsoft Office (Word, Excel, PPT)',
        category: 'Tools',
        iconClass: 'fa-solid fa-file-word',
        proficiencyLevel: 90,
        orderIndex: 8,
        isPublished: true,
      },
      {
        name: 'Komunikasi & Kerja Sama Tim',
        category: 'Soft Skills',
        iconClass: 'fa-solid fa-users',
        proficiencyLevel: 92,
        orderIndex: 9,
        isPublished: true,
      },
      {
        name: 'Kemampuan Beradaptasi & Rasa Ingin Tahu',
        category: 'Soft Skills',
        iconClass: 'fa-solid fa-brain',
        proficiencyLevel: 95,
        orderIndex: 10,
        isPublished: true,
      },
    ]);
    console.log('Real CV skills initialized.');
  }

  // 5. Projects
  const existingProjects = await db.select({ value: count() }).from(projects);
  if (Number(existingProjects[0]?.value || 0) === 0) {
    await db.insert(projects).values([
      {
        title: '[DATA CONTOH] Modern E-Commerce Platform',
        slug: 'modern-ecommerce-platform',
        description: 'Aplikasi belanja daring dengan integrasi payment gateway, katalog produk real-time, dan panel admin berbasis Next.js.',
        content: 'Proyek ini dirancang untuk menunjukkan kapabilitas pengembangan arsitektur web modern yang responsif dan cepat. Menggunakan Next.js App Router dan Drizzle ORM.',
        thumbnailUrl: 'https://raw.githubusercontent.com/dresar/hafizh/main/asset/home_projects.png',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        isFeatured: true,
        orderIndex: 1,
        isPublished: true,
      },
      {
        title: '[DATA CONTOH] SaaS Performance & Analytics Dashboard',
        slug: 'saas-analytics-dashboard',
        description: 'Dashboard analitik interaktif untuk pemantauan metrik bisnis, visualisasi diagram interaktif, dan manajemen pengguna.',
        content: 'Dibangun dengan fokus pada kecepatan muat dan keterbacaan data visual tinggi menggunakan komponen bergaya Vuetify/Material.',
        thumbnailUrl: 'https://raw.githubusercontent.com/dresar/hafizh/main/asset/admin_dashboard.png',
        technologies: ['React', 'TypeScript', 'Neon PostgreSQL', 'Tailwind CSS'],
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        isFeatured: true,
        orderIndex: 2,
        isPublished: true,
      },
      {
        title: '[DATA CONTOH] Collaborative Task Management App',
        slug: 'collaborative-task-management',
        description: 'Sistem manajemen proyek tim dengan linimasa terstruktur, pelacakan kanban, dan notifikasi real-time.',
        content: 'Memfasilitasi koordinasi lintas divisi secara efisien dengan antarmuka yang bersih dan mudah digunakan.',
        thumbnailUrl: 'https://raw.githubusercontent.com/dresar/hafizh/main/asset/admin_projects.png',
        technologies: ['Next.js', 'Server Actions', 'Drizzle ORM'],
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com',
        isFeatured: false,
        orderIndex: 3,
        isPublished: true,
      },
    ]);
    console.log('Sample projects initialized.');
  }

  // 6. Experiences
  const existingExp = await db.select({ value: count() }).from(experiences);
  if (Number(existingExp[0]?.value || 0) === 0) {
    await db.insert(experiences).values([
      {
        company: 'Pondok Pesantren Raudhatussalam',
        role: 'Pengurus Asrama',
        employmentType: 'Organisasi',
        location: 'Sumatera Utara',
        startDate: '2022',
        endDate: '2025',
        isCurrent: false,
        description: 'Berpartisipasi aktif dalam kegiatan organisasi dan pembinaan anggota, membangun komunikasi dan kerja sama yang solid dengan anggota serta lingkungan sekitar, melatih kedisiplinan dan tanggung jawab, serta berkontribusi dalam pelaksanaan berbagai kegiatan di lingkungan asrama.',
        orderIndex: 1,
        isPublished: true,
      },
      {
        company: 'Kompetisi Olahraga Antarsekolah & Antardesa',
        role: 'Peserta Tournament Futsal dan Mini Soccer',
        employmentType: 'Prestasi & Tim',
        location: 'Sumatera Utara',
        startDate: '2023',
        endDate: '2025',
        isCurrent: false,
        description: 'Mengikuti berbagai turnamen futsal dan mini soccer antarsekolah dan antardesa, mengembangkan kemampuan kerja sama tim, kedisiplinan, komunikasi taktis lapangan, dan sportivitas tinggi.',
        orderIndex: 2,
        isPublished: true,
      },
    ]);
    console.log('Real CV experiences initialized.');
  }

  // 7. Certificates
  const existingCerts = await db.select({ value: count() }).from(certificates);
  if (Number(existingCerts[0]?.value || 0) === 0) {
    await db.insert(certificates).values([
      {
        title: '[DATA CONTOH] Certified Full-Stack Developer Professional',
        issuer: 'Global Tech Certification Institute',
        issueDate: '2024',
        expirationDate: '2027',
        credentialId: 'HAFIZH-CERT-2024-001',
        credentialUrl: 'https://example.com/verify',
        imageUrl: 'https://raw.githubusercontent.com/dresar/hafizh/main/asset/home_certifications.png',
        orderIndex: 1,
        isPublished: true,
      },
    ]);
    console.log('Sample certificates initialized.');
  }

  // 8. Contact Messages
  const existingMsg = await db.select({ value: count() }).from(contactMessages);
  if (Number(existingMsg[0]?.value || 0) === 0) {
    await db.insert(contactMessages).values([
      {
        name: 'Technical Recruiter [CONTOH PESAN]',
        email: 'recruiter@techcompany.com',
        subject: 'Peluang Kolaborasi Proyek & Software Engineer',
        message: 'Halo Muhammad Fauzan Al Hafizh, kami sangat tertarik dengan portofolio dan kompetensi teknis Anda. Apakah Anda terbuka untuk mendiskusikan peluang kolaborasi?',
        isRead: false,
      },
    ]);
    console.log('Sample message initialized.');
  }

  console.log('Database seeding successfully completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error during database seeding:', err);
  process.exit(1);
});
