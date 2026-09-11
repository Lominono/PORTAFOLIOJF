"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { audioManager } from "./AudioManager";
import FloatingSticker from "./FloatingSticker";

// Escena 03 — Terminal / CRT interactiva
// Proyectos reales de GitHub (Lominono)
// Diseñado para interacción táctil fluida en móvil y escritorio

interface Project {
  id: string;
  name: string;
  desc: string;
  category: "web" | "sys" | "exp";
  stack: string[];
  year: string;
  url: string;
}

const PROJECTS: Project[] = [
  {
    id: "01",
    name: "Portafolio_cr",
    desc: "Plataforma web de presentación comercial y cotización de servicios fotográficos.",
    category: "web",
    stack: ["TypeScript", "Next.js", "TailwindCSS"],
    year: "2026",
    url: "https://github.com/Lominono/Portafolio_cr",
  },
  {
    id: "02",
    name: "Ubuntu_samba",
    desc: "App interactiva para simular y practicar comandos de Samba y configuración de IP estática.",
    category: "sys",
    stack: ["Kotlin", "Android", "Redes & Linux"],
    year: "2026",
    url: "https://github.com/Lominono/Ubuntu_samba",
  },
  {
    id: "03",
    name: "Boda_luz_Julio",
    desc: "Invitación digital interactiva con narrativa visual para boda, optimizada para móviles.",
    category: "web",
    stack: ["TypeScript", "React", "Animaciones CSS"],
    year: "2026",
    url: "https://github.com/Lominono/Boda_luz_Julio",
  },
  {
    id: "04",
    name: "Chat-Pker",
    desc: "Aplicación de mensajería rápida para charlar con amigos y probar sockets en tiempo real.",
    category: "exp",
    stack: ["JavaScript", "WebSockets", "Node.js"],
    year: "2025",
    url: "https://github.com/Lominono/Chat-Pker",
  },
  {
    id: "05",
    name: "Youreidiot",
    desc: "Experimento web estilo prank con popups y visuales retro inspirados en la red noventera.",
    category: "exp",
    stack: ["JavaScript", "Retro UI", "CSS Grid"],
    year: "2026",
    url: "https://github.com/Lominono/Youreidiot",
  },
];

const CATEGORIES = [
  { id: "all", label: "TODOS (5)" },
  { id: "web", label: "WEB" },
  { id: "sys", label: "LINUX/REDES" },
  { id: "exp", label: "EXP" },
];

const TYPED_COMMAND = "$ ls -la ~/projects/ && git status";

