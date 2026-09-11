"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { audioManager } from "./AudioManager";

// Escena 08 — Créditos finales cinematográficos & Showcase TikTok
// Monumental "JuanFe", vídeo vertical de TikTok con control de audio,
// y enlaces directos con iconos a TikTok, Instagram, GitHub y Email.

interface SocialPlatform {
  name: string;
  handle: string;
  badge: string;
  link: string;
  actionText: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: "TikTok",
    handle: "@yuanfer",
    badge: "VÍDEOS & CONTENIDO",
    link: "https://www.tiktok.com/@yuanfer",
    actionText: "Seguir en TikTok ↗",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.26 6.26 0 0 0 1.97-4.49V8.62a8.28 8.28 0 0 0 4.8 1.52V6.69z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    handle: "@Juanfer_ost",
    badge: "HISTORIAS & DÍA A DÍA",
    link: "https://instagram.com/Juanfer_ost",
    actionText: "Seguir en Instagram ↗",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    handle: "github.com/Lominono",
    badge: "CÓDIGO & REPOSITORIOS",
    link: "https://github.com/Lominono",
    actionText: "Ver repositorios ↗",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "Email de Contacto",
    handle: "juanfernandoospina005@gmail.com",
    badge: "PROYECTOS & TRABAJO",
    link: "mailto:juanfernandoospina005@gmail.com",
    actionText: "Escribir email ↗",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function CreditsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSoundActive, setVideoSoundActive] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!containerRef.current || prefersReduced) return;

    const elements = containerRef.current.querySelectorAll(".anim-credit");
    gsap.set(elements, { opacity: 0, y: 24 });

    const tl = gsap.timeline({ paused: true });
    tl.to(elements, {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power2.out",
    });

    let hasPlayed = false;
    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-credits" && !hasPlayed) {
        hasPlayed = true;
        tl.play();
        // Ensure background music is running smoothly
        audioManager.startBgMusic();
      }
    };
    checkActive();
    const observer = new MutationObserver(checkActive);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scene"] });

    return () => {
      tl.kill();
      observer.disconnect();
      // Ensure background audio is un-ducked when leaving scene
      audioManager.duck(false);
    };
  }, []);

  const toggleVideoSound = () => {
    if (!videoRef.current) return;
    const newSoundState = !videoSoundActive;
    setVideoSoundActive(newSoundState);

    if (newSoundState) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      // Duck background ambient music so TikTok video audio is crystal clear
      audioManager.duck(true);
    } else {
      videoRef.current.muted = true;
      // Restore background ambient music
      audioManager.duck(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      data-scene-id="credits"
      className="relative min-h-screen flex flex-col justify-center overflow-x-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 20%, #111111 0%, #050505 70%, #000000 100%)",
        color: "#EDE8D0",
        padding: "clamp(1.75rem, 4vh, 4rem) clamp(0.85rem, 3.5vw, 3rem)",
        touchAction: "pan-y",
      }}
      aria-label="Créditos finales de la película interactiva"
    >
      <div
        ref={containerRef}
        className="w-full max-w-6xl mx-auto flex flex-col gap-6 md:gap-10 relative z-10"
      >
        {/* HEADER: Monumental "JuanFe" Typography */}
        <header className="text-center anim-credit flex flex-col items-center">
          <div
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.55rem, 1.2vw, 0.72rem)",
              color: "var(--scene-accent, #E8A87C)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "0.35rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--scene-accent, #E8A87C)", display: "inline-block" }} />
            CRÉDITOS FINALES · DIRECCIÓN & CREACIÓN
          </div>

          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(2.6rem, 9.5vw, 6.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              margin: "0.15rem 0 0.5rem",
              color: "#FFFBF2",
              textShadow: "0 0 35px rgba(232, 168, 124, 0.22)",
            }}
          >
            JuanFe
          </h1>

          <p
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.65rem, 1.4vw, 0.85rem)",
              color: "#A8A090",
              maxWidth: "580px",
              lineHeight: 1.45,
              letterSpacing: "0.04em",
            }}
          >
            Sistemas Microinformáticos y Redes · Desarrollador Web · Creador de Contenido
          </p>
        </header>

        {/* MAIN BODY: Grid with Platform Channels (Left) & TikTok Video Showcase (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
          
          {/* LEFT: Social Platform Follow Cards (7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4 order-2 lg:order-1">
            <div className="anim-credit mb-2">
              <span
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "clamp(0.65rem, 1.3vw, 0.75rem)",
                  color: "var(--scene-accent, #E8A87C)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                CONÉCTATE Y SÍGUEME
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: "clamp(1.25rem, 3vw, 1.85rem)",
                  color: "#F4EFEA",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Disponible en todas mis plataformas oficiales
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 anim-credit">
              {SOCIAL_PLATFORMS.map((platform, idx) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={idx}
                    href={platform.link}
                    target={platform.link.startsWith("http") ? "_blank" : undefined}
                    rel={platform.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-sm active:scale-[0.98] transition-all duration-150"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--scene-accent, #E8A87C)";
                      e.currentTarget.style.background = "rgba(232, 168, 124, 0.08)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      e.currentTarget.style.transform = "none";
                    }}
                    aria-label={`${platform.name}: ${platform.handle}`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            color: "var(--scene-accent, #E8A87C)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon />
                        </div>
                        <div>
                          <span
                            style={{
                              fontFamily: "var(--font-fraunces), serif",
                              fontSize: "1.05rem",
                              fontWeight: 700,
                              color: "#FFF",
                              display: "block",
                            }}
                          >
                            {platform.name}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-space-mono), monospace",
                              fontSize: "0.6rem",
                              color: "#888",
                              letterSpacing: "0.15em",
                            }}
                          >
                            {platform.badge}
                          </span>
                        </div>
                      </div>
                      <span
                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--scene-accent, #E8A87C)", fontSize: "1rem" }}
                      >
                        ↗
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: "0.78rem",
                        color: "var(--scene-accent, #E8A87C)",
                        marginTop: "0.4rem",
                        wordBreak: "break-all",
                      }}
                    >
                      {platform.handle}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Technical metadata pills */}
            <div
              className="anim-credit mt-3 p-3.5 rounded-sm flex flex-wrap items-center justify-between gap-3"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed rgba(255, 255, 255, 0.12)",
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.68rem",
                color: "#999",
              }}
            >
              <div>
                <strong style={{ color: "#D4C9B0" }}>Formación:</strong> SMR (Sistemas Microinformáticos y Redes)
              </div>
              <div>
                <strong style={{ color: "#D4C9B0" }}>Ruta:</strong> Ginebra (Valle) ➔ Santander (Cantabria)
              </div>
            </div>
          </div>

          {/* RIGHT: TikTok Video Showcase (5 columns on desktop, centered) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center anim-credit order-1 lg:order-2">
            <div
              className="relative rounded-lg overflow-hidden flex flex-col items-center"
              style={{
                width: "100%",
                maxWidth: "clamp(200px, 58vw, 260px)",
                background: "#0A0A0A",
                border: "1px solid rgba(232, 168, 124, 0.25)",
                boxShadow: "0 14px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(232, 168, 124, 0.1)",
              }}
            >
              {/* Header Badge */}
              <div
                className="w-full flex items-center justify-between px-3 py-1.5"
                style={{
                  background: "rgba(20, 20, 20, 0.9)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#00f2fe" }}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.26 6.26 0 0 0 1.97-4.49V8.62a8.28 8.28 0 0 0 4.8 1.52V6.69z" />
                  </svg>
                  <span style={{ color: "#FFF", fontWeight: 700 }}>TIKTOK</span>
                </div>
                <span style={{ color: "var(--scene-accent, #E8A87C)", opacity: 0.9 }}>@yuanfer</span>
              </div>

              {/* Vertical Video Element */}
              <div className="relative w-full aspect-[9/16] bg-black overflow-hidden group">
                <video
                  ref={videoRef}
                  src="/videos/tiktok-yuanfer.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label="Vídeo de TikTok de JuanFe @yuanfer"
                />

                {/* Scanline CRT overlay effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
                    backgroundSize: "100% 4px",
                    opacity: 0.35,
                  }}
                  aria-hidden="true"
                />

                {/* Floating Sound Toggle Pill */}
                <button
                  onClick={toggleVideoSound}
                  className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full text-xs active:scale-95 transition-all duration-150"
                  style={{
                    background: videoSoundActive ? "rgba(232, 168, 124, 0.95)" : "rgba(10, 10, 10, 0.85)",
                    color: videoSoundActive ? "#000" : "#FFF",
                    backdropFilter: "blur(8px)",
                    border: videoSoundActive ? "1px solid #E8A87C" : "1px solid rgba(255, 255, 255, 0.25)",
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: "0.64rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                  }}
                  aria-label={videoSoundActive ? "Silenciar vídeo" : "Activar sonido del vídeo"}
                >
                  {videoSoundActive ? (
                    <>
                      <span>🔊 SONIDO ACTIVO</span>
                      <span className="text-[0.58rem] opacity-75">(Toca para silenciar)</span>
                    </>
                  ) : (
                    <>
                      <span>🔇 ACTIVAR SONIDO</span>
                      <span className="text-[0.58rem] opacity-75">(Toca para escuchar)</span>
                    </>
                  )}
                </button>
              </div>

              {/* TikTok Follow CTA */}
              <a
                href="https://www.tiktok.com/@yuanfer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 flex items-center justify-center gap-2 active:scale-98 transition-all duration-150"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#FFF",
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--scene-accent, #E8A87C)";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "#FFF";
                }}
              >
                <span>SEGUIR EN TIKTOK @yuanfer</span>
                <span>↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* FOOTER: Signature & Rewind Button */}
        <footer className="anim-credit mt-2 pt-5 flex flex-col items-center gap-3 text-center border-t border-white/10">
          <span
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.6rem, 1.3vw, 0.72rem)",
              color: "#7E786B",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            © 2026 JuanFe — Fin de la película interactiva
          </span>

          <button
            onClick={scrollToTop}
            className="active:scale-95 transition-all duration-150"
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.62rem, 1.3vw, 0.72rem)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: "transparent",
              color: "var(--scene-accent, #E8A87C)",
              border: "1px solid var(--scene-accent, #E8A87C)",
              padding: "0.45rem 1.25rem",
              borderRadius: "2px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--scene-accent, #E8A87C)";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--scene-accent, #E8A87C)";
            }}
            aria-label="Volver al inicio del relato"
          >
            ↑ Rebobinar película al inicio
          </button>
        </footer>
      </div>
    </section>
  );
}
