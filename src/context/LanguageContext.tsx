"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "id";

export const translations = {
  en: {
    hero: {
      subtitle: "Portfolio v1.0",
      iBuild: "I BUILD",
      digital: "DIGITAL",
      experiences: "EXPERIENCES",
      description: "Hello, I'm ",
      descriptionBold: "Ahnan",
      descriptionEnd: ". A Fullstack Developer who turns lines of code into stunning visual experiences.",
      cta: "Start Exploring",
      scrollDown: "Scroll down ↓"
    },
    skills: {
      bgText: "AHNAN",
      subtitle: "Tech Stack",
      title: "THE TOOLS"
    },
    bento: {
      title: "ABOUT ME",
      bio: "Crafting digital experiences with a clean, cinematic approach. I bridge the gap between design and robust engineering.",
      locationTitle: "Based in",
      location: "Indonesia",
      learningTitle: "Currently Exploring",
      learning: "AI Agents & Advanced Frontend",
      statusTitle: "Status",
      status: "Open to Work",
    },
    commandPalette: {
      trigger: "Quick Menu",
      placeholder: "Type a command or search...",
      noResults: "No matching commands found.",
      navigation: "Navigation",
      actions: "Quick Actions",
      navHero: "Home / Top",
      navAbout: "About Me",
      navSkills: "Tech Stack & Tools",
      navProjects: "Projects Archive",
      navContact: "Terminal Contact",
      actionEmail: "Copy Email Address",
      emailCopied: "Email copied to clipboard!",
      actionGithub: "Visit GitHub Profile",
      actionLinkedin: "Visit LinkedIn Profile",
      actionLang: "Toggle Language (EN / ID)",
      actionResume: "View / Download Resume (CV)",
      shortcutHint: "Use ↑↓ to navigate, ↵ to select, ESC to close"
    },
    projects: {
      bgText: "WORKS WORKS WORKS",
      title: "THE ARCHIVES",
      subtitle: "Selected Works 2025 - 2026",
      btnDetail: "View Role & Details",
      closeDetail: "Close Details",
      role: "Role:",
      techStack: "Main Tech Stack:",
      list: [
        {
          id: 1,
          title: "SurveyRent Hub",
          role: "Frontend Developer",
          desc: "A B2B web portal for measurement tool rentals and partner management. I was responsible for refactoring the architecture into Clean Code using Vue and TypeScript, separating a centralized API layer, managing global state with Pinia, and building a real-time order management system integrated with Barcode Scanners & Google Maps API."
        },
        {
          id: 2,
          title: "SurveyRent App",
          role: "Frontend Developer",
          desc: "A cross-platform mobile application for surveying tool rentals. My main focus was performing pixel-perfect UI slicing from Figma to Flutter, building a centralized HTTP Client with JWT auto-refresh, implementing real-time Order Tracking, and designing an interactive notification module."
        },
        {
          id: 3,
          title: "Modern E-Commerce",
          role: "Frontend Developer (Freelance)",
          desc: "Performed pixel-perfect UI slicing from Figma to responsive frontend code for an E-Commerce platform. I fully focused on implementing modern interface designs using a mobile-first approach, leveraging the reliability of Vue.js and React.js combined with CSS frameworks for a seamless shopping experience across devices."
        },
        {
          id: 4,
          title: "Posyandu Digital",
          role: "Full Stack Developer",
          desc: "A Posyandu healthcare information system platform for digital data management and patient monitoring. I designed a dynamic CRUD system, optimized MySQL database relations and performance, and built an interactive UI/UX using Vue.js and Inertia.js integration."
        }
      ]
    },
    terminal: {
      bgText: "CONTACT",
      title: "Initialize Contact Sequence.",
      cmdAvailable: "AVAILABLE COMMANDS:",
      cmdContact: "Initialize direct messaging protocol",
      cmdGithub: "View Repository & Source Code ↗",
      cmdLinkedin: "Professional Network Connection ↗",
      cmdClear: "Clear terminal history",
      msgInitiating: "Initiating contact protocol...",
      msgAskName: "What is your name?",
      msgHello: "Hello, ",
      msgAskEmail: ". Enter your email address:",
      msgInvalidEmail: "Invalid email format. Please try again:",
      msgAskMessage: "What message would you like to send?",
      msgEncrypting: "Encrypting and sending message...",
      msgSuccess: "✅ Message sent successfully! I will reply to your email shortly.",
      msgOpening: "Opening link:"
    }
  },
  id: {
    hero: {
      subtitle: "Portfolio v1.0",
      iBuild: "I BUILD",
      digital: "DIGITAL",
      experiences: "EXPERIENCES",
      description: "Halo, saya ",
      descriptionBold: "Ahnan",
      descriptionEnd: ". Seorang Fullstack Developer yang mengubah baris kode menjadi pengalaman visual yang memukau.",
      cta: "Mulai Eksplorasi",
      scrollDown: "Scroll ke bawah ↓"
    },
    skills: {
      bgText: "AHNAN",
      subtitle: "Tech Stack",
      title: "THE TOOLS"
    },
    bento: {
      title: "TENTANG SAYA",
      bio: "Menciptakan pengalaman digital yang bersih dengan pendekatan sinematik. Saya menjembatani jarak antara desain UI/UX dan rekayasa kode yang kuat.",
      locationTitle: "Berlokasi di",
      location: "Indonesia",
      learningTitle: "Sedang Mempelajari",
      learning: "AI Agents & Advanced Frontend",
      statusTitle: "Status",
      status: "Terbuka untuk Bekerja",
    },
    commandPalette: {
      trigger: "Menu Cepat",
      placeholder: "Ketik perintah atau cari...",
      noResults: "Tidak ada perintah yang cocok.",
      navigation: "Navigasi",
      actions: "Aksi Cepat",
      navHero: "Beranda / Atas",
      navAbout: "Tentang Saya",
      navSkills: "Tech Stack & Tools",
      navProjects: "Arsip Proyek",
      navContact: "Kontak Terminal",
      actionEmail: "Salin Alamat Email",
      emailCopied: "Email berhasil disalin ke clipboard!",
      actionGithub: "Buka Profil GitHub",
      actionLinkedin: "Buka Profil LinkedIn",
      actionLang: "Ganti Bahasa (EN / ID)",
      actionResume: "Lihat / Unduh Resume (CV)",
      shortcutHint: "Gunakan ↑↓ untuk navigasi, ↵ untuk memilih, ESC untuk menutup"
    },
    projects: {
      bgText: "WORKS WORKS WORKS",
      title: "THE ARCHIVES",
      subtitle: "Selected Works 2025 - 2026",
      btnDetail: "Lihat Detail & Peran",
      closeDetail: "Tutup Detail",
      role: "Peran:",
      techStack: "Tech Stack Utama:",
      list: [
        {
          id: 1,
          title: "SurveyRent Hub",
          role: "Frontend Developer",
          desc: "Portal web B2B untuk penyewaan alat ukur dan manajemen mitra. Saya bertanggung jawab me-refactor arsitektur Clean Code dengan Vue dan TypeScript, memisahkan layer API terpusat, mengelola global state menggunakan Pinia, serta membangun sistem manajemen pesanan real-time dengan integrasi Barcode Scanner & Google Maps API."
        },
        {
          id: 2,
          title: "SurveyRent App",
          role: "Frontend Developer",
          desc: "Aplikasi mobile cross-platform penyewaan alat survey. Fokus utama saya adalah melakukan slicing UI pixel-perfect dari Figma ke Flutter, membangun HTTP Client terpusat dengan fitur auto-refresh JWT, mengimplementasikan pelacakan pesanan (Order Tracking) secara real-time, dan merancang modul notifikasi interaktif."
        },
        {
          id: 3,
          title: "Modern E-Commerce",
          role: "Frontend Developer (Freelance)",
          desc: "Melakukan UI slicing dari desain Figma menjadi kode frontend yang pixel-perfect dan responsif untuk platform E-Commerce. Saya berfokus penuh pada implementasi desain antarmuka modern menggunakan pendekatan mobile-first, memanfaatkan keandalan Vue.js serta React.js yang dipadukan dengan framework CSS untuk pengalaman berbelanja yang mulus di berbagai perangkat."
        },
        {
          id: 4,
          title: "Posyandu Digital",
          role: "Full Stack Developer",
          desc: "Platform sistem informasi Posyandu untuk manajemen data dan pemantauan warga/pasien secara digital. Saya merancang sistem CRUD yang dinamis, mengoptimalkan relasi dan performa database MySQL, serta membangun antarmuka UI/UX yang interaktif menggunakan integrasi Vue.js dan Inertia.js."
        }
      ]
    },
    terminal: {
      bgText: "CONTACT",
      title: "Initialize Contact Sequence.",
      cmdAvailable: "AVAILABLE COMMANDS:",
      cmdContact: "Mulakan protokol pengiriman pesan langsung",
      cmdGithub: "Lihat Repositori & Kode Sumber ↗",
      cmdLinkedin: "Koneksi Jaringan Profesional ↗",
      cmdClear: "Bersihkan riwayat terminal",
      msgInitiating: "Memulai protokol kontak...",
      msgAskName: "Siapa nama Anda?",
      msgHello: "Halo, ",
      msgAskEmail: ". Masukkan alamat email Anda:",
      msgInvalidEmail: "Format email tidak valid. Silakan coba lagi:",
      msgAskMessage: "Apa pesan yang ingin Anda sampaikan?",
      msgEncrypting: "Mengenkripsi dan mengirim pesan...",
      msgSuccess: "✅ Pesan berhasil terkirim! Saya akan segera membalasnya ke email Anda.",
      msgOpening: "Membuka tautan:"
    }
  }
};

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
