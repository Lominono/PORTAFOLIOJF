"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingSticker from "./FloatingSticker";

// Escena 02 — Brutalismo editorial
// Tipografía monumental, contrastes de peso y bordes contundentes.
// Sin florituras: una declaración directa que rompe la expectativa del visitante.

const LINE_1 = "Construyo";
const LINE_2 = "con criterio.";
const LINE_3 = "Sistemas & Código.";
const SUBDECLARATION = "JUANFE · 18 AÑOS · SMR · CANTABRIA";
const TICKER_TEXT = "DESARROLLO WEB + SISTEMAS + LINUX + EXPERIMENTACIÓN DIGITAL + ";

export default function BrutalismScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const borderTopRef = useRef<HTMLDivElement>(null);
  const borderBottomRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = [textRef.current, subRef.current, borderTopRef.current, borderBottomRef.current].filter(Boolean);
    if (!els.length) return;

    if (prefersReduced) {
      els.forEach((el) => el && (el.style.opacity = "1"));
      return;
    }

    gsap.set(textRef.current, { opacity: 0, y: 50, skewY: 2 });
    gsap.set(subRef.current, { opacity: 0, y: 20 });
    gsap.set([borderTopRef.current, borderBottomRef.current], { scaleX: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(borderTopRef.current, {
      scaleX: 1,
      transformOrigin: "left",
      duration: 0.6,
      ease: "power3.inOut",
    })
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 0.75,
      ease: "power4.out",
    }, "-=0.25")
    .to(subRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
    }, "-=0.2")
    .to(borderBottomRef.current, {
      scaleX: 1,
      transformOrigin: "left",
      duration: 0.6,
      ease: "power3.inOut",
    }, "-=0.3");

    // Continuous ticker tape animation
    if (tickerRef.current) {
      gsap.to(tickerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 18,
        ease: "none",
      });
    }

    let hasPlayed = false;
    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-brutalism" && !hasPlayed) {
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
      data-scene-id="brutalism"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: "#F7F7F7",
        color: "#0A0A0A",
        padding: "clamp(2.2rem, 4.5vh, 4.5rem) clamp(1rem, 4vw, 3.5rem)",
      }}
      aria-label="Escena de declaración brutalista"
    >
      {/* Top border */}
      <div
        ref={borderTopRef}
        className="brutalism-rule"
        style={{ marginBottom: "clamp(0.85rem, 2vh, 2.5rem)", willChange: "transform" }}
        aria-hidden="true"
      />

      {/* Main declaration */}
      <h2
        ref={textRef}
        className="font-kinetic uppercase select-none"
        style={{
          fontSize: "clamp(2.1rem, 10vw, 9.5rem)",
          color: "var(--scene-fg)",
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          maxWidth: "14ch",
          willChange: "opacity, transform",
        }}
      >
        <span className="block opacity-90">{LINE_1}</span>
        <span className="block italic font-light opacity-95">{LINE_2}</span>
        <span
          className="block font-black"
          style={{
            color: "var(--scene-accent, #c85028)",
            textDecoration: "underline",
            textDecorationThickness: "clamp(3px, 1vw, 10px)",
            textUnderlineOffset: "clamp(5px, 1.2vw, 14px)",
          }}
        >
          {LINE_3}
        </span>
      </h2>

      {/* Floating Flex Sticker — Adaptive on mobile & desktop */}
      <div className="absolute right-3 sm:right-16 top-12 sm:top-1/4 z-20">
        <FloatingSticker
          src="/flex-emoji.png"
          alt="Fuerza y criterio"
          label="DISCIPLINA · CRITERIO"
          width={75}
          height={75}
          initialRotate={-10}
          sound="stamp"
          className="scale-85 sm:scale-100"
        />
      </div>

      {/* Attribution & context */}
      <p
        ref={subRef}
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.68rem, 1.8vw, 0.95rem)",
          color: "var(--scene-fg)",
          opacity: 0.65,
          letterSpacing: "0.14em",
          marginTop: "clamp(1rem, 2.5vh, 2.5rem)",
          willChange: "opacity, transform",
        }}
      >
        {SUBDECLARATION}
      </p>

      {/* Bottom border */}
      <div
        ref={borderBottomRef}
        className="brutalism-rule"
        style={{ marginTop: "clamp(0.85rem, 2vh, 2.5rem)", marginBottom: "clamp(0.75rem, 1.8vh, 1.5rem)", willChange: "transform" }}
        aria-hidden="true"
      />

      {/* Ticker tape banner */}
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: "100%",
          opacity: 0.35,
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)",
          letterSpacing: "0.2em",
          color: "var(--scene-fg)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div ref={tickerRef} style={{ display: "inline-block", willChange: "transform" }}>
          {TICKER_TEXT.repeat(4)}
        </div>
      </div>

      {/* Large background number */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "clamp(-1rem, -2vw, -2rem)",
          bottom: "clamp(-1rem, -3vw, -3rem)",
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 900,
          fontSize: "clamp(10rem, 36vw, 28rem)",
          color: "var(--scene-fg)",
          opacity: 0.04,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        02
      </span>
    </section>
  );
}
