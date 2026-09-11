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

  const goTo = (id: string) => {
    const idx = SCENES.findIndex((s) => s.id === id);
    if (idx !== -1) {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = (idx / (SCENES.length - 1)) * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Escenas del portfolio"
      style={{
        position: "fixed",
        bottom: "clamp(1.25rem, 4vw, 2rem)",
        left: "50%",
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        gap: "clamp(0.35rem, 1.2vw, 0.6rem)",
        padding: "0.5rem clamp(0.8rem, 2vw, 1.1rem)",
        background: "var(--scene-hud-bg)",
        border: "1px solid var(--scene-border)",
        borderRadius: "9999px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)`,
        transition: "opacity 0.5s ease, transform 0.5s ease, background 0.85s cubic-bezier(0.16,1,0.3,1), border-color 0.85s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {SCENES.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => goTo(id)}
            aria-label={`Ir a escena ${label}`}
            aria-current={isActive ? "true" : undefined}
            title={label}
            style={{
              width: isActive ? "clamp(20px, 4vw, 28px)" : "clamp(5px, 1.2vw, 7px)",
              height: "clamp(5px, 1.2vw, 7px)",
              borderRadius: "9999px",
              background: isActive ? "var(--scene-accent)" : "var(--scene-muted)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              opacity: isActive ? 1 : 0.5,
              transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.85s ease, opacity 0.3s ease",
              flexShrink: 0,
            }}
          />
        );
      })}
    </nav>
  );
}

