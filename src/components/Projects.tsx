"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

const projectAssets = [
  { 
    id: 1, 
    image: "/images/porto3.png",
    tech: ["Vue.js", "TypeScript", "Pinia", "Tailwind CSS", "REST API"],
  },
  { 
    id: 2, 
    image: "/images/porto1.png",
    tech: ["Flutter", "Dart", "MVC Architecture", "REST API"],
  },
  { 
    id: 3, 
    image: "/images/porto4.png",
    tech: ["Vue.js", "React.js", "Tailwind CSS", "Figma", "UI/UX"],
  },
  { 
    id: 4, 
    image: "/images/porto2.png",
    tech: ["Laravel", "Vue.js", "Inertia.js", "MySQL"],
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  const [activeDetail, setActiveDetail] = useState<number | null>(null);
  const { t } = useLanguage();
  const projects = t.projects.list;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const scroll = scrollRef.current;
    if (!section || !scroll) return;

    const ctx = gsap.context(() => {
      const scrollTween = gsap.to(scroll, {
        xPercent: -100 * ((projects.length - 1) / projects.length),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scroll.offsetWidth}`,
          pin: true,
          scrub: 1, 
          invalidateOnRefresh: true,
        },
      });

      gsap.to(bgTextRef.current, {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scroll.offsetWidth}`,
          scrub: 1,
        }
      });

      const cards = gsap.utils.toArray(".project-card");
      cards.forEach((card: any) => {
        const image = card.querySelector(".parallax-bg");
        if (image) {
          gsap.fromTo(
            image,
            { xPercent: -15 },
            {
              xPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-transparent overflow-hidden">
      
      <div 
        ref={bgTextRef} 
        className="absolute top-1/2 -translate-y-1/2 left-0 -z-10 pointer-events-none opacity-[0.03] whitespace-nowrap"
      >
        <h2 className="text-[30vw] font-black text-stone-900 select-none tracking-tighter">
          {t.projects.bgText}
        </h2>
      </div>

      <div className="absolute top-10 md:top-20 left-6 md:left-20 z-10 pointer-events-none drop-shadow-sm">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-stone-800">
          {t.projects.title}
        </h2>
        <p className="text-orange-500 font-bold mt-1 md:mt-2 text-xs md:text-base uppercase tracking-widest">
          {t.projects.subtitle}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex h-full items-center"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project, i) => {
          const assets = projectAssets.find(p => p.id === project.id);
          return (
            <div
              key={project.id}
              className="project-card relative flex h-screen w-screen shrink-0 items-center justify-center px-4 py-20 md:p-20"
            >
              <div className="relative h-[65vh] md:h-[75vh] w-full max-w-5xl overflow-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] group cursor-none border border-stone-200/50 bg-stone-100">
                
                <div className="absolute inset-0 w-[130%] h-full -left-[15%] bg-stone-200">
                  <img
                    src={assets?.image}
                    alt={project.title}
                    className="parallax-bg object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent flex flex-col justify-end p-6 md:p-14" />
                
                <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-14 transition-opacity duration-500 ${activeDetail === project.id ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className="text-white translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3 text-orange-300 font-bold drop-shadow-md">
                      0{i + 1} / 0{projects.length}
                    </p>
                    <h3 className="text-3xl md:text-6xl font-black mb-2 md:mb-4 tracking-tight drop-shadow-lg">{project.title}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mt-2 md:mt-6">
                      <button 
                        onClick={() => setActiveDetail(project.id)}
                        className="px-6 py-3 rounded-full bg-white text-stone-900 font-bold text-sm md:text-base hover:bg-orange-400 hover:text-white transition-colors shadow-xl cursor-none"
                      >
                        {t.projects.btnDetail}
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  className={`absolute inset-0 z-50 bg-stone-900/95 backdrop-blur-xl flex flex-col justify-center p-8 md:p-16 transition-all duration-500 ${
                    activeDetail === project.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12 pointer-events-none"
                  }`}
                >
                  <button 
                    onClick={() => setActiveDetail(null)}
                    className="absolute top-6 right-6 md:top-8 md:right-8 text-stone-400 hover:text-white hover:bg-white/10 p-3 rounded-full transition-colors flex items-center justify-center cursor-none"
                    aria-label={t.projects.closeDetail}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <p className="text-orange-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-3">
                    {t.projects.role} {project.role}
                  </p>
                  <h3 className="text-white text-3xl md:text-5xl font-black mb-6 tracking-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-stone-300 text-sm md:text-lg leading-relaxed max-w-3xl mb-8">
                    {project.desc}
                  </p>

                  <div className="mt-auto">
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-3">{t.projects.techStack}</p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {assets?.tech.map((techItem, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-stone-300 text-xs md:text-sm font-medium hover:bg-orange-500 hover:text-white hover:border-orange-400 transition-colors cursor-none"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
