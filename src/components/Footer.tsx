"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

interface SpriteInfo {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  aspectRatio: number;
}

interface Pedestrian {
  id: number;
  row: "back" | "front";
  targetCanvas: "back" | "front";
  spriteIndex: number;
  x: number;
  baseYOffset: number;
  height: number;
  speed: number;
  bounceHeight: number;
  bounceFreq: number;
  bouncePhase: number;
}

export default function Footer() {
  const { t } = useLanguage();
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);

  const [isPaused, setIsPaused] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const [spriteError, setSpriteError] = useState<string | null>(null);

  const isPausedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const lastTimestampRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const spritesRef = useRef<SpriteInfo[]>([]);
  const crowdImgRef = useRef<HTMLImageElement | null>(null);
  const pedestriansRef = useRef<Pedestrian[]>([]);
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });

  // Keep isPausedRef in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Validate and extract 15 individual sprites from crowd.png
  const extractAndValidateSprites = useCallback((img: HTMLImageElement): SpriteInfo[] | null => {
    if (!img.naturalWidth || !img.naturalHeight) {
      console.error("crowd.png natural dimensions are missing or invalid");
      return null;
    }

    const cols = 5;
    const rows = 3;
    const cellW = img.naturalWidth / cols;
    const cellH = img.naturalHeight / rows;

    const offscreen = document.createElement("canvas");
    offscreen.width = img.naturalWidth;
    offscreen.height = img.naturalHeight;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) {
      console.error("Could not obtain 2D canvas context for sprite processing");
      return null;
    }

    offCtx.drawImage(img, 0, 0);

    // Verify background transparency: corner pixel (0,0) must have alpha near 0
    const cornerPixel = offCtx.getImageData(0, 0, 1, 1).data;
    if (cornerPixel[3] > 40) {
      console.error("crowd.png background is not transparent (alpha at (0,0) > 40).");
      return null;
    }

    const sprites: SpriteInfo[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const left = Math.round(c * cellW);
        const top = Math.round(r * cellH);
        const right = Math.min(img.naturalWidth, Math.round((c + 1) * cellW));
        const bottom = Math.min(img.naturalHeight, Math.round((r + 1) * cellH));
        const width = right - left;
        const height = bottom - top;

        const cellData = offCtx.getImageData(left, top, width, height).data;

        let minX = width;
        let minY = height;
        let maxX = -1;
        let maxY = -1;

        // Detect non-transparent artwork boundaries, trim empty transparent padding
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const alpha = cellData[idx + 3];
            if (alpha > 15) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        // Validate cell has artwork
        if (maxX < minX || maxY < minY) {
          console.error(`Defective crowd cell at row ${r}, col ${c}: empty artwork.`);
          return null;
        }

        const sx = left + minX;
        const sy = top + minY;
        const sWidth = maxX - minX + 1;
        const sHeight = maxY - minY + 1;

        sprites.push({
          sx,
          sy,
          sWidth,
          sHeight,
          aspectRatio: sWidth / sHeight,
        });
      }
    }

    if (sprites.length !== 15) {
      console.error(`Expected 15 sprites from crowd.png, detected ${sprites.length}`);
      return null;
    }

    return sprites;
  }, []);

  // Initialize or re-populate pedestrians based on current canvas width
  const initPedestrians = useCallback((width: number) => {
    if (spritesRef.current.length !== 15) return;

    const isMobile = width < 600;
    const backCount = isMobile ? 7 : 25;
    const frontCount = isMobile ? 3 : 16;

    const newPedestrians: Pedestrian[] = [];
    let idCounter = 1;

    // --- Back Row: Smaller, walking right (speed > 0) ---
    // Spread evenly across total span plus margin so there is no gap
    const backSpan = Math.max(width + 300, backCount * (isMobile ? 120 : 70));
    let lastBackSprite = -1;

    for (let i = 0; i < backCount; i++) {
      let s = (i * 3 + (i % 2) * 5 + 1) % 15;
      if (s === lastBackSprite) {
        s = (s + 1) % 15;
      }
      lastBackSprite = s;

      const duration = 11 + ((i * 7) % 5) * 1.0; // 11 to 15 seconds
      const speed = backSpan / duration; // positive: to the right
      const initialX = (i / backCount) * backSpan - 150;
      
      const pHeight = isMobile 
        ? 110 + (i % 4) * 8 
        : 155 + (i % 6) * 7; // ~155-190px desktop
      
      const baseYOffset = isMobile
        ? -45 + (i % 3) * 6
        : -65 - (i % 4) * 6; // baseline above bottom of canvas

      // Put ~20-25% of back row pedestrians on the front canvas for natural overlap
      const targetCanvas = i % 4 === 1 ? "front" : "back";

      newPedestrians.push({
        id: idCounter++,
        row: "back",
        targetCanvas,
        spriteIndex: s,
        x: initialX,
        baseYOffset,
        height: pHeight,
        speed,
        bounceHeight: isMobile ? 3 + (i % 3) : 4 + (i % 4), // 4-7px bounce
        bounceFreq: 1.9 + ((i % 5) * 0.05), // ~2 bounces per sec
        bouncePhase: (i * 1.7) % (Math.PI * 2),
      });
    }

    // --- Foreground Row: Larger, walking left (speed < 0), truncated at bottom ---
    const frontSpan = Math.max(width + 400, frontCount * (isMobile ? 180 : 120));
    let lastFrontSprite = -1;

    for (let i = 0; i < frontCount; i++) {
      let s = (i * 4 + 7) % 15;
      if (s === lastFrontSprite) {
        s = (s + 2) % 15;
      }
      lastFrontSprite = s;

      const duration = 10.5 + ((i * 3) % 5) * 1.1; // 10.5 to 15 seconds
      const speed = -(frontSpan / duration); // negative: to the left
      const initialX = (i / frontCount) * frontSpan - 100;

      const pHeight = isMobile
        ? 220 + (i % 3) * 15
        : 275 + (i % 5) * 12; // ~275-325px desktop

      // Baseline below canvas bottom so torso/legs are cut off cleanly
      const baseYOffset = isMobile
        ? 25 + (i % 2) * 8
        : 38 + (i % 3) * 6;

      newPedestrians.push({
        id: idCounter++,
        row: "front",
        targetCanvas: "front",
        spriteIndex: s,
        x: initialX,
        baseYOffset,
        height: pHeight,
        speed,
        bounceHeight: isMobile ? 4 + (i % 3) : 5 + (i % 4), // 5-8px bounce
        bounceFreq: 2.0 + ((i % 3) * 0.04), // 2 times per sec
        bouncePhase: ((i + 3) * 1.9) % (Math.PI * 2),
      });
    }

    pedestriansRef.current = newPedestrians;
  }, []);

  // Render a single animation frame on both canvases
  const drawFrame = useCallback((elapsedTime: number) => {
    const canvasBack = canvasBackRef.current;
    const canvasFront = canvasFrontRef.current;
    const img = crowdImgRef.current;
    const sprites = spritesRef.current;
    const { width, height } = dimensionsRef.current;

    if (!canvasBack || !canvasFront || !img || sprites.length !== 15 || width <= 0 || height <= 0) {
      return;
    }

    const ctxBack = canvasBack.getContext("2d");
    const ctxFront = canvasFront.getContext("2d");
    if (!ctxBack || !ctxFront) return;

    ctxBack.clearRect(0, 0, width, height);
    ctxFront.clearRect(0, 0, width, height);

    const pedestrians = pedestriansRef.current;

    for (let i = 0; i < pedestrians.length; i++) {
      const p = pedestrians[i];
      const sprite = sprites[p.spriteIndex];
      if (!sprite) continue;

      const ctx = p.targetCanvas === "back" ? ctxBack : ctxFront;

      const destWidth = p.height * sprite.aspectRatio;
      const destHeight = p.height;

      // Smooth bouncing: 2 steps per second
      const step = Math.abs(Math.sin(elapsedTime * p.bounceFreq * Math.PI + p.bouncePhase));
      const bounce = step * p.bounceHeight;

      const destX = p.x;
      const baseY = height + p.baseYOffset;
      const destY = baseY - bounce - destHeight;

      // Draw trimmed sprite artwork keeping aspect ratio and opaque interior
      ctx.drawImage(
        img,
        sprite.sx,
        sprite.sy,
        sprite.sWidth,
        sprite.sHeight,
        destX,
        destY,
        destWidth,
        destHeight
      );
    }
  }, []);

  // Update pedestrian positions with elapsed delta time and wrap boundaries smoothly
  const updatePhysics = useCallback((dt: number) => {
    const { width } = dimensionsRef.current;
    if (width <= 0) return;

    const pedestrians = pedestriansRef.current;
    const sprites = spritesRef.current;

    for (let i = 0; i < pedestrians.length; i++) {
      const p = pedestrians[i];
      const sprite = sprites[p.spriteIndex];
      const destWidth = sprite ? p.height * sprite.aspectRatio : 100;
      const totalSpan = width + destWidth + 240;

      p.x += p.speed * dt;

      // Wrapping without sudden jumping
      if (p.speed > 0 && p.x > width + 100) {
        p.x -= totalSpan;
      } else if (p.speed < 0 && p.x < -destWidth - 100) {
        p.x += totalSpan;
      }
    }
  }, []);

  // Main animation loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = now;
      }

      const dt = Math.min((now - lastTimestampRef.current) / 1000, 0.1);
      lastTimestampRef.current = now;

      if (!isPausedRef.current && isVisibleRef.current) {
        elapsedTimeRef.current += dt;
        updatePhysics(dt);
        drawFrame(elapsedTimeRef.current);
      }

      animId = requestAnimationFrame(tick);
      animationFrameRef.current = animId;
    };

    animId = requestAnimationFrame(tick);
    animationFrameRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [drawFrame, updatePhysics]);

  // Load and verify crowd.png asset
  useEffect(() => {
    const img = new Image();
    img.src = "/images/crowd.png";

    img.onload = () => {
      crowdImgRef.current = img;
      const parsedSprites = extractAndValidateSprites(img);
      if (!parsedSprites) {
        setSpriteError(
          "Aset crowd.png tidak valid (membutuhkan kisi 5x3 yang tepat dengan latar belakang transparan)."
        );
        return;
      }
      spritesRef.current = parsedSprites;

      if (dimensionsRef.current.width > 0 && dimensionsRef.current.height > 0) {
        initPedestrians(dimensionsRef.current.width);
        drawFrame(elapsedTimeRef.current);
      }
    };

    img.onerror = () => {
      console.error("Gagal memuat /images/crowd.png");
      setSpriteError("File /images/crowd.png tidak dapat dimuat.");
    };
  }, [extractAndValidateSprites, initPedestrians, drawFrame]);

  // Setup ResizeObserver, DPR capping at 2, and canvas sizing
  useEffect(() => {
    const scene = sceneRef.current;
    const canvasBack = canvasBackRef.current;
    const canvasFront = canvasFrontRef.current;
    if (!scene || !canvasBack || !canvasFront) return;

    const handleResize = () => {
      const rect = scene.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (width <= 0 || height <= 0) return;

      const prevWidth = dimensionsRef.current.width;
      dimensionsRef.current = { width, height, dpr };

      canvasBack.width = Math.floor(width * dpr);
      canvasBack.height = Math.floor(height * dpr);
      canvasFront.width = Math.floor(width * dpr);
      canvasFront.height = Math.floor(height * dpr);

      const ctxB = canvasBack.getContext("2d");
      const ctxF = canvasFront.getContext("2d");
      if (ctxB) ctxB.scale(dpr, dpr);
      if (ctxF) ctxF.scale(dpr, dpr);

      // Re-initialize pedestrians if width changed significantly
      if (Math.abs(width - prevWidth) > 30 || pedestriansRef.current.length === 0) {
        initPedestrians(width);
      }

      drawFrame(elapsedTimeRef.current);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(scene);
    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [initPedestrians, drawFrame]);

  // Handle tab visibility and viewport intersection (pause when hidden/offscreen)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      } else {
        isVisibleRef.current = true;
        lastTimestampRef.current = performance.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          isVisibleRef.current = entry.isIntersecting && !document.hidden;
          if (entry.isIntersecting) {
            lastTimestampRef.current = performance.now();
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(scene);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (e: MediaQueryListEvent) => {
      setIsPaused(e.matches);
      isPausedRef.current = e.matches;
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Pause / Resume toggle without jumping positions
  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (!next) {
        lastTimestampRef.current = performance.now();
      }
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePause();
      }
    },
    [togglePause]
  );

  // Back to top scroll handler with hero state reset
  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reset hero scroll animation state cleanly
    const heroSection = document.getElementById("hero");

    if (prefersReduced) {
      const lenisInstance = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate: boolean }) => void } }).__lenis;
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    } else {
      const lenisInstance = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { duration: number }) => void } }).__lenis;
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.5 });
      } else if (heroSection) {
        heroSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    // Refresh GSAP ScrollTrigger if present
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  };

  return (
    <footer className="w-full bg-[#000000] text-[#f8f7f4] min-h-[620px] md:min-h-[600px] flex flex-col justify-between overflow-x-hidden relative font-sans">
      {/* Top Content: Centered within 1180px with responsive side padding */}
      <div className="w-full max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-8 flex-1 flex flex-col justify-between">
        {/* Three Columns: Desktop 3 cols, Mobile 2 cols + contact on a new row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: Name and Role */}
          <div className="col-span-1 flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f8f7f4]">
              Ahnan.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#b5b5b5] max-w-xs leading-relaxed">
              {t.footer.role}
            </p>
          </div>

          {/* Column 2: Explore Navigation Links */}
          <div className="col-span-1 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-[#b5b5b5] font-semibold mb-3.5 block">
              {t.footer.explore}
            </span>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-[#f8f7f4]">
              <a href="#about" className="hover:text-orange-400 transition-colors py-0.5">
                About
              </a>
              <a href="#skills" className="hover:text-orange-400 transition-colors py-0.5">
                Skills
              </a>
              <a href="#projects" className="hover:text-orange-400 transition-colors py-0.5">
                Projects
              </a>
              <a href="#contact" className="hover:text-orange-400 transition-colors py-0.5">
                Contact
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors py-0.5"
              >
                Resume ↗
              </a>
              <a
                href="https://github.com/ANazmuddin"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors py-0.5"
              >
                GitHub ↗
              </a>
            </nav>
          </div>

          {/* Column 3: Get In Touch (Mobile spans 2 columns on new row) */}
          <div className="col-span-2 md:col-span-1 flex flex-col justify-between pt-2 md:pt-0">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#b5b5b5] font-semibold mb-3.5 block">
                {t.footer.getInTouch}
              </span>
              <a
                href="mailto:anazmuddin072@gmail.com"
                className="text-sm sm:text-base text-[#f8f7f4] hover:text-orange-400 transition-colors inline-flex items-center gap-1.5 group font-medium"
              >
                <span>anazmuddin072@gmail.com</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>

            <p className="mt-5 md:mt-0 text-xs text-[#b5b5b5]">
              {t.footer.copyright}
            </p>
          </div>
        </div>

        {/* Sub-row: "See you around." and "Back to top" */}
        <div className="flex items-center justify-between pt-8 pb-4 border-t border-white/10 mt-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#f8f7f4]">
            {t.footer.seeYouAround}
          </h3>
          <button
            onClick={handleBackToTop}
            className="group inline-flex items-center gap-2 text-sm sm:text-base font-medium text-[#f8f7f4] hover:text-orange-400 transition-colors cursor-pointer focus:outline-none focus-visible:underline focus-visible:ring-2 focus-visible:ring-orange-400 rounded-md px-1 py-0.5"
            aria-label={t.footer.backToTop}
          >
            <span>{t.footer.backToTop}</span>
            <span className="text-lg transition-transform duration-200 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>
      </div>

      {/* SCENE AND DEPTH: Full-width white scene, keyboard accessible pause/resume */}
      <div
        ref={sceneRef}
        role="button"
        tabIndex={0}
        aria-label={isPaused ? t.footer.resume : t.footer.pause}
        aria-pressed={isPaused}
        onClick={togglePause}
        onKeyDown={handleKeyDown}
        className="group relative w-full h-[320px] sm:h-[370px] md:h-[420px] bg-white overflow-hidden cursor-pointer select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-stone-400 focus-visible:ring-inset transition-shadow"
      >
        {/* Layer 0: Giant capitalized first name "AHNAN." behind the crowd */}
        <div
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-extrabold text-[#ececec] whitespace-nowrap text-center select-none"
            style={{
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontSize: "clamp(80px, 22.7vw, 370px)",
            }}
          >
            AHNAN.
          </span>
        </div>

        {/* Layer 1: Back canvas (smaller pedestrians moving right behind character) */}
        <canvas
          ref={canvasBackRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Layer 2: Character illustration in center bottom 12px, standing still */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/character.png"
          alt="Ahnan"
          className="absolute bottom-[12px] left-1/2 -translate-x-1/2 z-20 h-auto max-h-[310px] sm:max-h-[335px] md:max-h-[365px] object-contain pointer-events-none select-none"
          onError={(e) => {
            console.error("Failed to load /images/character.png", e);
          }}
        />

        {/* Layer 3: Front canvas (larger pedestrians moving left in front of character) */}
        <canvas
          ref={canvasFrontRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />

        {/* Subtle Pause / Resume status indicator for keyboard and mouse feedback */}
        <div
          className="absolute top-3.5 right-4 z-40 flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/10 hover:bg-stone-900/20 text-stone-700 text-xs font-mono font-medium backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          {isPaused ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{t.footer.resume}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t.footer.pause}</span>
            </>
          )}
        </div>

        {/* Error notification if crowd.png is defective or cannot be parsed */}
        {spriteError && (
          <div className="absolute bottom-4 left-4 z-40 bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-md font-mono">
            {spriteError}
          </div>
        )}
      </div>

      {/* Bottom Black Strip with small text */}
      <div className="w-full bg-black py-2.5 px-5 sm:px-8 lg:px-12 border-t border-neutral-900">
        <div className="max-w-[1180px] mx-auto flex items-center justify-between">
          <p className="text-[11px] sm:text-xs text-[#b5b5b5] font-mono select-none">
            {t.footer.traffic}
          </p>
        </div>
      </div>
    </footer>
  );
}
