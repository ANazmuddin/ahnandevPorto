"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BOOT_LOGS = [
  { text: "INITIALIZING AHNAN_OS KERNEL v1.0.0", delay: 100 },
  { text: "CORE: Loading React 19 & Next.js runtime... [OK]", delay: 350 },
  { text: "STYLES: Compiling Tailwind CSS & GSAP animations... [OK]", delay: 650 },
  { text: "NETWORK: Securing link to portfolio services... [OK]", delay: 950 },
  { text: "SYSTEM READY: Entering main interface...", delay: 1250 },
];

export default function TerminalPreloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const terminalBoxRef = useRef<HTMLDivElement>(null);
  
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock scroll during preloading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      // Accelerate progress smoothly
      const increment = Math.floor(Math.random() * 8) + 3;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        triggerExit();
      }
    }, 45);

    // Staggered log outputs
    const timeouts: NodeJS.Timeout[] = [];
    BOOT_LOGS.forEach((item) => {
      const t = setTimeout(() => {
        setLogs((prev) => [...prev, item.text]);
      }, item.delay);
      timeouts.push(t);
    });

    const triggerExit = () => {
      setTimeout(() => {
        if (!overlayRef.current) return;

        // Dispatch completion event slightly before curtain completes so Hero reveals in sync
        window.dispatchEvent(new CustomEvent("preloaderComplete"));

        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.style.overflow = originalOverflow || "";
            ScrollTrigger.refresh();
            setIsDone(true);
          },
        });
      }, 200);
    };

    // Allow user to skip by pressing Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearInterval(progressInterval);
        timeouts.forEach(clearTimeout);
        setProgress(100);
        setLogs(BOOT_LOGS.map((b) => b.text));
        triggerExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(progressInterval);
      timeouts.forEach(clearTimeout);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow || "";
    };
  }, []);

  const handleSkip = () => {
    setProgress(100);
    setLogs(BOOT_LOGS.map((b) => b.text));
    if (!overlayRef.current) return;
    
    window.dispatchEvent(new CustomEvent("preloaderComplete"));
    gsap.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        document.body.style.overflow = "";
        ScrollTrigger.refresh();
        setIsDone(true);
      },
    });
  };

  if (isDone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-neutral-950 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none overflow-hidden font-mono"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Terminal Window Box */}
      <div 
        ref={terminalBoxRef}
        className="w-full max-w-xl bg-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
      >
        {/* Window Header */}
        <div className="h-10 md:h-11 bg-neutral-900 border-b border-white/10 flex items-center justify-between px-4 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
            <span className="ml-2 text-stone-500 text-[10px] sm:text-xs font-semibold tracking-wider">
              bash — ahnan.dev
            </span>
          </div>
          
          <button
            onClick={handleSkip}
            className="text-[10px] sm:text-xs text-stone-400 hover:text-white border border-white/10 hover:border-white/30 rounded px-2 py-0.5 transition-colors cursor-pointer"
          >
            SKIP [ESC]
          </button>
        </div>

        {/* Window Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-3 min-h-[220px] sm:min-h-[260px] text-xs sm:text-sm">
          
          {/* Boot messages list */}
          <div className="flex-1 flex flex-col gap-1.5 text-stone-300">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-orange-400 select-none">&gt;</span>
                <span className={index === logs.length - 1 ? "text-white font-medium" : "text-stone-400"}>
                  {log}
                </span>
              </div>
            ))}
            
            {logs.length < BOOT_LOGS.length && (
              <div className="flex items-center gap-2 text-stone-500">
                <span className="text-orange-400 select-none">&gt;</span>
                <span className="inline-block w-2 h-4 bg-orange-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Progress Bar & Status Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-stone-400 uppercase tracking-wider font-semibold">
                Boot Sequence
              </span>
              <span className="text-orange-400 font-bold font-mono">
                {progress}%
              </span>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full bg-neutral-950/80 border border-white/10 rounded-full h-2 overflow-hidden p-[1px]">
              <div 
                className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 h-full rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(249,115,22,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
