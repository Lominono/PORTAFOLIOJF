"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { audioManager } from "./AudioManager";

// Escena 05 — Zine / Collage analógico — Colombia, el origen
// Papel kraft / beige texturizado, polaroid infantil, cinta adhesiva
// Foto: juanfe-nino.jpg + salchipapa.png como elemento decorativo

const ORIGIN_HEAD_1 = "El calor del Valle,";
const ORIGIN_HEAD_2 = "las tardes largas";
const ORIGIN_HEAD_3 = "y desarmar cosas.";
const ORIGIN_SUB = "Ginebra, Valle del Cauca — Raíces intactas";
const ORIGIN_BODY =
  "Crecí en un pueblo donde el tiempo pasaba despacio y la curiosidad no cabía en la casa. Mucho antes de escribir una sola línea de código, ya intentaba entender qué había adentro de cada aparato.";

export default function ZineScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const decoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      [polaroidRef.current, phraseRef.current, bodyRef.current, decoRef.current].forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      return;
    }

    gsap.set(polaroidRef.current, { opacity: 0, rotate: -6, y: 50 });
    gsap.set(phraseRef.current, { opacity: 0, x: -25 });
    gsap.set(bodyRef.current, { opacity: 0, y: 20 });
    gsap.set(decoRef.current, { opacity: 0, scale: 0.6, rotate: -20 });

    const tl = gsap.timeline({ paused: true });

    tl.to(polaroidRef.current, {
      opacity: 1,
      rotate: -2.5,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
    })
    .to(phraseRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: "power3.out",
    }, "-=0.45")
    .to(bodyRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.25")
    .to(decoRef.current, {
      opacity: 1,
      scale: 1,
      rotate: 12,
      duration: 0.7,
      ease: "back.out(1.5)",
    }, "-=0.35");

    // Continuous breathe on polaroid after entrance
    tl.add(() => {
      gsap.to(polaroidRef.current, {
        y: "-=7",
        rotate: "-=0.8",
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });


    let hasPlayed = false;
    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-zine" && !hasPlayed) {
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
      data-scene-id="zine"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "#E8DFC8",
        color: "#1A1713",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 6vw, 5rem)",
      }}
      aria-label="Escena de origen — Ginebra, Valle del Cauca"
    >
      {/* Paper texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E\")",
          backgroundSize: "300px 300px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(2rem, 6vw, 4.5rem)",
          alignItems: "center",
          maxWidth: "980px",
          width: "100%",
          zIndex: 2,
        }}
      >
        {/* Polaroid frame */}
        <div
          ref={polaroidRef}
          className="zine-polaroid mx-auto animate-polaroid-sway tactile-frame cursor-pointer"
          onClick={() => audioManager.play("paper-tear")}
          title="Toca para escuchar el papel analógico"
          style={{
            width: "100%",
            maxWidth: "clamp(210px, 45vw, 290px)",
            willChange: "opacity, transform",
            position: "relative",
          }}
        >
          {/* Washi tape strip at top */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -12,
              left: "50%",
              transform: "translateX(-50%) rotate(-3deg)",
              width: "70px",
              height: "22px",
              background: "rgba(229, 169, 82, 0.65)",
              border: "1px dashed rgba(180, 120, 40, 0.4)",
              backdropFilter: "blur(2px)",
              zIndex: 3,
            }}
          />

          <div
            style={{
              width: "100%",
              aspectRatio: "3/4",
              position: "relative",
              overflow: "hidden",
              background: "#e4dfd3",
            }}
          >
            <Image
              src="/juanfe-nino.jpg"
              alt="JuanFe de niño en Colombia"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 60vw, 290px"
            />
          </div>

          {/* Caption handwritten style */}
          <p
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.6rem, 1.4vw, 0.72rem)",
              color: "#4a4238",
              textAlign: "center",
              marginTop: "0.75rem",
              letterSpacing: "0.06em",
              fontWeight: 500,
            }}
          >
            {ORIGIN_SUB}
          </p>
        </div>

        {/* Text column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)",
              color: "var(--scene-muted)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            Capítulo 05 · El Origen
          </div>

          <h2
            ref={phraseRef}
            className="font-kinetic"
            style={{
              fontSize: "clamp(2.2rem, 7.5vw, 5.2rem)",
              color: "var(--scene-fg)",
              lineHeight: 0.94,
              letterSpacing: "-0.025em",
              willChange: "opacity, transform",
            }}
          >
            <span className="block">{ORIGIN_HEAD_1}</span>
            <span className="block italic font-serif font-light">{ORIGIN_HEAD_2}</span>
            <span className="block text-accent font-black" style={{ color: "var(--scene-accent)" }}>
              {ORIGIN_HEAD_3}
            </span>
          </h2>

          <p
            ref={bodyRef}
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)",
              color: "var(--scene-fg)",
              opacity: 0.85,
              lineHeight: 1.65,
              maxWidth: "46ch",
            }}
          >
            {ORIGIN_BODY}
          </p>

          {/* Decorative Salchipapa with organic float — Contained for mobile */}
          <div
            ref={decoRef}
            className="tactile-frame cursor-pointer"
            onClick={() => audioManager.play("pop")}
            title="Sabor de Ginebra"
            style={{
              position: "absolute",
              right: "clamp(0rem, 2vw, 1.5rem)",
              bottom: "clamp(-1.8rem, -3vw, -2.8rem)",
              width: "clamp(80px, 17vw, 130px)",
              aspectRatio: "1",
              willChange: "opacity, transform",
              animation: "floatOrganic 6s ease-in-out infinite",
              filter: "drop-shadow(2px 6px 12px rgba(0,0,0,0.15))",
            }}
            aria-hidden="true"
          >
            <Image
              src="/salchipapa.png"
              alt=""
              fill
              style={{ objectFit: "contain" }}
              sizes="130px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
