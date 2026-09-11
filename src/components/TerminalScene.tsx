"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { audioManager } from "./AudioManager";
import FloatingSticker from "./FloatingSticker";

// Escena 03 — Terminal / CRT
// Proyectos reales de GitHub (Lominono / Oreganos)
// Simulación de sesión interactiva de consola bash

const PROJECTS = [
  {
    id: "01",
    name: "Portafolio_cr",
    desc: "Plataforma web de presentación comercial y cotización de servicios fotográficos.",
    stack: "TypeScript · Next.js · TailwindCSS",
    year: "2026",
    url: "https://github.com/Lominono/Portafolio_cr",
  },
  {
    id: "02",
    name: "Ubuntu_samba",
    desc: "App interactiva para simular y practicar comandos de Samba y configuración de IP estática.",
    stack: "Kotlin · Android · Redes & Linux",
    year: "2026",
    url: "https://github.com/Lominono/Ubuntu_samba",
  },
  {
    id: "03",
    name: "Boda_luz_Julio",
    desc: "Invitación digital interactiva con narrativa visual para boda, optimizada para móviles.",
    stack: "TypeScript · React · Animaciones CSS",
    year: "2026",
    url: "https://github.com/Lominono/Boda_luz_Julio",
  },
  {
    id: "04",
    name: "Chat-Pker",
    desc: "Aplicación de mensajería rápida para charlar con amigos y probar sockets en tiempo real.",
    stack: "JavaScript · WebSockets · Node.js",
    year: "2025",
    url: "https://github.com/Lominono/Chat-Pker",
  },
  {
    id: "05",
    name: "Youreidiot",
    desc: "Experimento web estilo prank con popups y visuales retro inspirados en la red noventera.",
    stack: "JavaScript · Retro UI · CSS Grid",
    year: "2026",
    url: "https://github.com/Lominono/Youreidiot",
  },
];

const TYPED_COMMAND = "$ ls -la ~/projects/ && git status";

