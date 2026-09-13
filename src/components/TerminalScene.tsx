"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { audioManager } from "./AudioManager";

// Escena 03 — Estación de trabajo Hacker / Git Terminal
// Proyectos reales de GitHub de JuanFe (Lominono)
// Estética Linux Arch / UNIX TTY con git log, diff stats y proyectos reales
// Cero clichés de IA, cero gradientes morados, pura autenticidad de sysadmin y dev


interface Project {
  id: string;
  name: string;
  desc: string;
  archNote: string;
  category: "web" | "sys" | "exp";
  stack: string[];
  year: string;
  url: string;
  commitHash: string;
  branch: string;
  diffAdded: number;
  diffDeleted: number;
  filesChanged: number;
}

const PROJECTS: Project[] = [
  {
    id: "01",
    name: "Portafolio_cr",
    desc: "Plataforma web de presentación comercial y cotización de servicios fotográficos profesionales.",
    archNote: "Diseño tipográfico editorial de alto contraste, orquestación de imágenes de alta fidelidad y motor de cotización en cliente.",
    category: "web",
    stack: ["TypeScript", "Next.js", "TailwindCSS"],
    year: "2026",
    url: "https://github.com/Lominono/Portafolio_cr",
    commitHash: "7f2a1b9",
    branch: "main",
    diffAdded: 412,
    diffDeleted: 38,
    filesChanged: 14,
  },
  {
    id: "02",
    name: "Ubuntu_samba",
    desc: "Simulador interactivo para Android para practicar configuración de servidores Samba e IP estática.",
    archNote: "Diseñado para laboratorio de redes SMR: permite emular sintaxis de smb.conf, permisos UNIX y comprobaciones de routing sin servidor físico.",
    category: "sys",
    stack: ["Kotlin", "Android SDK", "Linux / SMR", "Samba"],
    year: "2026",
    url: "https://github.com/Lominono/Ubuntu_samba",
    commitHash: "3c89df1",
    branch: "feature/samba-cfg",
    diffAdded: 580,
    diffDeleted: 64,
    filesChanged: 19,
  },
  {
    id: "03",
    name: "Boda_luz_Julio",
    desc: "Invitación digital interactiva con narrativa visual cinematográfica y confirmación en tiempo real.",
    archNote: "Orquestación de micro-animaciones CSS y diseño mobile-first pensado para dispositivos táctiles de distintas densidades de píxel.",
    category: "web",
    stack: ["TypeScript", "React", "CSS Motion", "Mobile-UX"],
    year: "2026",
    url: "https://github.com/Lominono/Boda_luz_Julio",
    commitHash: "a152e04",
    branch: "main",
    diffAdded: 290,
    diffDeleted: 15,
    filesChanged: 9,
  },
  {
    id: "04",
    name: "Chat-Pker",
    desc: "Aplicación de mensajería instantánea de baja latencia con sockets en tiempo real entre peers.",
    archNote: "Implementación ligera de WebSockets en Node.js para experimentación de salas concurrentes, gestión de eventos y reconexión resiliente.",
    category: "exp",
    stack: ["JavaScript", "WebSockets", "Node.js", "Express"],
    year: "2025",
    url: "https://github.com/Lominono/Chat-Pker",
    commitHash: "8b90c12",
    branch: "main",
    diffAdded: 345,
    diffDeleted: 52,
    filesChanged: 11,
  },
  {
    id: "05",
    name: "Youreidiot",
    desc: "Experimento web retro estilo broma digital de los 90s con recreación de ventanas flotantes.",
    archNote: "Prueba de estrés de posicionamiento absoluto del DOM, manipulación de bucles de animación y estética de la red de finales del siglo XX.",
    category: "exp",
    stack: ["JavaScript", "Retro UI", "CSS Grid", "Canvas"],
    year: "2026",
    url: "https://github.com/Lominono/Youreidiot",
    commitHash: "e42f7a9",
    branch: "main",
    diffAdded: 198,
    diffDeleted: 22,
    filesChanged: 5,
  },
];

