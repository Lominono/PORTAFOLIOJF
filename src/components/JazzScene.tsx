"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Escena 06 — Jazz / Orgánico — El oído
// Azul noche profundo, visualizador de onda animado por requestAnimationFrame
// [Frases en primera persona sobre la escucha, sin sonar a IA]

const JAZZ_HEAD = "No toco una sola nota.";
const JAZZ_SUBHEAD = "Solo me pongo los audífonos y encuentro el orden en la improvisación.";
const JAZZ_TAG = "ESCUCHA ACTIVA · JAZZ MODAL · PIANO LIBRE · NOCHES DE TRABAJO";
const JAZZ_NOTE = "Bill Evans, Thelonious Monk, Miles Davis. Noches de terminal y código en silencio con las notas de fondo marcando el tempo.";

const BAR_COUNT = 36;

export default function JazzScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const barsRef = useRef<SVGRectElement[]>([]);
  const phraseRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const isActiveRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      if (phraseRef.current) phraseRef.current.style.opacity = "1";
      if (textRef.current) textRef.current.style.opacity = "1";
      return;
    }

    gsap.set([phraseRef.current, textRef.current], { opacity: 0, y: 30 });

    const onSceneActive = () => {
      isActiveRef.current = true;
      gsap.to([phraseRef.current, textRef.current], {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.85,
        ease: "power3.out",
      });
      animateWaveform();
    };

    const onSceneInactive = () => {
      isActiveRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };

    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-jazz") {
        if (!isActiveRef.current) onSceneActive();
      } else {
        if (isActiveRef.current) onSceneInactive();
      }
    };
    checkActive();
    const observer = new MutationObserver(checkActive);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scene"] });

    function animateWaveform() {
      if (!isActiveRef.current) return;
      const bars = barsRef.current.filter(Boolean);
      const t = performance.now() / 1000;

      bars.forEach((bar, i) => {
        const base = 0.18;
        const wave =
          Math.sin(t * 1.6 + i * 0.45) * 0.28 +
          Math.sin(t * 2.3 + i * 0.8) * 0.18 +
          Math.sin(t * 0.9 + i * 0.25) * 0.12;
        const height = Math.max(0.08, base + Math.abs(wave));
        const maxH = 64;

        bar.setAttribute("height", String(height * maxH));
        bar.setAttribute("y", String((maxH - height * maxH) / 2));
      });

      animFrameRef.current = requestAnimationFrame(animateWaveform);
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene-id="jazz"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#0C101C",
        color: "#F4EEDD",
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 6vw, 5rem)",
      }}
      aria-label="Escena jazz — La escucha y el ritmo"
    >
      {/* Background visualizer glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)",
          height: "300px",
          background: "radial-gradient(circle, rgba(100, 180, 255, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Category tag */}
        <div
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)",
            color: "var(--scene-accent)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            opacity: 0.8,
          }}
        >
          {JAZZ_TAG}
        </div>

        {/* Dynamic Waveform SVG */}
        <div style={{ width: "100%", maxWidth: "560px", marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <svg
            width="100%"
            height="64"
            viewBox={`0 0 ${BAR_COUNT * 9} 64`}
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            {Array.from({ length: BAR_COUNT }, (_, i) => (
              <rect
                key={i}
                ref={(el) => {
                  if (el) barsRef.current[i] = el;
                }}
                x={i * 9 + 2}
                y={22}
                width={5}
                height={20}
                rx={2.5}
                fill="var(--scene-accent)"
                opacity={0.85}
                style={{ willChange: "height, y" }}
              />
            ))}
          </svg>
        </div>

        {/* Headings */}
        <h2
          ref={phraseRef}
          className="font-kinetic"
          style={{
            fontSize: "clamp(2.4rem, 8.5vw, 6.8rem)",
            color: "var(--scene-fg)",
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
            willChange: "opacity, transform",
          }}
        >
          <span className="block">{JAZZ_HEAD}</span>
          <span
            className="block font-serif italic font-light mt-1"
            style={{
              fontSize: "clamp(1.2rem, 4.5vw, 3rem)",
              color: "var(--scene-accent)",
              lineHeight: 1.15,
            }}
          >
            {JAZZ_SUBHEAD}
          </span>
        </h2>

        {/* Note */}
        <div ref={textRef} style={{ willChange: "opacity, transform", maxWidth: "50ch" }}>
          <p
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)",
              color: "var(--scene-fg)",
              opacity: 0.75,
              lineHeight: 1.6,
              letterSpacing: "0.02em",
            }}
          >
            {JAZZ_NOTE}
          </p>
        </div>
      </div>

      {/* Floating Tulip decorative asset */}
      <div
        style={{
          position: "absolute",
          right: "clamp(1rem, 5vw, 4rem)",
          bottom: "clamp(1.5rem, 4vw, 3.5rem)",
          width: "clamp(65px, 14vw, 115px)",
          aspectRatio: "1",
          opacity: 0.35,
          pointerEvents: "none",
          transform: "rotate(14deg)",
          animation: "floatOrganic 7s ease-in-out infinite",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
        }}
        aria-hidden="true"
      >
        <Image
          src="/tulipan.png"
          alt=""
          fill
          style={{ objectFit: "contain" }}
          sizes="115px"
        />
      </div>
    </section>
  );
}
