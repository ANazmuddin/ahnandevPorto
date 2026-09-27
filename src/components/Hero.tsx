"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./Magnetic";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.to(contentRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 150,
      opacity: 0, 
    });

    gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: "linear",
    });

    const tl = gsap.timeline();
    
    const lines = textRef.current ? gsap.utils.toArray(textRef.current.querySelectorAll(".line")) : [];
    
    tl.fromTo(
      lines,
      { y: 100, opacity: 0, rotateZ: 3 },
      { y: 0, opacity: 1, rotateZ: 0, duration: 1.2, ease: "power4.out", stagger: 0.15 }
    )
    .fromTo(
      subRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.8"
    )
    .fromTo(
      ctaRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.6"
    );

  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="absolute top-[45%] left-0 -translate-y-1/2 w-[200vw] overflow-hidden -z-10 opacity-[0.03] pointer-events-none text-[35vw] md:text-[15vw] font-black whitespace-nowrap text-stone-900 select-none">
        <div ref={marqueeRef} className="inline-flex gap-10">
          <span>FRONTEND DEVELOPER • CREATIVE CODER • FULLSTACK ENGINEER • </span>
          <span>FRONTEND DEVELOPER • CREATIVE CODER • FULLSTACK ENGINEER • </span>
        </div>
      </div>

      <div ref={contentRef} className="z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        <h1
          ref={textRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-stone-800"
        >
          <div className="overflow-hidden pb-2">
            <span className="line block">{t.hero.iBuild}</span>
          </div>
          <div className="overflow-hidden pb-2">
            <span className="line block italic text-orange-400">{t.hero.digital}</span>
          </div>
          <div className="overflow-hidden pb-2">
            <span className="line block">{t.hero.experiences}</span>
          </div>
        </h1>

        <p
          ref={subRef}
          className="mt-6 md:mt-10 text-base sm:text-lg md:text-2xl text-stone-600 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          {t.hero.description} <strong className="text-stone-900 font-bold border-b-2 border-orange-400">{t.hero.descriptionBold}</strong>{t.hero.descriptionEnd}
        </p>

        <div ref={ctaRef} className="mt-10 md:mt-16">
          <Magnetic>
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="group relative px-8 py-4 md:px-10 md:py-5 rounded-full bg-white/60 backdrop-blur-md border border-white text-stone-800 font-bold text-sm md:text-lg overflow-hidden flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:border-orange-300 active:scale-95 transition-all duration-300 cursor-pointer md:cursor-none"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-12 group-active:-translate-y-12">
                {t.hero.cta}
              </span>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-12 z-10 transition-transform duration-300 group-hover:-translate-y-1/2 group-active:-translate-y-1/2 text-white whitespace-nowrap">
                {t.hero.scrollDown}
              </span>
              <div className="absolute inset-0 bg-orange-400 rounded-full scale-0 group-hover:scale-150 group-active:scale-150 transition-transform duration-500 ease-out origin-center" />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
