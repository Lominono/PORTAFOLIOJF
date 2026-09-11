"use client";

import React, { useEffect, useRef, useCallback } from "react";
import OpeningScene from "@/components/OpeningScene";
import ReceiptScene from "@/components/ReceiptScene";
import BrutalismScene from "@/components/BrutalismScene";
import TerminalScene from "@/components/TerminalScene";
import VHSScene from "@/components/VHSScene";
import ZineScene from "@/components/ZineScene";
import JazzScene from "@/components/JazzScene";
import ObsessionsScene from "@/components/ObsessionsScene";
import CreditsScene from "@/components/CreditsScene";
import { audioManager } from "@/components/AudioManager";

export interface SceneConfig {
  id: string;
  sceneToken: string;
  num: string;
  title: string;
  reel: string;
  sound: "shutter" | "thermal" | "stamp" | "crt" | "static" | "paper-tear" | "jazz" | "polaroid";
  bg: string;
  Component: React.ComponentType;
}

export const SCENES: SceneConfig[] = [
  { id: "opening",    sceneToken: "scene-opening",    num: "00", title: "APERTURA",          reel: "35MM · RAW",        sound: "shutter",    bg: "#000000", Component: OpeningScene },
  { id: "ticket",     sceneToken: "scene-ticket",     num: "01", title: "AHORA · SANTANDER", reel: "BOBINA TÉRMICA",    sound: "thermal",    bg: "#F3EFE6", Component: ReceiptScene },
  { id: "brutalism",  sceneToken: "scene-brutalism",  num: "02", title: "DECLARACIÓN",       reel: "TIPOGRAFÍA CRUDA",  sound: "stamp",      bg: "#F7F7F7", Component: BrutalismScene },
  { id: "terminal",   sceneToken: "scene-terminal",   num: "03", title: "TRABAJO & CÓDIGO",  reel: "TTY · LINUX ARCH",  sound: "crt",        bg: "#0A0E17", Component: TerminalScene },
  { id: "vhs",        sceneToken: "scene-vhs",        num: "04", title: "EL SALTO",          reel: "CINTA MAGNÉTICA",   sound: "static",     bg: "#0D0C0F", Component: VHSScene },
  { id: "zine",       sceneToken: "scene-zine",       num: "05", title: "ORIGEN · GINEBRA",  reel: "FANZINE ANALÓGICO", sound: "paper-tear", bg: "#E8DFC8", Component: ZineScene },
  { id: "jazz",       sceneToken: "scene-jazz",       num: "06", title: "EL RITMO",          reel: "MODAL · NOCHES",    sound: "jazz",       bg: "#0C101C", Component: JazzScene },
  { id: "obsessions", sceneToken: "scene-obsessions", num: "07", title: "FUERA DEL CÓDIGO",  reel: "BITÁCORA PERSONAL", sound: "polaroid",   bg: "#F9F6F0", Component: ObsessionsScene },
  { id: "credits",    sceneToken: "scene-credits",    num: "08", title: "FIN DE RELATO",     reel: "CRÉDITOS FINALES",  sound: "shutter",    bg: "#000000", Component: CreditsScene },
];

// Scroll budget per scene (in vh)
// 40% focused reading hold, 60% silky-smooth solid deck curtain slide
const SLICE_VH = 165;
const HOLD_THRESHOLD = 0.35;

// Perlin's smootherstep curve: zero 1st & 2nd derivative at both endpoints.
// Completely eliminates sudden acceleration or deceleration jerk.
function smootherStep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (6 * c - 15) + 10);
}

// Extra-smooth S-curve: smootherstep applied twice for ultra-premium feel
function ultraSmooth(t: number): number {
  return smootherStep(smootherStep(t));
}

