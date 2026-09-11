"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import FloatingSticker from "./FloatingSticker";

// Escena 04 — Glitch / VHS — El salto geográfico
// Bisagra narrativa: Ginebra (Valle del Cauca) → Santander (Cantabria)
// Aberración cromática, scanlines analógicas, tracking VHS

export default function VHSScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const glitchTriggered = useRef(false);

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
            // Analogue tracking micro-jitter — irregular rhythm, not a loop
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
                      // Next jitter in 3.5–8s
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden vhs-frame"
      style={{
        background: "#0D0C0F",
        color: "#F0EBF4",
        padding: "clamp(2.2rem, 4.5vh, 4.5rem) clamp(1rem, 4vw, 3.5rem)",
      }}
      aria-label="Escena del salto geográfico — Ginebra a Santander"
    >
      {/* Scanlines overlay */}
      <div className="vhs-scanlines" aria-hidden="true" />

      {/* Top VHS indicators */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vw, 1.75rem)",
          left: "clamp(1rem, 3vw, 2rem)",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)",
          color: "#ff6b9d",
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
            background: "#ff3b30",
            display: "inline-block",
            animation: "pulse 1.2s infinite",
          }}
        />
        <span>REC ● PLAY 00:08:26</span>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "clamp(1rem, 3vw, 1.75rem)",
          right: "clamp(1rem, 3vw, 2rem)",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)",
          color: "var(--scene-muted)",
          letterSpacing: "0.12em",
          opacity: 0.7,
          zIndex: 4,
        }}
      >
        SP ■ NTSC AUTO
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
            fontSize: "clamp(0.65rem, 1.8vw, 0.85rem)",
            color: "var(--scene-muted)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
            opacity: 0.8,
          }}
        >
          Valle del Cauca, Colombia · 2007
        </div>

        {/* Glitch big heading */}
        <div
          ref={glitchRef}
          className="glitch-text"
          data-text="→ SANTANDER →"
          style={{ display: "inline-block", margin: "0.5rem 0", maxWidth: "100%" }}
        >
          <h2
            className="font-kinetic"
            style={{
              fontSize: "clamp(1.65rem, 8.2vw, 9rem)",
              color: "var(--scene-fg)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}
          >
            → SANTANDER →
          </h2>
        </div>

        {/* Destination tag */}
        <div
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.65rem, 1.8vw, 0.85rem)",
            color: "var(--scene-muted)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: "0.5rem",
            opacity: 0.8,
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
            background: "rgba(0, 0, 0, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "0.35rem 0.95rem",
            borderRadius: "2px",
            marginTop: "1.25rem",
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.6rem, 1.5vw, 0.72rem)",
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

        {/* Floating Reaching Emoji Sticker — Adaptive */}
        <div className="absolute left-2 sm:-left-12 top-1/2 z-20">
          <FloatingSticker
            src="/reaching-emoji.png"
            alt="El salto geográfico"
            label="EL SALTO · 8026KM"
            width={75}
            height={75}
            initialRotate={-12}
            sound="static"
            className="scale-85 sm:scale-100"
          />
        </div>

        {/* VHS Tape Frame Photo — CRT monitor bezel with magnetic drift */}
        <div
          ref={photoFrameRef}
          className="animate-vhs-drift tactile-frame cursor-pointer"
          onClick={() => {
            const el = glitchRef.current;
            if (el) {
              el.classList.add("glitch-active");
              setTimeout(() => el?.classList.remove("glitch-active"), 350);
            }
          }}
          title="Toca para distorsión de cinta VHS"
          style={{
            marginTop: "clamp(0.85rem, 2vh, 2rem)",
            position: "relative",
            maxWidth: "clamp(160px, 46vw, 290px)",
            width: "100%",
            aspectRatio: "4/3",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.85), inset 0 0 20px rgba(0, 0, 0, 0.9)",
            overflow: "hidden",
            background: "#09090b",
          }}
        >
          <Image
            src="/juanfe-reciente-1.jpg"
            alt="JuanFe en Santander"
            fill
            style={{
              objectFit: "cover",
              filter: "contrast(125%) saturate(130%) hue-rotate(-5deg)",
            }}
            sizes="(max-width: 768px) 60vw, 320px"
          />
          {/* Internal timestamp stamp on video */}
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "10px",
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "0.55rem",
              color: "#ffff00",
              textShadow: "1px 1px 2px #000",
              letterSpacing: "0.1em",
            }}
          >
            11-SEP-2026 01:50
          </div>
        </div>

        {/* Narrative phrase */}
        <p
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.72rem, 1.8vw, 0.92rem)",
            color: "var(--scene-fg)",
            opacity: 0.85,
            lineHeight: 1.55,
            letterSpacing: "0.03em",
            maxWidth: "52ch",
            margin: "clamp(0.85rem, 2vh, 2rem) auto 0",
          }}
        >
          Crucé el océano con dieciocho años y una sola certeza: las ganas de desarmar y construir cosas.
          Ocho mil kilómetros no cambian las raíces de Ginebra, solo amplían el horizonte.
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