const CATEGORIES = [
  { id: "all", label: "ALL_REPOS (5)" },
  { id: "web", label: "WEB_STACK" },
  { id: "sys", label: "LINUX / NETWORKS" },
  { id: "exp", label: "EXPERIMENTS" },
];

const TYPED_COMMAND = "$ git log --graph --all --oneline --decorate -n 5";

export default function TerminalScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedText, setTypedText] = useState("");
  const [showProjects, setShowProjects] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"list" | "detail">("list");
  const triggered = useRef(false);

  const filteredProjects = activeCategory === "all"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);


  const currentProject = filteredProjects[activeProjectIdx] || filteredProjects[0] || PROJECTS[0];

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
          setTimeout(() => setShowProjects(true), 200);
        }
      }, 35);
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

  // Keyboard navigation for power users (Up/Down or J/K to navigate, C to copy clone)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (document.documentElement.dataset.scene !== "scene-terminal") return;
      if (!showProjects) return;

      if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        setActiveProjectIdx((prev) => (prev + 1) % filteredProjects.length);
        audioManager.play("keyclick");
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        setActiveProjectIdx((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
        audioManager.play("keyclick");
      } else if (e.key === "c" || e.key === "C") {
        if (currentProject) {
          const cmd = `git clone ${currentProject.url}.git`;
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(cmd);
          }
          setCopiedId(currentProject.id);
          audioManager.play("keyclick");
          setTimeout(() => setCopiedId(null), 1800);
        }
      }
    },
    [showProjects, filteredProjects.length, currentProject]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

  return (
    <section
      ref={sectionRef}
      data-scene-id="terminal"
      className="relative min-h-screen flex items-center justify-center overflow-x-clip crt-scanlines"
      style={{
        background: "#080C14",
        color: "#E6EDF3",
        padding: "clamp(1.5rem, 4vh, 3.5rem) clamp(0.75rem, 3.5vw, 3rem)",
      }}
      aria-label="Escena terminal — Proyectos de código y repositorios Git"
    >
      {/* CRT scanlines vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        className="relative z-10 w-full max-w-[980px] p-2.5 sm:p-5 rounded-xl border border-[#39D353]/30 bg-[#070B12]/95 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]"
        style={{
          boxShadow: "0 0 0 1px rgba(57, 211, 83, 0.15), 0 20px 50px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* UNIX Workstation Status Line */}
        <div
          className="flex items-center justify-between font-mono text-[0.56rem] text-[#39D353]/90 pb-2 mb-2.5 border-b border-[#39D353]/25 select-none"
          style={{ letterSpacing: "0.06em" }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#39D353]" />
            <span className="font-bold text-white tracking-wide">DEVBOX :: WORKSTATION</span>
            <span className="text-[#39D353]/60 hidden sm:inline">Linux 6.12-lts (x86_64)</span>
          </div>

          <div className="flex items-center gap-2.5 text-[0.52rem]">
            <span className="text-[#8E8696]">Santander, ES</span>
            <span className="text-[#39D353] font-mono">STATUS: UP</span>
            <span className="text-[#39D353]/60">TTY1</span>
          </div>
        </div>

        {/* Terminal Header Bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-2 border-b border-[#39D353]/25"
        >
          {/* Machine & Path Badge */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", overflow: "hidden", minWidth: 0 }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "1px",
                background: "var(--scene-accent)",
                boxShadow: "0 0 8px rgba(57, 211, 83, 0.7)",
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.62rem, 1.4vw, 0.75rem)",
                color: "var(--scene-accent)",
                letterSpacing: "0.08em",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              [ TTY1 · ARCH-WORKSTATION ]
            </span>
            <span
              className="hidden md:inline"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.6rem, 1.3vw, 0.7rem)",
                color: "var(--scene-muted)",
                letterSpacing: "0.04em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              juanfe@devbox:~/github/Lominono (git:main*)
            </span>
          </div>

          {/* Quick profile links */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <a
              href="https://github.com/Lominono"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.56rem",
                color: "var(--scene-accent)",
                textDecoration: "none",
                border: "1px solid var(--scene-accent)",
                padding: "0.18rem 0.5rem",
                borderRadius: "2px",
                background: "rgba(57, 211, 83, 0.05)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                transition: "all 0.15s",
              }}
              className="hover:bg-[#39D353]/20 hover:text-white"
            >
              GH/Lominono ↗
            </a>

            <a
              href="https://instagram.com/Juanfer_ost"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.56rem",
                color: "#E5A952",
                textDecoration: "none",
                border: "1px solid rgba(229, 169, 82, 0.6)",
                padding: "0.18rem 0.5rem",
                borderRadius: "2px",
                background: "rgba(229, 169, 82, 0.05)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                transition: "all 0.15s",
              }}
              className="hover:bg-[#E5A952]/20 hover:text-white"
            >
              IG/Juanfer_ost ↗
            </a>
          </div>
        </div>

        {/* Command Line & Filter Tabs */}
        <div style={{ marginBottom: "0.85rem" }}>
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.72rem, 1.8vw, 0.92rem)",
              color: "var(--scene-accent)",
              minHeight: "1.4em",
              wordBreak: "break-all",
              marginBottom: "0.5rem",
            }}
          >
            {typedText}
            <span className="cursor-blink" style={{ marginLeft: 3, color: "var(--scene-accent)" }}>
              █
            </span>
          </div>

          {/* Interactive filter tabs */}
          {showProjects && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[0.52rem] text-[#888] mr-1 uppercase">SCOPE:</span>
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setActiveProjectIdx(0);
                        audioManager.play("keyclick");
                      }}
                      className="active:scale-95 transition-all"
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: "0.54rem",
                        padding: "0.18rem 0.5rem",
                        borderRadius: "2px",
                        border: `1px solid ${isActive ? "var(--scene-accent)" : "rgba(255,255,255,0.14)"}`,
                        background: isActive ? "rgba(57, 211, 83, 0.16)" : "rgba(0,0,0,0.3)",
                        color: isActive ? "var(--scene-accent)" : "#999",
                        cursor: "pointer",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="hidden lg:flex items-center gap-2 font-mono text-[0.5rem] text-[#666]">
                <span>[ ↑/↓ o J/K : navegar ]</span>
                <span>[ C : copiar clone ]</span>
              </div>
            </div>
          )}
        </div>

        {/* Workstation Split View: Left (Git Log Tree) | Right (Repo Dossier Inspector) */}
        {showProjects && (
          <>
            {/* Mobile View Toggle Segment (< lg) */}
            <div className="flex lg:hidden items-center gap-1.5 mb-2 font-mono text-[0.58rem]">
              <button
                onClick={() => {
                  setMobileTab("list");
                  audioManager.play("keyclick");
                }}
                className="flex-1 py-1.5 px-2 rounded border text-center font-bold active:scale-98 transition-all cursor-pointer"
                style={{
                  background: mobileTab === "list" ? "rgba(57, 211, 83, 0.18)" : "rgba(0,0,0,0.4)",
                  borderColor: mobileTab === "list" ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.25)",
                  color: mobileTab === "list" ? "#FFF" : "#888",
                }}
              >
                ≡ COMMITS ({filteredProjects.length})
              </button>
              <button
                onClick={() => {
                  setMobileTab("detail");
                  audioManager.play("keyclick");
                }}
                className="flex-1 py-1.5 px-2 rounded border text-center font-bold truncate active:scale-98 transition-all cursor-pointer"
                style={{
                  background: mobileTab === "detail" ? "rgba(57, 211, 83, 0.18)" : "rgba(0,0,0,0.4)",
                  borderColor: mobileTab === "detail" ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.25)",
                  color: mobileTab === "detail" ? "#FFF" : "#888",
                }}
              >
                🔍 INSPECTOR: {currentProject.name}
              </button>
            </div>

            <div
              className="grid grid-cols-1 lg:grid-cols-12 gap-3"
              style={{
                maxHeight: "clamp(300px, 52vh, 560px)",
                alignItems: "stretch",
              }}
            >
              {/* Left Column: Git Tree Log (6 Cols on desktop) */}
              <div
                className={`lg:col-span-6 flex-col gap-1.5 overflow-y-auto pr-1 ${
                  mobileTab === "list" ? "flex" : "hidden lg:flex"
                }`}
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
                data-lenis-prevent="true"
              >
                <div className="flex justify-between items-center px-1 pb-1 font-mono text-[0.54rem] text-[#39D353]/80 border-b border-[#39D353]/20">
                  <span>GIT COMMIT LOG & TREE</span>
                  <span>{filteredProjects.length} REPOS FOUND</span>
                </div>

                {filteredProjects.map((p, i) => {
                  const isSelected = activeProjectIdx === i;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProjectIdx(i);
                        setMobileTab("detail");
                        audioManager.play("keyclick");
                      }}
                      className="group active:scale-[0.99] transition-all cursor-pointer select-none"
                      style={{
                        background: isSelected ? "rgba(57, 211, 83, 0.08)" : "rgba(10, 16, 26, 0.6)",
                        border: `1px solid ${isSelected ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.18)"}`,
                        borderLeft: `4px solid ${isSelected ? "var(--scene-accent)" : "rgba(57, 211, 83, 0.3)"}`,
                        padding: "0.55rem 0.75rem",
                        borderRadius: "2px",
                        boxShadow: isSelected ? "0 0 14px rgba(57, 211, 83, 0.12)" : "none",
                      }}
                    >
                      {/* Commit graph line & Repo name */}
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[#39D353] font-mono text-[0.7rem] font-bold">
                            {isSelected ? "▶" : "*"}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-space-mono), monospace",
                              fontSize: "clamp(0.75rem, 1.5vw, 0.86rem)",
                              fontWeight: 700,
                              color: isSelected ? "#FFFFFF" : "var(--scene-fg)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.name}
                          </span>
                        </div>

                        {/* Commit hash pill */}
                        <span className="font-mono text-[0.54rem] text-[#39D353]/90 bg-[#39D353]/10 px-1.5 py-0.5 rounded border border-[#39D353]/30 shrink-0">
                          {p.commitHash}
                        </span>
                      </div>

                      {/* Metadata line: diff stats and branch */}
                      <div className="flex items-center justify-between text-[0.52rem] font-mono text-[#888] mt-1.5 pt-1 border-t border-[#39D353]/10">
                        <div className="flex items-center gap-2">
                          <span className="text-[#888]">branch:{p.branch}</span>
                          <span className="text-[#39D353]">+{p.diffAdded}</span>
                          <span className="text-[#F85149]">-{p.diffDeleted}</span>
                        </div>
                        <span className="text-[#666]">{p.year}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Repository Dossier & Inspector (6 Cols on desktop) */}
              <div
                className={`lg:col-span-6 flex-col justify-between overflow-y-auto ${
                  mobileTab === "detail" ? "flex" : "hidden lg:flex"
                }`}
                style={{
                  background: "rgba(5, 9, 15, 0.85)",
                  border: "1px solid rgba(57, 211, 83, 0.3)",
                  padding: "clamp(0.75rem, 2vh, 1.1rem)",
                  borderRadius: "3px",
                }}
                data-lenis-prevent="true"
              >
                <div>
                  {/* Dossier Header */}
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#39D353]/25 font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setMobileTab("list");
                          audioManager.play("keyclick");
                        }}
                        className="lg:hidden text-[0.54rem] text-[#39D353] bg-[#39D353]/15 border border-[#39D353]/30 px-1.5 py-0.5 rounded cursor-pointer active:scale-95"
                        title="Volver a lista de commits"
                      >
                        ← LISTA
                      </button>
                      <span className="text-[#DE9F43] text-[0.62rem] font-bold">[ INSPECTOR ]</span>
                      <span className="text-[0.68rem] text-white font-bold tracking-wider uppercase">
                        {currentProject.name}
                      </span>
                    </div>
                    <span className="text-[0.52rem] text-[#888]">REF: HEAD·{currentProject.commitHash}</span>
                  </div>

                {/* Purpose / Architectural rationale */}
                <div className="mb-3">
                  <p className="font-mono text-[0.65rem] sm:text-[0.72rem] text-[#E6EDF3] leading-relaxed mb-2">
                    {currentProject.desc}
                  </p>
                  <div className="bg-[#03060A] p-2 rounded border border-[#39D353]/15 font-mono text-[0.56rem] sm:text-[0.62rem] text-[#9EA7B3] leading-normal">
                    <span className="text-[#39D353] font-bold">NOTA TÉCNICA: </span>
                    {currentProject.archNote}
                  </div>
                </div>

                {/* Diff stats breakdown */}
                <div className="mb-3 font-mono text-[0.54rem] flex flex-col gap-1">
                  <div className="flex justify-between text-[#888]">
                    <span>MODIFICACIONES DEL COMMIT:</span>
                    <span>{currentProject.filesChanged} archivos afectados</span>
                  </div>
                  <div className="w-full bg-[#161B22] h-2 rounded overflow-hidden flex border border-[#30363D]">
                    <div
                      style={{
                        width: `${Math.round((currentProject.diffAdded / (currentProject.diffAdded + currentProject.diffDeleted)) * 100)}%`,
                        background: "#39D353",
                      }}
                      title={`+${currentProject.diffAdded} líneas añadidas`}
                    />
                    <div
                      style={{
                        width: `${Math.round((currentProject.diffDeleted / (currentProject.diffAdded + currentProject.diffDeleted)) * 100)}%`,
                        background: "#F85149",
                      }}
                      title={`-${currentProject.diffDeleted} líneas eliminadas`}
                    />
                  </div>
                  <div className="flex justify-between text-[0.5rem] text-[#777]">
                    <span className="text-[#39D353]">+{currentProject.diffAdded} inserciones</span>
                    <span className="text-[#F85149]">-{currentProject.diffDeleted} supresiones</span>
                  </div>
                </div>

                {/* Stack Packages (styled like Linux packages) */}
                <div className="mb-3">
                  <span className="font-mono text-[0.52rem] text-[#888] block mb-1">DEPENDENCIAS & ENTORNO:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProject.stack.map((item, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[0.52rem] px-1.5 py-0.5 rounded bg-[#39D353]/10 border border-[#39D353]/30 text-[#39D353]"
                      >
                        pkg:{item.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#39D353]/20 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={(e) => handleCopyClone(e, currentProject.url, currentProject.id)}
                  className="font-mono text-[0.58rem] py-1.5 px-3 rounded border border-[#39D353]/50 text-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  style={{
                    background: copiedId === currentProject.id ? "#39D353" : "rgba(57, 211, 83, 0.1)",
                    color: copiedId === currentProject.id ? "#000" : "#39D353",
                    fontWeight: 700,
                  }}
                  title="Copiar comando de clonación al portapapeles"
                >
                  <span>{copiedId === currentProject.id ? "COPIADO AL PORTAPAPELES ✓" : "copiar git clone 📋"}</span>
                </button>

                <a
                  href={currentProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.58rem] py-1.5 px-3 rounded font-bold text-black bg-[#39D353] hover:bg-[#48e864] active:scale-95 transition-all flex items-center gap-1 text-decoration-none cursor-pointer"
                >
                  <span>ABRIR EN GITHUB</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      </div>
    </section>
  );
}
