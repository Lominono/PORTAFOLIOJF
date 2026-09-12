"use client";

import { useEffect, useState } from "react";

// Navigation dots � 9 scenes, watches html[data-scene] via MutationObserver.
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
        bottom: "max(0.55rem, calc(env(safe-area-inset-bottom, 0px) + 0.35rem))",
        left: "50%",
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "0.22rem 0.55rem",
        background: "var(--scene-hud-bg)",
        border: "1px solid var(--scene-border)",
        borderRadius: "9999px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 6}px)`,
        transition: "opacity 0.4s ease, transform 0.4s ease, background 0.75s ease, border-color 0.75s ease",
        pointerEvents: visible ? "auto" : "none",
        maxWidth: "calc(100vw - 2rem)",
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
              width: isActive ? "24px" : "9px",
              height: "3px",
              borderRadius: "2px",
              backgroundColor: isActive ? "var(--scene-accent)" : "var(--scene-muted)",
              border: "none",
              padding: "20px 3px",
              minHeight: "44px",
              backgroundClip: "content-box",
              boxSizing: "content-box",
              cursor: "pointer",
              opacity: isActive ? 1 : 0.35,
              transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), background-color 0.65s ease, opacity 0.25s ease",
              flexShrink: 0,
              touchAction: "manipulation",
            }}
          />
        );
      })}
    </nav>
  );
}

