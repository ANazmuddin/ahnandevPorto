"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutBento() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();
  
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Live clock for Jakarta (WIB - UTC+7)
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: "Asia/Jakarta",
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit",
        hour12: false 
      };
      setTime(now.toLocaleTimeString("en-GB", options) + " WIB");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const validCards = cardsRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 35, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto flex flex-col items-center">
      
      {/* Section Header */}
      <div className="z-10 text-center mb-8 md:mb-12">
        <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-orange-500 mb-1">
          {t.bento.title}
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-800 tracking-tight">
          Crafting Code & Interfaces
        </h2>
      </div>

      {/* Bento Grid Layout - Responsive: 2 cols on mobile, 4 cols & 2 rows on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 sm:gap-4 md:gap-6 w-full md:auto-rows-[240px]">
        
        {/* Card 1: Main Bio & Profile (Mobile: full width (2 cols), Desktop: 2 cols x 2 rows) */}
        <div 
          ref={(el) => { cardsRef.current[0] = el; }}
          className="col-span-2 md:col-span-2 md:row-span-2 bg-white/70 backdrop-blur-md border border-stone-200/70 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition-all duration-300 relative overflow-hidden group min-h-[220px] md:min-h-0"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-orange-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-400/20 transition-all duration-500" />
          
          {/* Top Row: Avatar & Status Badge */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
              A
            </div>
            <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 font-semibold text-xs tracking-wide">
              Fullstack Dev
            </div>
          </div>
          
          {/* Bottom Area: Name & Bio */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-800 tracking-tight leading-tight mb-2 md:mb-3">
              {t.hero.descriptionBold}
            </h3>
            <p className="text-stone-600 font-medium leading-relaxed text-xs sm:text-sm md:text-base">
              {t.bento.bio}
            </p>
          </div>
        </div>

        {/* Card 2: Location & Live Clock (Mobile: 1 col, Desktop: 1 col x 1 row) */}
        <div 
          ref={(el) => { cardsRef.current[1] = el; }}
          className="col-span-1 md:col-span-1 md:row-span-1 bg-white/70 backdrop-blur-md border border-stone-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition-all duration-300 relative overflow-hidden group min-h-[140px] sm:min-h-[150px] md:min-h-0"
        >
          {/* Subtle Map Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none" 
            style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "10px 10px" }} 
          />
          
          <div className="relative z-10 flex justify-between items-center">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-stone-400 uppercase truncate">
              {t.bento.locationTitle}
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>
          
          <div className="relative z-10 mt-2">
            <h4 className="text-base sm:text-lg md:text-xl font-black text-stone-800 mb-0.5 tracking-tight">
              {t.bento.location}
            </h4>
            <div className="text-stone-500 font-mono text-[11px] sm:text-xs md:text-sm font-medium" suppressHydrationWarning>
              {time || "00:00:00 WIB"}
            </div>
          </div>
        </div>

        {/* Card 3: Status / Open to Work (Mobile: 1 col, Desktop: 1 col x 1 row) */}
        <div 
          ref={(el) => { cardsRef.current[2] = el; }}
          className="col-span-1 md:col-span-1 md:row-span-1 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.15)] transition-all duration-300 group min-h-[140px] sm:min-h-[150px] md:min-h-0"
        >
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-stone-400 uppercase truncate">
            {t.bento.statusTitle}
          </span>
          
          <div className="mt-2">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
              </div>
              <h4 className="text-xs sm:text-sm md:text-lg font-black text-white leading-tight">
                {t.bento.status}
              </h4>
            </div>
            <p className="text-stone-400 text-[10px] sm:text-xs md:text-sm truncate">
              Fullstack & Frontend
            </p>
          </div>
        </div>

        {/* Card 4: Currently Learning (Mobile: full width (2 cols), Desktop: 2 cols x 1 row) */}
        <div 
          ref={(el) => { cardsRef.current[3] = el; }}
          className="col-span-2 md:col-span-2 md:row-span-1 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(249,115,22,0.22)] hover:shadow-[0_12px_36px_rgba(249,115,22,0.35)] transition-all duration-300 text-white relative overflow-hidden group min-h-[135px] md:min-h-0"
        >
          {/* Abstract light sphere */}
          <div className="absolute right-0 top-0 w-44 h-44 bg-white/15 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700 ease-out pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-orange-100 uppercase">
              {t.bento.learningTitle}
            </span>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm font-mono text-orange-50 font-bold">
              2026
            </span>
          </div>
          
          <div className="relative z-10 mt-2 md:mt-0">
            <h4 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-tight mb-1">
              {t.bento.learning}
            </h4>
            <p className="text-orange-100 text-xs sm:text-sm font-medium">
              Exploring cutting-edge web & AI systems
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
