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
  Component: React.ComponentType;
}

export const SCENES: SceneConfig[] = [
  { id: "opening",    sceneToken: "scene-opening",    num: "00", title: "APERTURA",          reel: "35MM · RAW",        sound: "shutter",    Component: OpeningScene },
  { id: "ticket",     sceneToken: "scene-ticket",     num: "01", title: "AHORA · SANTANDER", reel: "BOBINA TÉRMICA",    sound: "thermal",    Component: ReceiptScene },
  { id: "brutalism",  sceneToken: "scene-brutalism",  num: "02", title: "DECLARACIÓN",       reel: "TIPOGRAFÍA CRUDA",  sound: "stamp",      Component: BrutalismScene },
  { id: "terminal",   sceneToken: "scene-terminal",   num: "03", title: "TRABAJO & CÓDIGO",  reel: "TTY · LINUX ARCH",  sound: "crt",        Component: TerminalScene },
  { id: "vhs",        sceneToken: "scene-vhs",        num: "04", title: "EL SALTO",          reel: "CINTA MAGNÉTICA",   sound: "static",     Component: VHSScene },
  { id: "zine",       sceneToken: "scene-zine",       num: "05", title: "ORIGEN · GINEBRA",  reel: "FANZINE ANALÓGICO", sound: "paper-tear", Component: ZineScene },
  { id: "jazz",       sceneToken: "scene-jazz",       num: "06", title: "EL RITMO",          reel: "MODAL · NOCHES",    sound: "jazz",       Component: JazzScene },
  { id: "obsessions", sceneToken: "scene-obsessions", num: "07", title: "FUERA DEL CÓDIGO",  reel: "BITÁCORA PERSONAL", sound: "polaroid",   Component: ObsessionsScene },
  { id: "credits",    sceneToken: "scene-credits",    num: "08", title: "FIN DE RELATO",     reel: "CRÉDITOS FINALES",  sound: "shutter",    Component: CreditsScene },
];

// Scroll budget per scene (in vh)
// 38% focused reading, 62% silky smooth cinematic depth dissolve
const SLICE_VH = 165;
const HOLD_THRESHOLD = 0.38;

// Perlin's smootherstep curve: zero 1st & 2nd derivative at both endpoints.
// Completely eliminates sudden acceleration or deceleration jerk.
function smootherStep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (6 * c - 15) + 10);
}

export default function CinematicDeck() {
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
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
      }, 260);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.scene = SCENES[0].sceneToken;

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

      // Ultra-smooth eased progress with Perlin smootherstep
      const eased = smootherStep(rawT);

      // Dominant scene determination for HUD, audio & color theme
      const dominantIndex = isTransitioning && eased >= 0.5 ? clampedIndex + 1 : clampedIndex;
      switchSceneToken(dominantIndex);

      // Apply ultra-smooth GPU styles to scene wrappers
      for (let i = 0; i < totalScenes; i++) {
        const wrapper = wrappersRef.current[i];
        if (!wrapper) continue;

        if (i === clampedIndex) {
          // Current scene
          wrapper.style.visibility = "visible";
          wrapper.style.zIndex = "10";
          wrapper.style.pointerEvents = isTransitioning && eased > 0.4 ? "none" : "auto";

          if (isTransitioning) {
            // Ethereal retreat: gentle upward drift, slight scale, smooth dissolve & optical depth
            const shiftY = -(eased * 14).toFixed(2);
            const scale = (1 - eased * 0.04).toFixed(3);
            const opacity = (1 - eased).toFixed(3);
            const blurPx = (eased * 3).toFixed(1);

            wrapper.style.transform = `translate3d(0, ${shiftY}%, 0) scale(${scale})`;
            wrapper.style.opacity = opacity;
            wrapper.style.filter = blurPx === "0.0" ? "none" : `blur(${blurPx}px)`;
          } else {
            wrapper.style.transform = "translate3d(0, 0%, 0) scale(1)";
            wrapper.style.opacity = "1";
            wrapper.style.filter = "none";
          }
        } else if (i === clampedIndex + 1 && isTransitioning) {
          // Incoming scene gliding softly into focus with ethereal dissolve
          wrapper.style.visibility = "visible";
          wrapper.style.zIndex = "20";
          wrapper.style.pointerEvents = eased >= 0.4 ? "auto" : "none";

          const slideY = ((1 - eased) * 16).toFixed(2);
          const scale = (0.96 + eased * 0.04).toFixed(3);
          const opacity = eased.toFixed(3);
          const blurPx = ((1 - eased) * 3).toFixed(1);

          wrapper.style.transform = `translate3d(0, ${slideY}%, 0) scale(${scale})`;
          wrapper.style.opacity = opacity;
          wrapper.style.filter = blurPx === "0.0" ? "none" : `blur(${blurPx}px)`;
        } else {
          // All other scenes are completely hidden: 100% isolated
          wrapper.style.visibility = "hidden";
          wrapper.style.zIndex = "1";
          wrapper.style.pointerEvents = "none";
          wrapper.style.transform = i < clampedIndex ? "translate3d(0, -14%, 0)" : "translate3d(0, 16%, 0)";
          wrapper.style.opacity = "0";
          wrapper.style.filter = "none";
        }
      }
    };

    window.addEventListener("scroll", updateStage, { passive: true });
    window.addEventListener("resize", updateStage, { passive: true });

    // Synchronize directly with Lenis ticker if present
    const lenisObj = (window as unknown as { lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).lenis;
    if (lenisObj?.on) {
      lenisObj.on("scroll", updateStage);
    }

    updateStage();

    return () => {
      window.removeEventListener("scroll", updateStage);
      window.removeEventListener("resize", updateStage);
      if (lenisObj?.off) {
        lenisObj.off("scroll", updateStage);
      }
    };
  }, [switchSceneToken]);

  return (
    <>
      {/* 
        FIXED VIEWPORT STAGE:
        Isolates scenes completely in full screen.
        Only the active scene (and the incoming card during transition) are visible.
        All lower and previous scenes are set to visibility: hidden.
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
                transform: idx === 0 ? "translate3d(0, 0%, 0) scale(1)" : "translate3d(0, 16%, 0) scale(0.96)",
                zIndex: idx === 0 ? 10 : 1,
                backgroundColor: "var(--scene-bg, #080808)",
                willChange: "transform, opacity, filter",
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
              }}
              data-lenis-prevent="true"
            >
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