export default function TerminalScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedText, setTypedText] = useState("");
  const [showProjects, setShowProjects] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const triggered = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let typingInterval: NodeJS.Timeout | null = null;

    const startTyping = () => {
      if (triggered.current) return;
      triggered.current = true;

      if (prefersReduced) {
        setTypedText(TYPED_COMMAND);
        setShowProjects(true);
        return;
      }

      let i = 0;
      typingInterval = setInterval(() => {
        i++;
        setTypedText(TYPED_COMMAND.slice(0, i));
        audioManager.play("keyclick");
        if (i >= TYPED_COMMAND.length) {
          if (typingInterval) clearInterval(typingInterval);
          setTimeout(() => setShowProjects(true), 250);
        }
      }, 45);
    };

    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-terminal") {
        startTyping();
      }
    };
    checkActive();
    const observer = new MutationObserver(checkActive);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scene"] });

    return () => {
      if (typingInterval) clearInterval(typingInterval);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scene-id="terminal"
      className="relative min-h-screen flex items-center justify-center overflow-hidden crt-scanlines"
      style={{
        background: "#0A0E17",
        color: "#E6EDF3",
        padding: "clamp(2.2rem, 4.5vh, 4.5rem) clamp(1rem, 4vw, 3.5rem)",
      }}
      aria-label="Escena terminal — Proyectos de código"
    >
      {/* CRT vignette overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "820px" }}>
        {/* Terminal top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid rgba(57, 211, 83, 0.2)",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", overflow: "hidden", minWidth: 0 }}>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                flexShrink: 0,
                background: "var(--scene-accent)",
                boxShadow: "0 0 6px rgba(57, 211, 83, 0.5)",
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.6rem, 1.4vw, 0.72rem)",
                color: "var(--scene-accent)",
                letterSpacing: "0.12em",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              [ TTY1 ]
            </span>
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.65rem, 1.6vw, 0.75rem)",
                color: "var(--scene-muted)",
                marginLeft: "0.4rem",
                letterSpacing: "0.08em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              juanfe@devbox:~/github/Lominono
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
            <a
              href="https://github.com/Lominono"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.58rem, 1.4vw, 0.7rem)",
                color: "var(--scene-accent)",
                textDecoration: "none",
                border: "1px solid var(--scene-accent)",
                padding: "0.2rem 0.5rem",
                borderRadius: "2px",
                opacity: 0.85,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              className="hover:opacity-100 hover:bg-[#39D353]/10"
            >
              github/Lominono ↗
            </a>

            <a
              href="https://instagram.com/Juanfer_ost"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.58rem, 1.4vw, 0.7rem)",
                color: "#E5A952",
                textDecoration: "none",
                border: "1px solid rgba(229, 169, 82, 0.6)",
                padding: "0.2rem 0.5rem",
                borderRadius: "2px",
                opacity: 0.9,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              className="hover:opacity-100 hover:bg-[#E5A952]/10"
            >
              ig/Juanfer_ost ↗
            </a>
          </div>
        </div>

        {/* Command line */}
        <div
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "clamp(0.85rem, 2.2vw, 1.05rem)",
            color: "var(--scene-accent)",
            marginBottom: "1.25rem",
            minHeight: "1.6em",
            wordBreak: "break-all",
          }}
        >
          {typedText}
          <span className="cursor-blink" style={{ marginLeft: 2, color: "var(--scene-accent)" }}>█</span>
        </div>

        {/* Projects directory list */}
        {showProjects && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              maxHeight: "clamp(240px, 46vh, 430px)",
              overflowY: "auto",
              paddingRight: "4px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {PROJECTS.map((p, i) => {
              const isSelected = activeProject === i;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProject(i);
                    audioManager.play("keyclick");
                  }}
                  style={{
                    background: isSelected ? "rgba(57, 211, 83, 0.08)" : "rgba(0,0,0,0.25)",
                    border: `1px solid ${isSelected ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.15)"}`,
                    borderLeft: `3px solid ${isSelected ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.3)"}`,
                    padding: "clamp(0.85rem, 2vw, 1.15rem)",
                    cursor: "pointer",
                    color: isSelected ? "var(--scene-fg)" : "var(--scene-muted)",
                    fontFamily: "var(--font-space-mono), monospace",
                    transition: "all 0.2s ease",
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isSelected}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", fontWeight: 700, color: "var(--scene-fg)" }}>
                      <span style={{ opacity: 0.45, fontSize: "0.75em", marginRight: "0.6rem" }}>drwx {p.id}</span>
                      {p.name}
                    </span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.55 }}>{p.year}</span>
                  </div>

                  {isSelected && (
                    <div style={{ marginTop: "0.75rem", paddingTop: "0.6rem", borderTop: "1px dashed rgba(57, 211, 83, 0.2)" }}>
                      <p style={{ fontSize: "clamp(0.72rem, 1.8vw, 0.85rem)", color: "var(--scene-fg)", opacity: 0.9, lineHeight: 1.5 }}>
                        {p.desc}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--scene-accent)",
                            letterSpacing: "0.05em",
                            opacity: 0.9,
                          }}
                        >
                          STACK: {p.stack}
                        </span>

                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: "0.65rem",
                            color: "#000",
                            background: "var(--scene-accent)",
                            padding: "0.25rem 0.65rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            borderRadius: "2px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          repo ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Terminal status line */}
            <div
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.65rem",
                color: "var(--scene-muted)",
                padding: "0.75rem 0.25rem 0",
                opacity: 0.65,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{PROJECTS.length} repositorios cargados · pulsa para explorar</span>
              <span>BRANCH: main [clean]</span>
            </div>
          </div>
        )}

        {/* Green phosphor photo overlay in lower corner — CRT analog pulse */}
        <div
          className="animate-crt-pulse tactile-frame hidden sm:block"
          style={{
            position: "absolute",
            right: 0,
            bottom: "clamp(-3rem, -6vw, -5rem)",
            width: "clamp(80px, 14vw, 135px)",
            aspectRatio: "1",
            borderRadius: "4px",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => audioManager.play("crt")}
          title="Terminal CRT monitor"
          aria-hidden="true"
        >
          <Image
            src="/juanfe-reciente-2.jpg"
            alt=""
            fill
            style={{ objectFit: "cover" }}
            sizes="150px"
          />
        </div>

        {/* Floating Tux Sticker — Linux & SMR Easter Egg */}
        <div className="absolute -right-2 sm:-right-16 -bottom-8 sm:-bottom-12 z-20 hidden sm:block">
          <FloatingSticker
            src="/tux-roses.png"
            alt="Tux con rosas"
            label="TUX · LINUX KERNEL"
            width={120}
            height={150}
            initialRotate={8}
            sound="keyclick"
          />
        </div>
      </div>
    </section>
  );
}
