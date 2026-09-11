"use client";

import { useState, useEffect } from "react";
import { audioManager } from "./AudioManager";

const SCENE_LABELS: Record<string, string> = {
  "scene-opening":    "00 — APERTURA",
  "scene-ticket":     "01 — AHORA",
  "scene-brutalism":  "02 — DECLARACIÓN",
  "scene-terminal":   "03 — TRABAJO",
  "scene-vhs":        "04 — EL SALTO",
  "scene-zine":       "05 — ORIGEN",
  "scene-jazz":       "06 — EL OÍDO",
  "scene-obsessions": "07 — FUERA DEL CÓDIGO",
  "scene-credits":    "08 — FIN",
};

export default function SceneHUD() {
  const [muted, setMuted] = useState(false);
  const [scene, setScene] = useState("scene-opening");
  const [visible, setVisible] = useState(false);
  const [morphing, setMorphing] = useState(false);

  useEffect(() => {
    // Show HUD only after first scroll (not on landing)
    const onScroll = () => setVisible(true);
    window.addEventListener("scroll", onScroll, { once: true, passive: true });

    // Watch data-scene attribute on <html>
    const observer = new MutationObserver(() => {
      const current = document.documentElement.dataset.scene ?? "scene-opening";
      setMorphing(true);
      setScene(current);
      setTimeout(() => setMorphing(false), 260);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-scene"],
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const toggleMute = () => {
    const nowMuted = audioManager.toggle();
    setMuted(nowMuted);
  };

  return (
    <div
      className="scene-hud"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, background 0.65s cubic-bezier(0.22,1,0.36,1), border-color 0.65s cubic-bezier(0.22,1,0.36,1), color 0.65s cubic-bezier(0.22,1,0.36,1)",
      }}
      aria-label="Navegación de escenas"
    >
      {/* Scene indicator with mechanical flip feel */}
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          opacity: morphing ? 0.35 : 0.85,
          transform: morphing ? "translateY(-2px) scale(0.97)" : "translateY(0) scale(1)",
          transition: "opacity 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)",
          whiteSpace: "nowrap",
          fontWeight: 600,
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
        }}
      >
        {SCENE_LABELS[scene] ?? scene}
      </span>

      {/* Divider */}
      <span style={{ opacity: 0.3 }} aria-hidden="true">·</span>

      {/* Mute toggle */}
      <button
        className="mute-btn"
        onClick={toggleMute}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        title={muted ? "Activar sonido" : "Silenciar"}
      >
        {muted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        )}
      </button>
    </div>
  );
}
