"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { audioManager } from "./AudioManager";

// Escena 04 — Glitch / VHS — El salto geográfico
// Bisagra narrativa: Ginebra (Valle del Cauca) → Santander (Cantabria)
// Estética pura de videocasetera analógica (VCR / VHS NTSC)
// OSD con código de tiempo en tiempo real, aberración cromática, scanlines y textura magnética


function formatTimecode(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export default function VHSScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const glitchTriggered = useRef(false);

  // Dynamic real-time VCR tape timecode & state
  const [tapeSeconds, setTapeSeconds] = useState(506); // 00:08:26
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const [trackingLevel] = useState(94);

  const triggerGlitch = useCallback(() => {
    audioManager.play("static");
    setIsGlitching(true);
    const el = glitchRef.current;
    if (el) {
      el.classList.add("glitch-active");
      setTimeout(() => el?.classList.remove("glitch-active"), 380);
    }
    setTimeout(() => setIsGlitching(false), 450);
  }, []);

  // Timecode running interval when active and playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTapeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      if (sectionRef.current) sectionRef.current.style.opacity = "1";
      return;
    }

    gsap.set(photoFrameRef.current, { opacity: 0, scale: 0.92, y: 30 });

    const playVHSScene = () => {
      if (glitchTriggered.current) return;
      glitchTriggered.current = true;

      const el = glitchRef.current;
      if (el) {
        el.classList.add("glitch-active");
        setTimeout(() => el?.classList.remove("glitch-active"), 400);
        setTimeout(() => {
          el?.classList.add("glitch-active");
          setTimeout(() => el?.classList.remove("glitch-active"), 320);
        }, 700);
      }

      if (photoFrameRef.current) {
        gsap.to(photoFrameRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          onComplete: () => {
            // Analogue tracking micro-jitter — irregular rhythm
            const jitter = () => {
              if (!photoFrameRef.current) return;
              gsap.to(photoFrameRef.current, {
                x: (Math.random() - 0.5) * 4,
                filter: `contrast(125%) saturate(130%) hue-rotate(-5deg) brightness(${0.96 + Math.random() * 0.08})`,
                duration: 0.08 + Math.random() * 0.12,
                ease: "none",
                onComplete: () => {
                  gsap.to(photoFrameRef.current, {
                    x: 0,
                    filter: "contrast(125%) saturate(130%) hue-rotate(-5deg) brightness(1)",
                    duration: 0.1,
                    ease: "none",
                    onComplete: () => {
                      setTimeout(jitter, 3500 + Math.random() * 4500);
                    },
                  });
                },
              });
            };
            setTimeout(jitter, 2000 + Math.random() * 3000);
          },
        });
      }
    };

    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-vhs") {
        playVHSScene();
      }
    };
    checkActive();
    const observer = new MutationObserver(checkActive);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scene"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene-id="vhs"
      className="relative min-h-screen flex items-center justify-center overflow-x-clip vhs-frame"
      style={{
        background: "radial-gradient(ellipse at center, #131118 0%, #08070A 75%, #030304 100%)",
        color: "#F0EBF4",
        padding: "clamp(1.5rem, 3.5vh, 2.8rem) clamp(1rem, 4vw, 3rem) clamp(4.5rem, 10vh, 6.5rem)",
      }}
      aria-label="Escena del salto geográfico — Ginebra a Santander"
    >
      {/* Scanlines overlay */}
      <div className="vhs-scanlines" aria-hidden="true" />

      {/* Sweeping magnetic tape tracking glitch band */}
      <div className="vhs-tracking-band" aria-hidden="true" />

      {/* 4:3 TV broadcast safe-area reticle crosshair ticks (corner brackets) */}
      <div className="hidden sm:block pointer-events-none select-none z-10" aria-hidden="true">
        <span className="absolute top-4 left-4 font-mono text-[1.1rem] text-[#ff6b9d]/30 font-light leading-none">⌜</span>
        <span className="absolute top-4 right-4 font-mono text-[1.1rem] text-[#ff6b9d]/30 font-light leading-none">⌝</span>
        <span className="absolute bottom-16 left-4 font-mono text-[1.1rem] text-[#ff6b9d]/30 font-light leading-none">⌞</span>
        <span className="absolute bottom-16 right-4 font-mono text-[1.1rem] text-[#ff6b9d]/30 font-light leading-none">⌟</span>
      </div>

      {/* Top VHS OSD (On-Screen Display) indicators */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "clamp(0.85rem, 2.5vh, 1.75rem)",
          left: "clamp(0.75rem, 3vw, 2.2rem)",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.55rem, 1.3vw, 0.74rem)",
          letterSpacing: "0.14em",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 4,
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: isPlaying ? "#00ff88" : "#ff3b30",
            boxShadow: isPlaying ? "0 0 8px #00ff88" : "0 0 8px #ff3b30",
            display: "inline-block",
            animation: isPlaying ? "pulse 1.4s infinite" : "none",
          }}
        />
        <span className="vhs-osd-glow text-[#00ff88] font-bold">
          {isPlaying ? "PLAY ▶" : "PAUSE ❚❚"} {formatTimecode(tapeSeconds)}
        </span>
        <span className="text-white/40 text-[0.52rem] hidden sm:inline font-mono">
          · TAPE: NTSC 8026KM
        </span>
      </div>

      {/* Top-Right VHS Audio / Tracking Specs (Hidden on mobile to avoid SceneHUD overlap) */}
      <div
        aria-hidden="true"
        className="hidden sm:flex items-center gap-3"
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vw, 1.75rem)",
          right: "clamp(1rem, 3vw, 2.2rem)",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.55rem, 1.3vw, 0.68rem)",
          color: "var(--scene-muted)",
          letterSpacing: "0.12em",
          zIndex: 4,
        }}
      >
        <div className="flex items-center gap-1">
          <span className="text-[#00f0ff] font-bold">SP</span>
          <span className="opacity-40">·</span>
          <span>HI-FI STEREO</span>
        </div>
        <span className="opacity-30">|</span>
        <div className="flex items-center gap-1 text-[#ff6b9d]">
          <span>TRACKING:</span>
          <span className="font-bold">{trackingLevel}%</span>
        </div>
      </div>

      {/* Main content */}
      <div
        ref={containerRef}
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          maxWidth: "850px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Origin tag */}
        <div
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.62rem, 1.6vw, 0.8rem)",
            color: "var(--scene-muted)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: "0.45rem",
            opacity: 0.85,
          }}
        >
          Valle del Cauca, Colombia · 2007
        </div>

        {/* Glitch big heading */}
        <div
          ref={glitchRef}
          className={`glitch-text ${isGlitching ? "glitch-active" : ""}`}
          data-text="→ SANTANDER →"
          style={{ display: "inline-block", margin: "0.4rem 0", maxWidth: "100%" }}
        >
          <h2
            className="font-kinetic"
            style={{
              fontSize: "clamp(1.45rem, 7.5vw, 7.5rem)",
              color: "var(--scene-fg)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
              textShadow: "0 0 16px rgba(255, 107, 157, 0.25), 0 0 35px rgba(107, 240, 255, 0.18)",
            }}
          >
            → SANTANDER →
          </h2>
        </div>

        {/* Destination tag */}
        <div
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.62rem, 1.6vw, 0.8rem)",
            color: "var(--scene-muted)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginTop: "0.4rem",
            opacity: 0.85,
          }}
        >
          Cantabria, España · Presente
        </div>

        {/* Distance badge — Tape index readout */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0, 0, 0, 0.7)",
            border: "1px solid rgba(255, 107, 157, 0.25)",
            boxShadow: "0 0 14px rgba(255, 107, 157, 0.12)",
            padding: "0.32rem 0.9rem",
            borderRadius: "2px",
            marginTop: "1.1rem",
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.58rem, 1.4vw, 0.7rem)",
            color: "var(--scene-fg)",
            letterSpacing: "0.18em",
            maxWidth: "90vw",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "var(--scene-accent)", fontWeight: 700 }}>TRACKING</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>8.026 KM EN LÍNEA RECTA</span>
        </div>


        {/* VHS CRT Monitor Bezel with authentic tube curvature and tactile drift */}
        <div
          ref={photoFrameRef}
          className="animate-vhs-drift tactile-frame cursor-pointer vhs-crt-bezel"
          onClick={triggerGlitch}
          title="Toca para forzar distorsión analógica de cabezal"
          style={{
            marginTop: "clamp(0.6rem, 1.5vh, 1.1rem)",
            position: "relative",
            maxWidth: "clamp(130px, 25vh, 195px)",
            width: "100%",
            aspectRatio: "3/4",
            border: "2px solid rgba(255, 107, 157, 0.45)",
            borderRadius: "6px",
            overflow: "hidden",
            background: "#050406",
          }}
        >
          <Image
            src="/juanfe-salto.png"
            alt="El Salto — De Ginebra a Santander"
            fill
            priority
            style={{
              objectFit: "cover",
              filter: isGlitching
                ? "contrast(180%) saturate(220%) hue-rotate(90deg) brightness(130%)"
                : "contrast(115%) brightness(102%)",
              transition: isGlitching ? "none" : "filter 0.3s ease",
            }}
            sizes="(max-width: 768px) 50vw, 260px"
          />

          {/* CRT Screen Glass Glare reflection */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%, rgba(0,0,0,0.2) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Internal timestamp stamp on CRT video */}
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "10px",
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "0.52rem",
              color: "#ffff55",
              textShadow: "1px 1px 2px #000, 0 0 8px rgba(255,255,85,0.5)",
              letterSpacing: "0.1em",
              zIndex: 3,
            }}
          >
            SP ■ 2026-SEP
          </div>

          {/* Red REC indicator LED on monitor */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "10px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              zIndex: 3,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ff2a2a",
                boxShadow: "0 0 6px #ff2a2a",
                animation: "pulse 1.2s infinite",
              }}
            />
            <span style={{ fontSize: "0.46rem", fontFamily: "var(--font-space-mono), monospace", color: "#ff8888", letterSpacing: "0.1em" }}>
              REC
            </span>
          </div>
        </div>

        {/* Tactile interaction hint */}
        <div
          className="mt-2.5 font-mono text-[0.52rem] text-[#8E8696] tracking-wider uppercase select-none flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={triggerGlitch}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E53935] animate-pulse" />
          <span>Toca la imagen para interferencia magnética</span>
        </div>


        {/* Narrative phrase */}
        <p
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.7rem, 1.6vw, 0.88rem)",
            color: "var(--scene-fg)",
            opacity: 0.9,
            lineHeight: 1.5,
            letterSpacing: "0.03em",
            maxWidth: "54ch",
            margin: "clamp(0.55rem, 1.5vh, 1rem) auto 0",
            textWrap: "balance",
          }}
        >
          Cuando vine a España pues al principio fue difícil porque relativamente estaba solo, sin amigos (solo mi familia), y pues a medida que iba pasando el tiempo fui conociendo gente y ver lo maravilloso y alegres que llegan a ser los españoles.
        </p>
      </div>

      {/* Decorative tracking glitch bars */}
      {[24, 52, 78].map((top, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `${top}%`,
            left: 0,
            width: "100%",
            height: "2px",
            background: i % 2 === 0 ? "rgba(255,107,157,0.2)" : "rgba(107,240,255,0.15)",
            transform: `translateX(${i % 2 === 0 ? -12 : 10}px)`,
          }}
        />
      ))}
    </section>
  );
}
