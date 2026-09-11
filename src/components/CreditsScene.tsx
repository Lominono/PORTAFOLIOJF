"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Escena 08 — Créditos finales cinematográficos
// Fondo negro, tipografía dorada/marfil con aparición gradual
// Enlaces directos a GitHub (Lominono) y correo de contacto

const CREDITS = [
  { role: "creado y programado por", name: "JuanFe", link: null },
  { role: "perfil en github", name: "github.com/Lominono", link: "https://github.com/Lominono" },
  { role: "correo de contacto", name: "juanfernandoospina005@gmail.com", link: "mailto:juanfernandoospina005@gmail.com" },
  { role: "formación técnica", name: "Sistemas Microinformáticos y Redes (SMR)", link: null },
  { role: "coordenadas", name: "Ginebra (Valle) ➔ Santander (Cantabria)", link: null },
];

export default function CreditsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const topBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lines = linesRef.current.filter(Boolean);

    if (prefersReduced) {
      lines.forEach((l) => {
        l.style.opacity = "1";
        l.style.transform = "none";
      });
      if (endRef.current) endRef.current.style.opacity = "1";
      if (topBtnRef.current) topBtnRef.current.style.opacity = "1";
      return;
    }

    gsap.set(lines, { opacity: 0, y: 30 });
    gsap.set([endRef.current, topBtnRef.current], { opacity: 0, y: 15 });

    const tl = gsap.timeline({ paused: true });

    tl.to(lines, {
      opacity: 1,
      y: 0,
      stagger: 0.28,
      duration: 0.9,
      ease: "power3.out",
    })
    .to(
      endRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.2"
    )
    .to(
      topBtnRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.3"
    );

    let hasPlayed = false;
    const checkActive = () => {
      if (document.documentElement.dataset.scene === "scene-credits" && !hasPlayed) {
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      data-scene-id="credits"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#000000",
        color: "#D4C9B0",
        padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)",
      }}
      aria-label="Créditos finales de la película interactiva"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(2rem, 5vw, 3.5rem)",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        {CREDITS.map((credit, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) linesRef.current[i] = el;
            }}
            style={{ willChange: "opacity, transform" }}
          >
            <div
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "clamp(0.55rem, 1.3vw, 0.72rem)",
                color: "var(--scene-muted)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
                opacity: 0.7,
              }}
            >
              {credit.role}
            </div>

            <div
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 700,
                fontSize: "clamp(1.15rem, 3.8vw, 2.1rem)",
                color: "var(--scene-fg)",
                letterSpacing: "-0.015em",
              }}
            >
              {credit.link ? (
                <a
                  href={credit.link}
                  target={credit.link.startsWith("http") ? "_blank" : undefined}
                  rel={credit.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--scene-accent)",
                    transition: "opacity 0.2s, border-color 0.2s",
                  }}
                  className="hover:opacity-80"
                >
                  {credit.name} {credit.link.startsWith("http") ? "↗" : ""}
                </a>
              ) : (
                credit.name
              )}
            </div>
          </div>
        ))}

        {/* FIN & Signature */}
        <div
          ref={endRef}
          style={{
            marginTop: "clamp(1.5rem, 4vw, 3rem)",
            willChange: "opacity, transform",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              height: "1px",
              background: "var(--scene-border)",
              maxWidth: "240px",
              margin: "0 auto clamp(1.5rem, 3vw, 2rem)",
              opacity: 0.5,
            }}
          />

          <span
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.65rem, 1.4vw, 0.75rem)",
              color: "var(--scene-muted)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0.6,
              display: "block",
            }}
          >
            © 2026 JuanFe — fin de la película
          </span>
        </div>

        {/* Back to top button */}
        <div style={{ marginTop: "1rem" }}>
          <button
            ref={topBtnRef}
            onClick={scrollToTop}
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "clamp(0.65rem, 1.4vw, 0.75rem)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: "transparent",
              color: "var(--scene-accent)",
              border: "1px solid var(--scene-accent)",
              padding: "0.5rem 1.25rem",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            aria-label="Volver al inicio del relato"
          >
            ↑ Rebobinar relato
          </button>
        </div>
      </div>
    </section>
  );
}
