"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { 
  Search, 
  Home, 
  User, 
  Cpu, 
  FolderGit2, 
  Terminal, 
  Mail, 
  FileDown, 
  Languages, 
  Check, 
  Command, 
  X, 
  ArrowUpRight 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type CommandItem = {
  id: string;
  category: "navigation" | "actions";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  keywords: string[];
  action: () => void;
  badge?: string;
};

export default function CommandPalette() {
  const { t, lang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler helper
  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("anazmuddin072@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const openLink = (url: string) => {
    setIsOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Commands definition
  const commands: CommandItem[] = useMemo(() => [
    {
      id: "hero",
      category: "navigation",
      title: t.commandPalette.navHero,
      subtitle: "Top of page & overview",
      icon: <Home className="w-4 h-4 text-orange-400" />,
      keywords: ["home", "top", "hero", "beranda", "awal", "utama"],
      action: () => scrollTo("hero"),
    },
    {
      id: "about",
      category: "navigation",
      title: t.commandPalette.navAbout,
      subtitle: "Bio, location & status",
      icon: <User className="w-4 h-4 text-orange-400" />,
      keywords: ["about", "bento", "tentang", "profil", "me", "saya", "bio"],
      action: () => scrollTo("about"),
    },
    {
      id: "skills",
      category: "navigation",
      title: t.commandPalette.navSkills,
      subtitle: "Interactive Arsenal",
      icon: <Cpu className="w-4 h-4 text-orange-400" />,
      keywords: ["skills", "tech", "tools", "arsenal", "keahlian", "stack"],
      action: () => scrollTo("skills"),
    },
    {
      id: "projects",
      category: "navigation",
      title: t.commandPalette.navProjects,
      subtitle: "SurveyRent, Posyandu, E-Commerce",
      icon: <FolderGit2 className="w-4 h-4 text-orange-400" />,
      keywords: ["projects", "projek", "karya", "portfolio", "archives", "arsip"],
      action: () => scrollTo("projects"),
    },
    {
      id: "contact",
      category: "navigation",
      title: t.commandPalette.navContact,
      subtitle: "AhnanOS interactive shell",
      icon: <Terminal className="w-4 h-4 text-orange-400" />,
      keywords: ["contact", "terminal", "email", "hubungi", "pesan", "chat"],
      action: () => scrollTo("contact"),
    },
    {
      id: "resume",
      category: "actions",
      title: t.commandPalette.actionResume,
      subtitle: "PDF Document (Updated 2026)",
      icon: <FileDown className="w-4 h-4 text-emerald-400" />,
      keywords: ["resume", "cv", "curriculum", "vitae", "pdf", "download", "unduh"],
      action: () => {
        setIsOpen(false);
        window.open("/cv.pdf", "_blank");
      },
      badge: "PDF",
    },
    {
      id: "email",
      category: "actions",
      title: copied ? t.commandPalette.emailCopied : t.commandPalette.actionEmail,
      subtitle: "anazmuddin072@gmail.com",
      icon: copied ? <Check className="w-4 h-4 text-green-400" /> : <Mail className="w-4 h-4 text-cyan-400" />,
      keywords: ["email", "copy", "salin", "surat", "contact"],
      action: copyEmail,
      badge: copied ? "Copied!" : "Click to Copy",
    },
    {
      id: "github",
      category: "actions",
      title: t.commandPalette.actionGithub,
      subtitle: "github.com/ANazmuddin",
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      ),
      keywords: ["github", "repo", "source", "code", "git"],
      action: () => openLink("https://github.com/ANazmuddin"),
    },
    {
      id: "linkedin",
      category: "actions",
      title: t.commandPalette.actionLinkedin,
      subtitle: "linkedin.com/in/AhmadNazmuddin",
      icon: (
        <svg className="w-4 h-4 fill-[#0a66c2]" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      keywords: ["linkedin", "network", "career", "koneksi", "profesional"],
      action: () => openLink("https://linkedin.com/in/AhmadNazmuddin"),
    },
    {
      id: "language",
      category: "actions",
      title: t.commandPalette.actionLang,
      subtitle: `Current: ${lang.toUpperCase()}`,
      icon: <Languages className="w-4 h-4 text-amber-400" />,
      keywords: ["language", "bahasa", "translate", "terjemah", "en", "id", "switch"],
      action: () => {
        toggleLanguage();
      },
      badge: lang.toUpperCase(),
    },
  ], [t, lang, copied, toggleLanguage]);

  // Filter commands based on input
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase().trim();
    return commands.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(lower);
      const matchSub = cmd.subtitle?.toLowerCase().includes(lower);
      const matchKeywords = cmd.keywords.some((k) => k.toLowerCase().includes(lower));
      return matchTitle || matchSub || matchKeywords;
    });
  }, [query, commands]);

  // Handle keyboard shortcut for open/close & list navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Reset selectedIndex when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Floating Trigger Button (Header Right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-24 md:top-8 md:right-32 z-[90] px-3 py-1.5 md:px-3.5 md:py-2 rounded-full bg-white/70 backdrop-blur-md border border-stone-200/80 text-stone-700 font-medium text-xs md:text-sm shadow-sm hover:bg-white hover:text-stone-900 hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        aria-label="Open Command Palette"
      >
        <Command className="w-3.5 h-3.5 text-orange-500" />
        <span className="hidden sm:inline font-medium text-xs">{t.commandPalette.trigger}</span>
        <kbd className="hidden sm:inline font-mono text-[10px] bg-stone-100 border border-stone-300/80 px-1.5 py-0.5 rounded text-stone-500 font-semibold">
          ⌘K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[999] flex items-start justify-center pt-20 md:pt-28 px-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-neutral-900/95 border border-white/10 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden text-stone-200 flex flex-col font-sans"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-white/10 bg-neutral-900">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.commandPalette.placeholder}
                className="w-full bg-transparent border-none outline-none text-white text-sm md:text-base placeholder-stone-500 py-4 px-3"
                autoComplete="off"
                spellCheck="false"
              />
              {query ? (
                <button 
                  onClick={() => setQuery("")}
                  className="p-1 hover:text-white text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="text-[10px] font-mono border border-white/10 px-1.5 py-0.5 rounded text-stone-400">
                  ESC
                </kbd>
              )}
            </div>

            {/* Commands List Area */}
            <div 
              ref={listRef}
              className="max-h-[340px] overflow-y-auto p-2 scrollbar-none flex flex-col gap-1"
            >
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-sm">
                  {t.commandPalette.noResults}
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected 
                          ? "bg-orange-500/15 border-l-2 border-orange-500 text-white pl-3" 
                          : "text-stone-300 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg border ${
                          isSelected ? "bg-orange-500/20 border-orange-500/30" : "bg-white/5 border-white/10"
                        }`}>
                          {cmd.icon}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold truncate leading-tight">
                            {cmd.title}
                          </span>
                          {cmd.subtitle && (
                            <span className="text-xs text-stone-400 truncate mt-0.5">
                              {cmd.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {cmd.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            cmd.badge === "Copied!" 
                              ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                              : "bg-white/10 text-stone-300 border border-white/10"
                          }`}>
                            {cmd.badge}
                          </span>
                        )}
                        {isSelected && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Shortcut Guide */}
            <div className="px-4 py-2.5 bg-neutral-950/70 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400 select-none">
              <span className="truncate">{t.commandPalette.shortcutHint}</span>
              <span className="text-orange-400/80 font-bold shrink-0 ml-2">AhnanOS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
