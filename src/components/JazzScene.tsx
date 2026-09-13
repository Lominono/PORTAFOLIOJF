"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { audioManager } from "./AudioManager";

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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-x-clip"
      style={{
        background: "#0C101C",
        color: "#F4EEDD",
        padding: "clamp(2.2rem, 4.5vh, 4.5rem) clamp(1rem, 4vw, 3.5rem)",
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
            fontSize: "clamp(0.55rem, 1.4vw, 0.75rem)",
            color: "var(--scene-accent)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "clamp(0.75rem, 2vh, 1.4rem)",
            opacity: 0.8,
            textWrap: "balance",
            lineHeight: 1.6,
          }}
        >
          {JAZZ_TAG}
        </div>

        {/* Dynamic Waveform SVG */}
        <div style={{ width: "100%", maxWidth: "560px", marginBottom: "clamp(1rem, 2.5vh, 2.5rem)" }}>
          <svg
            width="100%"
            height="48"
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
            fontSize: "clamp(1.75rem, 6.8vw, 6.8rem)",
            color: "var(--scene-fg)",
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            marginBottom: "clamp(0.75rem, 2vh, 1.4rem)",
            willChange: "opacity, transform",
          }}
        >
          <span className="block">{JAZZ_HEAD}</span>
          <span
            className="block font-serif italic font-light mt-1.5"
            style={{
              fontSize: "clamp(0.95rem, 3.6vw, 2.6rem)",
              color: "var(--scene-accent)",
              lineHeight: 1.28,
              letterSpacing: "0.01em",
              wordSpacing: "0.06em",
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
              fontSize: "clamp(0.7rem, 1.7vw, 0.88rem)",
              color: "var(--scene-fg)",
              opacity: 0.75,
              lineHeight: 1.55,
              letterSpacing: "0.02em",
            }}
          >
            {JAZZ_NOTE}
          </p>

          {/* Spotify profile link */}
          <a
            href="https://open.spotify.com/user/31zzmz2rz7zgdpe5ybdjwkzos7be?si=N1hxwLJvSZCv7wWttCnncw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mi perfil de Spotify"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              marginTop: "clamp(0.85rem, 2vh, 1.5rem)",
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.6rem, 1.5vw, 0.72rem)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#1DB954",
              textDecoration: "none",
              padding: "0.4rem 0.85rem",
              border: "1px solid rgba(29,185,84,0.35)",
              borderRadius: "2px",
              transition: "border-color 0.2s ease, background 0.2s ease",
              background: "rgba(29,185,84,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(29,185,84,0.7)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(29,185,84,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(29,185,84,0.35)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(29,185,84,0.06)";
            }}
          >
            {/* Spotify icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            MI SPOTIFY
          </a>
        </div>
      </div>

      {/* Floating Tulip decorative asset — Interactive & Organic */}
      <div
        className="tactile-frame cursor-pointer"
        onClick={() => audioManager.play("jazz")}
        title="Notas de jazz"
        style={{
          position: "absolute",
          right: "clamp(1rem, 4vw, 3.5rem)",
          bottom: "clamp(1rem, 3vh, 3rem)",
          width: "clamp(50px, 12vw, 100px)",
          aspectRatio: "1",
          opacity: 0.45,
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