export default function CinematicDeck() {
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const dimmersRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeSceneRef = useRef(0);
  const soundLockRef = useRef(false);

  const switchSceneToken = useCallback((newIdx: number) => {
    if (newIdx === activeSceneRef.current) return;
    activeSceneRef.current = newIdx;
    const target = SCENES[newIdx];
    document.documentElement.dataset.scene = target.sceneToken;

    if (!soundLockRef.current) {
      soundLockRef.current = true;
      audioManager.play(target.sound);
      setTimeout(() => {
        soundLockRef.current = false;
      }, 350);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.scene = SCENES[0].sceneToken;
    activeSceneRef.current = 0;

    const updateStage = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const slicePx = vh * (SLICE_VH / 100);
      const totalScenes = SCENES.length;

      const rawIndex = scrollY / slicePx;
      const clampedIndex = Math.max(0, Math.min(totalScenes - 1, Math.floor(rawIndex)));
      const localProgress = (scrollY - clampedIndex * slicePx) / slicePx;

      let isTransitioning = false;
      let rawT = 0; // 0 to 1

      if (clampedIndex < totalScenes - 1) {
        if (localProgress >= HOLD_THRESHOLD) {
          isTransitioning = true;
          rawT = Math.min(1, Math.max(0, (localProgress - HOLD_THRESHOLD) / (1 - HOLD_THRESHOLD)));
        }
      }

      // Ultra-smooth double-eased progress
      const eased = ultraSmooth(rawT);

      // Dominant scene determination for HUD, audio & color theme
      const dominantIndex = isTransitioning && eased >= 0.5 ? clampedIndex + 1 : clampedIndex;
      switchSceneToken(dominantIndex);

      // Apply ultra-smooth GPU styles to scene wrappers
      for (let i = 0; i < totalScenes; i++) {
        const wrapper = wrappersRef.current[i];
        const dimmer = dimmersRef.current[i];
        if (!wrapper) continue;

        if (i === clampedIndex) {
          // Current / Outgoing Scene
          wrapper.style.visibility = "visible";
          wrapper.style.zIndex = "10";
          wrapper.style.opacity = "1";
          wrapper.style.boxShadow = "none";
          wrapper.style.pointerEvents = isTransitioning && eased > 0.45 ? "none" : "auto";

          if (isTransitioning) {
            // Cinematic receding depth: subtle upward drift, gentle scale, optical dimmer
            const shiftY = -(eased * 18).toFixed(2);
            const scale = (1 - eased * 0.04).toFixed(3);

            wrapper.style.transform = `translate3d(0, ${shiftY}%, 0) scale(${scale})`;
            if (dimmer) dimmer.style.opacity = (eased * 0.35).toFixed(3);
          } else {
            wrapper.style.transform = "translate3d(0, 0%, 0) scale(1)";
            if (dimmer) dimmer.style.opacity = "0";
          }
        } else if (i === clampedIndex + 1 && isTransitioning) {
          // Incoming Scene: Solid card curtain sweeping smoothly over the previous scene
          wrapper.style.visibility = "visible";
          wrapper.style.zIndex = "20";
          wrapper.style.opacity = "1";
          wrapper.style.pointerEvents = eased >= 0.45 ? "auto" : "none";

          const slideY = ((1 - eased) * 100).toFixed(2);
          wrapper.style.transform = `translate3d(0, ${slideY}%, 0)`;
          wrapper.style.boxShadow = "0 -22px 60px rgba(0, 0, 0, 0.32)";
          if (dimmer) dimmer.style.opacity = "0";
        } else {
          // All other scenes are completely hidden & isolated
          wrapper.style.visibility = "hidden";
          wrapper.style.zIndex = "1";
          wrapper.style.opacity = "0";
          wrapper.style.boxShadow = "none";
          wrapper.style.pointerEvents = "none";
          wrapper.style.transform = i < clampedIndex ? "translate3d(0, -18%, 0) scale(0.96)" : "translate3d(0, 100%, 0)";
          if (dimmer) dimmer.style.opacity = "0";
        }
      }
    };

    let rafId: number | null = null;
    let scheduled = false;

    const requestUpdate = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(() => {
        scheduled = false;
        updateStage();
      });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    // Synchronize directly with Lenis scroll event
    const lenisObj = (window as unknown as { lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).lenis;
    if (lenisObj?.on) {
      lenisObj.on("scroll", requestUpdate);
    }

    // Run initial frame
    updateStage();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (lenisObj?.off) {
        lenisObj.off("scroll", requestUpdate);
      }
    };
  }, [switchSceneToken]);

  return (
    <>
      {/* 
        FIXED VIEWPORT STAGE:
        Isolates scenes completely in full screen.
        Each scene is an opaque, crisp layer with its own solid background.
        Transitions sweep cleanly like high-end editorial cards with zero ghosting.
      */}
      <div
        className="fixed inset-0 w-screen h-[100dvh] overflow-hidden"
        style={{ zIndex: 1 }}
        aria-live="polite"
      >
        {SCENES.map((scene, idx) => {
          const Component = scene.Component;
          return (
            <div
              key={scene.id}
              ref={(el) => {
                wrappersRef.current[idx] = el;
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                visibility: idx === 0 ? "visible" : "hidden",
                transform: idx === 0 ? "translate3d(0, 0%, 0) scale(1)" : "translate3d(0, 100%, 0)",
                zIndex: idx === 0 ? 10 : 1,
                backgroundColor: scene.bg,
                willChange: "transform",
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
                contain: "layout style paint",
              }}
              data-lenis-prevent="true"
            >
              {/* Optical depth dimmer on receding scene */}
              <div
                ref={(el) => {
                  dimmersRef.current[idx] = el;
                }}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  backgroundColor: "#000000",
                  opacity: 0,
                  zIndex: 40,
                  transition: "opacity 0.05s linear",
                }}
              />
              <Component />
            </div>
          );
        })}
      </div>

      {/* 
        SCROLL DRIVER TRACK:
        Provides normal document scroll distance and anchors for MuseumNav dots.
      */}
      <div
        className="relative w-full pointer-events-none"
        style={{ height: `${SCENES.length * SLICE_VH}vh` }}
        aria-hidden="true"
      >
        {SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            data-scene-id={scene.id}
            style={{
              position: "absolute",
              top: `${idx * SLICE_VH}vh`,
              left: 0,
              width: "100%",
              height: `${SLICE_VH}vh`,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </>
  );
}
