"use client";

import { useEffect, useState } from "react";
import { audioManager } from "./AudioManager";

// Navigation dots — 9 scenes, watches html[data-scene] via MutationObserver.
// Click scrolls to [data-scene-id="X"] (native scrollIntoView, smooth).

const SCENES: Array<{ id: string; label: string }> = [
  { id: "opening",    label: "00" },
  { id: "ticket",     label: "01" },
  { id: "brutalism",  label: "02" },
  { id: "terminal",   label: "03" },
  { id: "vhs",        label: "04" },
  { id: "zine",       label: "05" },
  { id: "jazz",       label: "06" },
  { id: "obsessions", label: "07" },
  { id: "credits",    label: "08" },
];

// Map css scene token ? scene id
const TOKEN_TO_ID: Record<string, string> = Object.fromEntries(
  SCENES.map(({ id }) => [`scene-${id}`, id])
);

export default function MuseumNav() {
  const [active, setActive] = useState("opening");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show nav after first scroll
    const show = () => setVisible(true);
    window.addEventListener("scroll", show, { once: true, passive: true });

    // Watch data-scene on <html>
    const observer = new MutationObserver(() => {
      const token = document.documentElement.dataset.scene ?? "scene-opening";
      setActive(TOKEN_TO_ID[token] ?? "opening");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-scene"],
    });

    return () => {
      window.removeEventListener("scroll", show);
      observer.disconnect();
    };
  }, []);

  const goTo = (id: string, index: number) => {
    audioManager.play("keyclick");
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void } }).lenis;
    const vh = window.innerHeight;
    const currentSlice = window.innerWidth <= 768 ? 1.20 : 1.50;
    const targetY = index * vh * currentSlice;
    if (lenis?.scrollTo) {
      lenis.scrollTo(targetY, { duration: 1.0 });
    } else {
      const el = document.querySelector(`[data-scene-id="${id}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Escenas del portfolio"
      style={{
        position: "fixed",
        bottom: "max(0.75rem, calc(env(safe-area-inset-bottom, 0px) + 0.45rem))",
        left: "50%",
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "0.2rem 0.65rem",
        background: "var(--scene-hud-bg)",
        border: "1px solid var(--scene-border)",
        borderRadius: "9999px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 6}px)`,
        transition: "opacity 0.4s ease, transform 0.4s ease, background 0.75s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {SCENES.map(({ id, label }, index) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => goTo(id, index)}
            aria-label={`Ir a escena ${label}`}
            aria-current={isActive ? "true" : undefined}
            title={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              padding: "8px 2.5px",
              cursor: "pointer",
              touchAction: "manipulation",
            }}
          >
            <span
              style={{
                display: "block",
                width: isActive ? "22px" : "6px",
                height: "2px",
                borderRadius: "1px",
                backgroundColor: isActive ? "var(--scene-accent)" : "var(--scene-muted)",
                opacity: isActive ? 1 : 0.35,
                transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s ease, opacity 0.25s ease",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}

