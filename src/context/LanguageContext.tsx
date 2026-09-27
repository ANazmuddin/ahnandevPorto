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
