"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Escena 07 — Obsessions / Fuera del código
// Foto con hermana en sudadera de Minecraft + grid de tarjetas con obsesiones reales

const OBSESSIONS = [
  {
    emoji: "🎵",
    label: "Jazz & OSTs",
    note: "El fondo constante mientras compilo. Bill Evans, jazz modal y piezas al piano.",
  },
  {
    emoji: "⛏️",
    label: "Minecraft",
    note: "Construir sistemas bloque a bloque desde chico. La primera escuela de lógica.",
  },
  {
    emoji: "💎",
    label: "Steven Universe",
    note: "La estética visual, las paletas de color pastel y la sensibilidad musical.",
  },
  {
    emoji: "🔌",
    label: "Redes & Linux",
    note: "Sistemas Microinformáticos y Redes (SMR). Configurar servidores Samba e IPs.",
  },
  {
    emoji: "🍟",
    label: "Comida del Valle",
    note: "Salchipapas y sancocho en fogón. El sabor de Ginebra que no se olvida en España.",
  },
  {
    emoji: "🌊",
    label: "El Mar de Santander",
    note: "Caminar por la costa cantábrica cuando el código necesita un respiro.",
  },
];

export default function ObsessionsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      [headRef.current, photoRef.current, ...cardsRef.current].forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      return;
    }

    gsap.set(headRef.current, { opacity: 0, y: 30 });
    gsap.set(photoRef.current, { opacity: 0, scale: 0.94, rotate: 2 });
    gsap.set(cardsRef.current.filter(Boolean), { opacity: 0, y: 24 });

    const tl = gsap.timeline({ paused: true });

    tl.to(headRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: "power2.out",
    })
    .to(photoRef.current, {
      opacity: 1,
      scale: 1,
      rotate: -1.5,
      duration: 0.75,
      ease: "power3.out",
    }, "-=0.3")
    .to(cardsRef.current.filter(Boolean), {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.35");

    let hasPlayed = false;
    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-obsessions" && !hasPlayed) {
        hasPlayed = true;
        tl.play();
      }
    };
    checkActive();
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
      data-scene-id="obsessions"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: "#F9F6F0",
        color: "#1A1814",
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 6vw, 5rem)",
      }}
      aria-label="Escena de obsesiones personales — Fuera del código"
    >
      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Category tag & Heading */}
        <div
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)",
            color: "var(--scene-muted)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
            opacity: 0.75,
          }}
        >
          Capítulo 07 · Personal
        </div>

        <h2
          ref={headRef}
          className="font-kinetic"
          style={{
            fontSize: "clamp(2.4rem, 8vw, 6.5rem)",
            color: "var(--scene-fg)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            marginBottom: "clamp(2rem, 5vw, 3.5rem)",
            willChange: "opacity, transform",
          }}
        >
          Fuera del código.
        </h2>

        {/* 2-column layout on desktop, clean single-column on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(2rem, 4vw, 3rem)",
            alignItems: "start",
          }}
        >
          {/* Polaroid photo block — JuanFe + hermana */}
          <div
            ref={photoRef}
            style={{
              willChange: "opacity, transform",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "#faf8f2",
                padding: "clamp(10px, 2.5vw, 16px) clamp(10px, 2.5vw, 16px) clamp(24px, 4vw, 36px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                maxWidth: "320px",
                width: "100%",
                borderRadius: "2px",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  position: "relative",
                  overflow: "hidden",
                  background: "#e5e2da",
                }}
              >
                <Image
                  src="/juanfe-hermana.jpg"
                  alt="JuanFe con su hermana"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 85vw, 320px"
                />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "clamp(0.6rem, 1.4vw, 0.72rem)",
                  color: "#4a4238",
                  textAlign: "center",
                  marginTop: "0.85rem",
                  letterSpacing: "0.04em",
                  fontWeight: 500,
                }}
              >
                con mi hermana · sudadera Minecraft
              </p>
            </div>
          </div>

          {/* Obsessions cards stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {OBSESSIONS.map((obs, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                style={{
                  background: "var(--scene-card-bg, rgba(255,255,255,0.03))",
                  border: "1px solid var(--scene-border)",
                  padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.9rem, 2.5vw, 1.25rem)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  willChange: "opacity, transform",
                  transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease, background 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(6px)";
                  e.currentTarget.style.borderColor = "var(--scene-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.borderColor = "";
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {obs.emoji}
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)",
                      fontWeight: 700,
                      color: "var(--scene-fg)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {obs.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: "clamp(0.65rem, 1.6vw, 0.75rem)",
                      color: "var(--scene-muted)",
                      marginTop: "0.2rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {obs.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
