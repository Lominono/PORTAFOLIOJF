"use client";

import { useState, useEffect } from "react";
import { audioManager } from "./AudioManager";

const SCENE_LABELS: Record<string, string> = {
  "scene-opening":    "00 · APERTURA",
  "scene-ticket":     "01 · AHORA",
  "scene-brutalism":  "02 · DECLARACIÓN",
  "scene-terminal":   "03 · TRABAJO",
  "scene-vhs":        "04 · EL SALTO",
  "scene-zine":       "05 · ORIGEN",
  "scene-jazz":       "06 · EL OÍDO",
  "scene-obsessions": "07 · PERSONAL",
  "scene-credits":    "08 · FIN",
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
      setTimeout(() => setMorphing(false), 240);
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
        transform: visible ? "translateY(0)" : "translateY(-6px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
      aria-label="Navegación de escenas y audio"
    >
      {/* Scene indicator - ultra-minimal */}
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          opacity: morphing ? 0.3 : 0.88,
          transform: morphing ? "translateY(-1px) scale(0.98)" : "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          fontWeight: 600,
        }}
      >
        {SCENE_LABELS[scene] ?? scene}
      </span>

      {/* Divider */}
      <span style={{ opacity: 0.25, fontSize: "0.6rem" }} aria-hidden="true">|</span>

      {/* Acoustic Equalizer & Mute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Activar música y audio" : "Silenciar música"}
        title={muted ? "Música silenciada (clic para activar)" : "Música sonando al 67% (clic para silenciar)"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "2px 4px",
          color: "var(--scene-fg)",
        }}
      >
        {/* Animated equalizer waves */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "flex-end",
            gap: "2px",
            height: "10px",
          }}
          aria-hidden="true"
        >
          <span
            style={{
              width: "2px",
              height: muted ? "3px" : "10px",
              background: "var(--scene-accent)",
              borderRadius: "1px",
              transition: "height 0.2s ease, opacity 0.2s ease",
              opacity: muted ? 0.35 : 0.9,
              animation: muted ? "none" : "crtPulse 1.2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              width: "2px",
              height: muted ? "3px" : "6px",
              background: "var(--scene-accent)",
              borderRadius: "1px",
              transition: "height 0.2s ease, opacity 0.2s ease",
              opacity: muted ? 0.35 : 0.85,
              animation: muted ? "none" : "crtPulse 0.9s ease-in-out infinite alternate",
            }}
          />
          <span
            style={{
              width: "2px",
              height: muted ? "3px" : "8px",
              background: "var(--scene-accent)",
              borderRadius: "1px",
              transition: "height 0.2s ease, opacity 0.2s ease",
              opacity: muted ? 0.35 : 0.9,
              animation: muted ? "none" : "crtPulse 1.5s ease-in-out infinite alternate",
            }}
          />
        </span>

        <span
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.08em",
            opacity: muted ? 0.45 : 0.85,
            textTransform: "uppercase",
          }}
        >
          {muted ? "MUTE" : "AUDIO"}
        </span>
      </button>
    </div>
  );
}
