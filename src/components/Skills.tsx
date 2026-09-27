"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

const skills = [
  { name: "Vue.js", top: "20%", left: "15%", speed: 0.5, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { name: "Flutter", top: "25%", left: "65%", speed: 0.8, color: "bg-sky-100 text-sky-700 border-sky-200" },
  { name: "TypeScript", top: "50%", left: "10%", speed: 0.3, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "Tailwind CSS", top: "60%", left: "65%", speed: 0.6, color: "bg-teal-100 text-teal-700 border-teal-200" },
  { name: "Laravel", top: "75%", left: "25%", speed: 0.4, color: "bg-red-100 text-red-700 border-red-200" },
  { name: "Pinia", top: "15%", left: "45%", speed: 0.7, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { name: "React.js", top: "45%", left: "80%", speed: 0.5, color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { name: "MySQL", top: "75%", left: "80%", speed: 0.9, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { name: "Python", top: "35%", left: "30%", speed: 0.2, color: "bg-stone-200 text-stone-800 border-stone-300" },
  { name: "Figma", top: "85%", left: "55%", speed: 0.6, color: "bg-rose-100 text-rose-700 border-rose-200" },
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    if (!container) return;

    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      gsap.fromTo(
        bgTextRef.current,
        { y: -100 },
        {
          y: 100,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isDesktop } = context.conditions as any;
        const multiplier = isDesktop ? 1 : 0.4;

        pillsRef.current.forEach((pill, i) => {
          if (!pill) return;
          const speed = skills[i].speed;

          gsap.fromTo(
            pill,
            { y: 150 * speed * multiplier, opacity: 0 },
            {
              y: -150 * speed * multiplier,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );

          gsap.to(pill, {
            y: `+=${15 * speed}`,
            x: `+=${10 * speed}`,
            duration: 2 + speed,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center bg-transparent overflow-hidden"
    >
      <div 
        ref={bgTextRef} 
        className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-[0.03]"
      >
        <h2 className="text-[20vw] font-black text-stone-900 select-none">
          {t.skills.bgText}
        </h2>
      </div>

      <div className="z-10 text-center pointer-events-none">
        <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-orange-400 mb-2 md:mb-4">
          {t.skills.subtitle}
        </p>
        <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-stone-800 drop-shadow-sm">
          {t.skills.title}
        </h2>
      </div>

      {skills.map((skill, i) => (
        <div
          key={i}
          ref={(el) => {
            pillsRef.current[i] = el;
          }}
          className={`absolute px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] border pointer-events-auto hover:scale-110 transition-transform duration-300 cursor-none ${skill.color}`}
          style={{
            top: skill.top,
            left: skill.left,
          }}
        >
          {skill.name}
        </div>
      ))}
    </section>
  );
}
