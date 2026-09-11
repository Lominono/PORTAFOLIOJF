"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { audioManager } from "./AudioManager";

// Escena 01 — Recibo térmico
// Papel térmico impreso en tiempo real al entrar en la escena
// Datos reales de JuanFe en Santander (Cantabria)

const TICKET_LINES = [
  { type: "header", text: "══════════════════════════" },
  { type: "title", text: "JUANFE" },
  { type: "sub", text: "creative dev · smr" },
  { type: "sep", text: "──────────────────────────" },
  { type: "item", label: "UBICACIÓN", value: "Santander, ES" },
  { type: "item", label: "ORIGEN", value: "Ginebra, CO" },
  { type: "item", label: "AÑO", value: "2026" },
  { type: "item", label: "GITHUB", value: "@Lominono" },
  { type: "item", label: "INSTAGRAM", value: "@Juanfer_ost" },
  { type: "item", label: "ENFOQUE", value: "Web / Sistemas / Redes" },
  { type: "item", label: "ESTADO", value: "DISPONIBLE" },
  { type: "sep", text: "──────────────────────────" },
  { type: "note", text: "BITÁCORA TÉCNICA · JUANFE" },
  { type: "note", text: "SISTEMAS, REDES & FRONTEND CREATIVO" },
  { type: "sep", text: "──────────────────────────" },
  { type: "barcode", text: "|||||||||||||||||||||||||||||||" },
  { type: "footer", text: "— JUANFE · 2026 —" },
];

export default function ReceiptScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const photoRef = useRef<HTMLDivElement>(null);
  const [photoColor, setPhotoColor] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = linesRef.current.filter(Boolean);
    const photo = photoRef.current;

    if (prefersReduced) {
      lines.forEach((l) => {
        l.style.opacity = "1";
        l.style.clipPath = "inset(0 0 0% 0)";
      });
      if (photo) {
        photo.style.opacity = "1";
        photo.style.transform = "none";
      }
      return;
    }

    gsap.set(lines, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
    gsap.set(photo, { opacity: 0, scale: 0.95, y: 25 });

    const tl = gsap.timeline({ paused: true });

    tl.to(lines, {
      clipPath: "inset(0 0% 0 0)",
      stagger: 0.05,
      duration: 0.2,
      ease: "none",
    }).to(
      photo,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.65,
        ease: "power2.out",
      },
      "-=0.3"
    );

    let hasPlayed = false;
    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-ticket" && !hasPlayed) {
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
      data-scene-id="ticket"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "#F3EFE6",
        color: "#181715",
        padding: "clamp(2rem, 4.5vh, 4.5rem) clamp(0.75rem, 3vw, 2.5rem)",
      }}
      aria-label="Escena del recibo térmico — Ficha técnica"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(0.5rem, 1.6vh, 1.6rem)",
          maxWidth: "600px",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Receipt paper container */}
        <div
          style={{
            background: "var(--scene-bg)",
            border: "1px solid var(--scene-border)",
            width: "min(100%, 330px)",
            padding: "clamp(0.65rem, 1.8vh, 1.5rem) clamp(0.75rem, 2.5vw, 1.25rem)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)",
            fontFamily: "var(--font-space-mono), monospace",
          }}
        >
          {TICKET_LINES.map((line, i) => {
            let content: React.ReactNode;

            if (line.type === "item" && line.label) {
              content = (
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", opacity: 0.9 }}>
                  <span style={{ opacity: 0.6 }}>{line.label}</span>
                  <span style={{ fontWeight: 600 }}>{line.value}</span>
                </span>
              );
            } else if (line.type === "title") {
              content = (
                <span
                  style={{
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  {line.text}
                </span>
              );
            } else if (line.type === "sub") {
              content = (
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    opacity: 0.65,
                    display: "block",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  {line.text}
                </span>
              );
            } else if (line.type === "barcode") {
              content = (
                <span
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.08em",
                    display: "block",
                    textAlign: "center",
                    opacity: 0.45,
                  }}
                >
                  {line.text}
                </span>
              );
            } else if (line.type === "footer") {
              content = (
                <span
                  style={{
                    fontSize: "0.62rem",
                    display: "block",
                    textAlign: "center",
                    opacity: 0.55,
                    letterSpacing: "0.16em",
                  }}
                >
                  {line.text}
                </span>
              );
            } else {
              content = (
                <span
                  style={{
                    fontSize: "0.65rem",
                    opacity: 0.4,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  {line.text}
                </span>
              );
            }

            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) linesRef.current[i] = el;
                }}
                style={{
                  marginBottom: line.type === "sep" || line.type === "header" ? "0.15rem" : "0.35rem",
                  willChange: "clip-path",
                }}
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* Thermal photo with dither filter and tactile organic animation */}
        <div
          ref={photoRef}
          className="animate-paper-float tactile-frame cursor-pointer"
          onClick={() => {
            setPhotoColor(!photoColor);
            audioManager.play("thermal");
          }}
          title="Toca para revelar emulsión térmica"
          style={{
            width: "clamp(120px, 32vw, 200px)",
            aspectRatio: "3/4",
            position: "relative",
            willChange: "opacity, transform",
            borderRadius: "2px",
            overflow: "hidden",
            boxShadow: photoColor
              ? "0 12px 32px rgba(224, 135, 50, 0.25), 0 4px 12px rgba(0,0,0,0.15)"
              : "0 8px 25px rgba(0,0,0,0.12)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <Image
            src="/juanfe-reciente-1.jpg"
            alt="JuanFe en Santander"
            fill
            style={{ objectFit: "cover" }}
            className={`thermal-photo-dither ${photoColor ? "active-color" : ""}`}
            sizes="(max-width: 768px) 40vw, 240px"
          />
        </div>
      </div>

      {/* Sawtooth bottom edge */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          width: "100%",
          height: "24px",
          background: "var(--scene-bg)",
          clipPath:
            "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0, 100% 100%, 0 100%)",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
        }}
      />
    </section>
  );
}
