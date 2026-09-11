"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { audioManager } from "./AudioManager";

// Escena 07 — Obsessions / Fuera del código
// Bitácora de notas analógica: líneas de cuaderno, no tarjetas flotantes.
// Foto con hermana en sudadera de Minecraft.

const OBSESSIONS = [
  { tag: "01", label: "Jazz & OSTs", note: "Bill Evans de fondo mientras compilo. El jazz modal como estado de flow." },
  { tag: "02", label: "Minecraft",   note: "La primera escuela de lógica. Construir sistemas bloque a bloque desde los 7." },
  { tag: "03", label: "Steven Universe", note: "Paletas de pastel y sensibilidad musical. Referencia visual constante." },
  { tag: "04", label: "Redes & Linux", note: "SMR: servidores Samba, routing, IPs. El hardware como capa 0." },
  { tag: "05", label: "Comida del Valle", note: "Salchipapas y sancocho en fogón. El sabor de Ginebra que no se olvida." },
  { tag: "06", label: "El Mar de Santander", note: "La costa cantábrica cuando el código necesita un respiro." },
];

export default function ObsessionsScene() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLHeadingElement>(null);
  const photoRef    = useRef<HTMLDivElement>(null);
  const listRef     = useRef<HTMLUListElement>(null);
  const rowsRef     = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      [headRef.current, photoRef.current, listRef.current].forEach((el) => {
        if (el) { el.style.opacity = "1"; el.style.transform = "none"; }
      });
      return;
    }

    // Set initial states
    gsap.set(headRef.current,  { opacity: 0, y: 28 });
    gsap.set(photoRef.current, { opacity: 0, scale: 0.93, rotate: 3 });
    gsap.set(rowsRef.current.filter(Boolean), { opacity: 0, x: -18 });

    const tl = gsap.timeline({ paused: true });

    tl.to(headRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
      .to(photoRef.current, {
        opacity: 1, scale: 1, rotate: -1.8,
        duration: 0.8, ease: "power3.out",
      }, "-=0.2")
      .to(rowsRef.current.filter(Boolean), {
        opacity: 1, x: 0,
        stagger: 0.07, duration: 0.45, ease: "power2.out",
      }, "-=0.4");

    // Continuous subtle drift on the photo — analogue feel
    gsap.to(photoRef.current, {
      y: "-=6", rotate: "-=0.6",
      duration: 4.5, ease: "sine.inOut",
      yoyo: true, repeat: -1,
      delay: 1.2,
    });

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

    return () => { tl.kill(); observer.disconnect(); };
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
      aria-label="Escena de obsesiones — fuera del código"
    >
      {/* Lined paper texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(26,24,20,0.06) 27px, rgba(26,24,20,0.06) 28px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "960px", width: "100%", margin: "0 auto", position: "relative", zIndex: 2 }}>

        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)", color: "var(--scene-muted)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.5rem", opacity: 0.75 }}>
          Capítulo 07 · Personal
        </div>

        <h2
          ref={headRef}
          className="font-kinetic"
          style={{ fontSize: "clamp(2.4rem, 8vw, 6.5rem)", color: "var(--scene-fg)", lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: "clamp(2rem, 5vw, 3.5rem)", willChange: "opacity, transform" }}
        >
          Fuera del código.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(2rem, 4vw, 3.5rem)",
            alignItems: "start",
          }}
        >
          {/* Polaroid foto with organic sway and tactile interaction */}
          <div
            ref={photoRef}
            className="animate-polaroid-sway tactile-frame cursor-pointer"
            onClick={() => audioManager.play("polaroid")}
            title="Toca para obturación Polaroid"
            style={{ willChange: "opacity, transform", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div
              style={{
                background: "#faf8f2",
                padding: "clamp(10px, 2.5vw, 14px) clamp(10px, 2.5vw, 14px) clamp(28px, 4.5vw, 40px)",
                boxShadow: "2px 4px 0 rgba(0,0,0,0.18), 6px 10px 28px rgba(0,0,0,0.12)",
                maxWidth: "300px",
                width: "100%",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ width: "100%", aspectRatio: "4/5", position: "relative", overflow: "hidden", background: "#e5e2da" }}>
                <Image
                  src="/juanfe-hermana.jpg"
                  alt="JuanFe con su hermana"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 85vw, 300px"
                />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "clamp(0.6rem, 1.4vw, 0.7rem)",
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

          {/* Log list — cuaderno de bitácora, no tarjetas */}
          <ul
            ref={listRef}
            style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}
          >
            {OBSESSIONS.map((obs, i) => (
              <li
                key={i}
                ref={el => { rowsRef.current[i] = el; }}
                style={{
                  display: "flex",
                  gap: "1.1rem",
                  padding: "0.85rem 0",
                  borderBottom: "1px solid rgba(26,24,20,0.12)",
                  willChange: "opacity, transform",
                  transition: "color 0.18s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget.querySelector(".obs-label") as HTMLElement | null)
                    ?.style.setProperty("color", "var(--scene-accent)");
                }}
                onMouseLeave={e => {
                  (e.currentTarget.querySelector(".obs-label") as HTMLElement | null)
                    ?.style.setProperty("color", "var(--scene-fg)");
                }}
              >
                {/* Entry number — typewritten index */}
                <span
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: "0.65rem",
                    color: "var(--scene-muted)",
                    opacity: 0.55,
                    flexShrink: 0,
                    paddingTop: "0.2rem",
                    letterSpacing: "0.12em",
                  }}
                >
                  {obs.tag}
                </span>
                <div>
                  <div
                    className="obs-label"
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: "clamp(1rem, 2.4vw, 1.2rem)",
                      fontWeight: 700,
                      color: "var(--scene-fg)",
                      letterSpacing: "-0.01em",
                      transition: "color 0.18s ease",
                    }}
                  >
                    {obs.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: "clamp(0.62rem, 1.5vw, 0.72rem)",
                      color: "var(--scene-muted)",
                      marginTop: "0.2rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {obs.note}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
