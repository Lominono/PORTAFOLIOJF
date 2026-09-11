"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { audioManager } from "./AudioManager";

// Escena 00 — Apertura cinematográfica
// Tipografía cinética con peso variable (Fraunces axes: opsz, SOFT, WONK)
// Click de obturador de cámara al completarse

const NAME = "JuanFe";
const TAGLINE = "Desarrolador web· 18 · santander";

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

      {/* Explicit Editorial scroll prompt */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(3.6rem, 8vh, 5.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          color: "#888",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.55rem, 1.4vw, 0.65rem)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: 0.9,
        }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#DE9F43",
              display: "inline-block",
              boxShadow: "0 0 8px rgba(222, 159, 67, 0.4)",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <span>EXPLORA MI PORTAFOLIO WEB</span>
        </div>
        <span style={{ fontSize: "0.5rem", color: "#666", letterSpacing: "0.15em" }}>DESLIZA HACIA ABAJO PARA CONTINUAR</span>
        <span className="animate-bounce" style={{ marginTop: "0.2rem", display: "inline-block", fontSize: "0.8rem", color: "#DE9F43" }}>↓</span>
      </div>
    </section>
  );
}