export default function TerminalScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedText, setTypedText] = useState("");
  const [showProjects, setShowProjects] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const triggered = useRef(false);

  const filteredProjects = activeCategory === "all"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

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
      }, 40);
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

  const handleCopyClone = (e: React.MouseEvent, repoUrl: string, id: string) => {
    e.stopPropagation();
    const cmd = `git clone ${repoUrl}.git`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
    }
    setCopiedId(id);
    audioManager.play("keyclick");
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleRunCommand = (cmd: string) => {
    audioManager.play("keyclick");
    if (cmd === "whoami") {
      setTerminalOutput("→ [tty1] juanfe: 18 años · Santander & Ginebra · Developer & SMR Sysadmin");
    } else if (cmd === "git") {
      setTerminalOutput("→ [git] On branch main · working tree clean · live on Vercel");
    } else if (cmd === "neofetch") {
      setTerminalOutput("→ [arch] Arch Linux x86_64 · Shell: bash 5.2 · Terminal: TTY1 · Stack: Next.js/Kotlin");
    } else {
      setTerminalOutput(null);
    }
  };

  return (
    <section
      ref={sectionRef}
      data-scene-id="terminal"
      className="relative min-h-screen flex items-center justify-center overflow-x-clip crt-scanlines"
      style={{
        background: "#0A0E17",
        color: "#E6EDF3",
        padding: "clamp(2rem, 4vh, 4rem) clamp(0.75rem, 3.5vw, 3rem)",
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

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "800px" }}>
        {/* Terminal top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.85rem",
            paddingBottom: "0.55rem",
            borderBottom: "1px solid rgba(57, 211, 83, 0.2)",
          }}
        >
          <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", overflow: "hidden", minWidth: 0 }}>
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                flexShrink: 0,
                background: "var(--scene-accent)",
                boxShadow: "0 0 6px rgba(57, 211, 83, 0.5)",
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.58rem, 1.3vw, 0.7rem)",
                color: "var(--scene-accent)",
                letterSpacing: "0.1em",
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
                fontSize: "clamp(0.6rem, 1.4vw, 0.72rem)",
                color: "var(--scene-muted)",
                marginLeft: "0.3rem",
                letterSpacing: "0.06em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              juanfe@devbox:~/github/Lominono
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <a
              href="https://github.com/Lominono"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.58rem",
                color: "var(--scene-accent)",
                textDecoration: "none",
                border: "1px solid var(--scene-accent)",
                padding: "0.15rem 0.45rem",
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
                fontSize: "0.58rem",
                color: "#E5A952",
                textDecoration: "none",
                border: "1px solid rgba(229, 169, 82, 0.6)",
                padding: "0.15rem 0.45rem",
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

        {/* Command line & Category touch filters */}
        <div style={{ marginBottom: "0.75rem" }}>
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.75rem, 1.8vw, 0.95rem)",
              color: "var(--scene-accent)",
              minHeight: "1.4em",
              wordBreak: "break-all",
              marginBottom: "0.45rem",
            }}
          >
            {typedText}
            <span className="cursor-blink" style={{ marginLeft: 2, color: "var(--scene-accent)" }}>█</span>
          </div>

          {/* Interactive touch filter tabs */}
          {showProjects && (
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: "0.55rem", opacity: 0.5, marginRight: "0.2rem" }}>
                FILTRAR:
              </span>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      audioManager.play("keyclick");
                    }}
                    className="active:scale-95 transition-transform duration-100"
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: "0.55rem",
                      padding: "0.18rem 0.5rem",
                      borderRadius: "2px",
                      border: `1px solid ${isActive ? "var(--scene-accent)" : "rgba(255,255,255,0.15)"}`,
                      background: isActive ? "rgba(57, 211, 83, 0.15)" : "transparent",
                      color: isActive ? "var(--scene-accent)" : "var(--scene-muted)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Projects directory list - optimized for mobile touch and smooth scrolling */}
        {showProjects && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "clamp(250px, 45vh, 450px)",
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              paddingRight: "0.5rem",
            }}
            data-lenis-prevent="true"
          >
            <div className="flex justify-between items-center px-1 pb-1 text-[0.56rem] font-mono text-[#39D353]/70">
              <span>{filteredProjects.length} REPOSITORIOS DISPONIBLES</span>
              <span className="sm:hidden animate-pulse">↕ DESLIZA PARA SCROLL</span>
            </div>
            {filteredProjects.map((p, i) => {
              const isSelected = activeProject === i;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProject(i);
                    audioManager.play("keyclick");
                  }}
                  className="active:scale-[0.99] transition-transform duration-100"
                  style={{
                    background: isSelected ? "rgba(57, 211, 83, 0.09)" : "rgba(0,0,0,0.28)",
                    border: `1px solid ${isSelected ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.14)"}`,
                    borderLeft: `3px solid ${isSelected ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.28)"}`,
                    padding: "clamp(0.55rem, 1.4vh, 0.85rem) clamp(0.65rem, 1.8vw, 1rem)",
                    cursor: "pointer",
                    color: isSelected ? "var(--scene-fg)" : "var(--scene-muted)",
                    fontFamily: "var(--font-space-mono), monospace",
                    transition: "all 0.15s ease",
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isSelected}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "clamp(0.78rem, 1.8vw, 0.92rem)", fontWeight: 700, color: "var(--scene-fg)" }}>
                      <span style={{ opacity: 0.45, fontSize: "0.75em", marginRight: "0.45rem" }}>drwx {p.id}</span>
                      {p.name}
                    </span>
                    <span style={{ fontSize: "0.58rem", opacity: 0.55 }}>{p.year}</span>
                  </div>

                  {isSelected && (
                    <div style={{ marginTop: "0.5rem", paddingTop: "0.45rem", borderTop: "1px dashed rgba(57, 211, 83, 0.2)" }}>
                      <p style={{ fontSize: "clamp(0.68rem, 1.5vw, 0.8rem)", color: "var(--scene-fg)", opacity: 0.9, lineHeight: 1.45 }}>
                        {p.desc}
                      </p>

                      {/* Tech badges */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.45rem" }}>
                        {p.stack.map((item, sIdx) => (
                          <span
                            key={sIdx}
                            style={{
                              fontSize: "0.52rem",
                              background: "rgba(57, 211, 83, 0.08)",
                              border: "1px solid rgba(57, 211, 83, 0.25)",
                              color: "var(--scene-accent)",
                              padding: "0.1rem 0.35rem",
                              borderRadius: "2px",
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Mobile interactive action buttons */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.35rem",
                          marginTop: "0.55rem",
                        }}
                      >
                        <button
                          onClick={(e) => handleCopyClone(e, p.url, p.id)}
                          style={{
                            fontSize: "0.58rem",
                            fontFamily: "var(--font-space-mono), monospace",
                            background: copiedId === p.id ? "var(--scene-accent)" : "rgba(255, 255, 255, 0.06)",
                            color: copiedId === p.id ? "#000" : "var(--scene-fg)",
                            border: "1px solid rgba(57, 211, 83, 0.35)",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "2px",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          {copiedId === p.id ? "COPIADO ✓" : "copiar git clone 📋"}
                        </button>

                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: "0.58rem",
                            color: "#000",
                            background: "var(--scene-accent)",
                            padding: "0.2rem 0.55rem",
                            fontWeight: 700,
                            textDecoration: "none",
                            borderRadius: "2px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
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
          </div>
        )}

        {/* Interactive quick chips (Touch command runner) */}
        {showProjects && (
          <div style={{ marginTop: "0.6rem" }}>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: "0.55rem", opacity: 0.5 }}>
                RUN:
              </span>
              {[
                { cmd: "whoami", label: "$ whoami" },
                { cmd: "git", label: "$ git status" },
                { cmd: "neofetch", label: "$ neofetch" },
                { cmd: "clear", label: "$ clear" },
              ].map((c) => (
                <button
                  key={c.cmd}
                  onClick={() => handleRunCommand(c.cmd)}
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: "0.55rem",
                    padding: "0.15rem 0.45rem",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(57, 211, 83, 0.2)",
                    color: "var(--scene-accent)",
                    borderRadius: "2px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  className="hover:bg-[#39D353]/15"
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Command output box */}
            {terminalOutput && (
              <div
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "0.62rem",
                  color: "var(--scene-fg)",
                  background: "rgba(0, 0, 0, 0.45)",
                  border: "1px dashed rgba(57, 211, 83, 0.35)",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "2px",
                  marginTop: "0.45rem",
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                {terminalOutput}
              </div>
            )}
          </div>
        )}

        {/* Status line */}
        {showProjects && (
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "0.58rem",
              color: "var(--scene-muted)",
              paddingTop: "0.5rem",
              opacity: 0.6,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.25rem",
            }}
          >
            <span>{filteredProjects.length} repos · toca para abrir / copiar</span>
            <span>BRANCH: main [clean]</span>
          </div>
        )}

        {/* Green phosphor photo overlay in corner — Only on desktop so it never covers mobile */}
        <div
          className="animate-crt-pulse tactile-frame hidden md:block"
          style={{
            position: "absolute",
            right: 0,
            bottom: "-3.5rem",
            width: "115px",
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
            sizes="115px"
          />
        </div>

        {/* Floating Tux Sticker — Only on desktop to protect mobile readability */}
        <div className="absolute -right-12 -bottom-10 z-20 hidden md:block">
          <FloatingSticker
            src="/tux-roses.png"
            alt="Tux con rosas"
            label="TUX · LINUX KERNEL"
            width={100}
            height={125}
            initialRotate={8}
            sound="keyclick"
          />
        </div>
      </div>
    </section>
  );
}
