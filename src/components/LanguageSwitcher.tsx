"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-6 right-6 md:top-8 md:right-8 z-[100] px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/50 backdrop-blur-md border border-stone-200 text-stone-800 font-bold text-xs md:text-sm shadow-sm hover:bg-white hover:shadow-md transition-all cursor-none uppercase tracking-widest flex items-center gap-2"
      aria-label="Toggle Language"
    >
      <span className={lang === "en" ? "text-orange-500" : "text-stone-400"}>EN</span>
      <span className="text-stone-300">|</span>
      <span className={lang === "id" ? "text-orange-500" : "text-stone-400"}>ID</span>
    </button>
  );
}
