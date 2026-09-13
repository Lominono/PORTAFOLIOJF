"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { audioManager } from "./AudioManager";

// Escena 00 — Apertura cinematográfica
// Tipografía cinética con peso variable (Fraunces axes: opsz, SOFT, WONK)
// Click de obturador de cámara al completarse

const NAME = "JuanFe";
const TAGLINE = "Desarrollador web · 18 · Santander";

export default function OpeningScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = charsRef.current.filter(Boolean);
    const tagline = taglineRef.current;
    if (!chars.length || !tagline) return;

    if (prefersReduced) {
      chars.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      tagline.style.opacity = "1";
      tagline.style.transform = "none";
      return;
    }

    gsap.set(chars, {
      opacity: 0,
      yPercent: 60,
      fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
      fontWeight: 100,
    });
    gsap.set(tagline, { opacity: 0, y: 14 });

    const tl = gsap.timeline();

    tl.to(chars, {
      opacity: 1,
      yPercent: 0,
      fontWeight: 900,
      fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0',
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        if (!hasPlayedSound.current) {
          hasPlayedSound.current = true;
          audioManager.play("shutter");
        }
      },
    }).to(
      tagline,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.1"
    );

    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-opening") {
        tl.play();
      }
    };
    const observer = new MutationObserver(checkActive);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scene"] });

    return () => {
      tl.kill();
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene-id="opening"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-x-clip"
      style={{
        background: "#000",
        padding: "clamp(1.5rem, 6vw, 6rem) clamp(1rem, 4vw, 4rem)",
      }}
      aria-label="Escena de apertura"
    >
      {/* Name — kinetic variable font */}
      <h1
        className="font-kinetic select-none"
        style={{
          fontSize: "clamp(2.75rem, 16vw, 17rem)",
          color: "#f5f5f5",
          lineHeight: 0.88,
          mixBlendMode: "normal",
          letterSpacing: "-0.04em",
          textAlign: "center",
          maxWidth: "100%",
        }}
        aria-label={NAME}
      >
        {NAME.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) charsRef.current[i] = el;
            }}
            style={{ display: "inline-block", willChange: "transform, opacity, font-variation-settings" }}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </h1>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="font-receipt"
        style={{
          fontSize: "clamp(0.58rem, 1.8vw, 0.95rem)",
          color: "#666",
          letterSpacing: "clamp(0.12em, 0.5vw, 0.26em)",
          textTransform: "uppercase",
          marginTop: "clamp(1.25rem, 3.5vw, 2.2rem)",
          willChange: "opacity, transform",
          textAlign: "center",
          padding: "0 0.5rem",
        }}
      >
        {TAGLINE}
      </p>

      {/* Tactile 35mm Reel Controller & Scroll Incentive */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(3.8rem, 8.5vh, 4.8rem)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.65rem",
          width: "min(92vw, 440px)",
          zIndex: 10,
        }}
      >
        {/* Interactive Click/Tap Action Reel Badge */}
        <button
          onClick={() => {
            audioManager.play("keyclick");
            audioManager.startBgMusic();
            const slice = window.innerWidth <= 768 ? 1.20 : 1.50;
            const targetY = window.innerHeight * slice * 0.45;
            const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, opts?: unknown) => void } }).lenis;
            if (lenis) {
              lenis.scrollTo(targetY, { duration: 1.2 });
            } else {
              window.scrollTo({ top: targetY, behavior: "smooth" });
            }
          }}
          className="group relative cursor-pointer active:scale-[0.98] transition-all duration-200"
          style={{
            background: "rgba(222, 159, 67, 0.05)",
            border: "1px solid rgba(222, 159, 67, 0.4)",
            borderRadius: "3px",
            padding: "0.55rem 1.1rem",
            minHeight: "44px",
            color: "#E5A952",
            fontFamily: "var(--font-space-mono), monospace",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            boxShadow: "0 0 15px rgba(222, 159, 67, 0.08)",
            backdropFilter: "blur(4px)",
          }}
          aria-label="Iniciar recorrido: deslizar o hacer clic para avanzar a la siguiente escena"
        >
          {/* Header metadata tag */}
          <div className="flex items-center gap-2 text-[0.52rem] sm:text-[0.58rem] tracking-[0.25em] text-[#DE9F43]/90 uppercase font-semibold">
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#DE9F43",
                display: "inline-block",
                boxShadow: "0 0 10px #DE9F43",
                animation: "pulse 1.8s ease-in-out infinite",
              }}
              aria-hidden="true"
            />
            <span>CARRETE ANALÓGICO · 35MM [00 / 08]</span>
          </div>

          {/* Main instruction text */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[0.62rem] sm:text-[0.74rem] text-[#F3EFE6] font-bold tracking-[0.14em] uppercase group-hover:text-[#DE9F43] transition-colors">
              DESLIZA O HAZ CLIC PARA AVANZAR
            </span>
            <span className="text-[0.85rem] text-[#DE9F43] animate-bounce font-bold inline-block">
              ↓
            </span>
          </div>

          {/* Micro tape progress ticker */}
          <div className="w-full flex justify-between items-center text-[0.46rem] sm:text-[0.5rem] tracking-[0.18em] text-[#888] pt-1 mt-0.5 border-t border-[#DE9F43]/20 font-mono">
            <span>ESCENA SIGUIENTE:</span>
            <span className="text-[#DE9F43]/90 font-medium">01 · AHORA (SANTANDER) ↗</span>
          </div>
        </button>

        {/* Tactile scroll mouse-wheel / trackpad hint */}
        <div
          className="hidden sm:flex items-center gap-2 text-[0.5rem] tracking-[0.2em] text-[#666] font-mono select-none"
          aria-hidden="true"
        >
          <span>[ RUEDA DE RATÓN / TRACKPAD DISPONIBLE ]</span>
        </div>
      </div>
    </section>
  );
}
