"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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

interface SceneConfig {
  id: string;
  sceneToken: string;
  num: string;
  title: string;
  reel: string;
  sound: "shutter" | "thermal" | "stamp" | "crt" | "static" | "paper-tear" | "jazz" | "polaroid";
  Component: React.ComponentType;
}

export const SCENES: SceneConfig[] = [
  { id: "opening",    sceneToken: "scene-opening",    num: "00", title: "APERTURA",        reel: "35MM · RAW",       sound: "shutter",    Component: OpeningScene },
  { id: "ticket",     sceneToken: "scene-ticket",     num: "01", title: "AHORA · SANTANDER",reel: "BOBINA TÉRMICA",   sound: "thermal",    Component: ReceiptScene },
  { id: "brutalism",  sceneToken: "scene-brutalism",  num: "02", title: "DECLARACIÓN",      reel: "TIPOGRAFÍA CRUDA", sound: "stamp",      Component: BrutalismScene },
  { id: "terminal",   sceneToken: "scene-terminal",   num: "03", title: "TRABAJO & CÓDIGO", reel: "TTY · LINUX ARCH", sound: "crt",        Component: TerminalScene },
  { id: "vhs",        sceneToken: "scene-vhs",        num: "04", title: "EL SALTO",         reel: "CINTA MAGNÉTICA",  sound: "static",     Component: VHSScene },
  { id: "zine",       sceneToken: "scene-zine",       num: "05", title: "ORIGEN · GINEBRA", reel: "FANZINE ANALÓGICO", sound: "paper-tear",Component: ZineScene },
  { id: "jazz",       sceneToken: "scene-jazz",       num: "06", title: "EL RITMO",         reel: "MODAL · NOCHES",   sound: "jazz",       Component: JazzScene },
  { id: "obsessions", sceneToken: "scene-obsessions", num: "07", title: "FUERA DEL CÓDIGO", reel: "BITÁCORA PERSONAL",sound: "polaroid",  Component: ObsessionsScene },
  { id: "credits",    sceneToken: "scene-credits",    num: "08", title: "FIN DE RELATO",    reel: "CRÉDITOS FINALES", sound: "shutter",    Component: CreditsScene },
];

export default function CinematicDeck() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [shutterProgress, setShutterProgress] = useState(0); // 0 = open, 1 = fully closed
  const [transitionMeta, setTransitionMeta] = useState(SCENES[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveIdx = useRef(0);
  const isPlayingSound = useRef(false);

  // Update scene token on <html> and play sound on cut
  const triggerSceneCut = useCallback((newIdx: number) => {
    if (newIdx === lastActiveIdx.current) return;
    lastActiveIdx.current = newIdx;
    setActiveIdx(newIdx);

    const target = SCENES[newIdx];
    document.documentElement.dataset.scene = target.sceneToken;

    if (!isPlayingSound.current) {
      isPlayingSound.current = true;
      audioManager.play(target.sound);
      setTimeout(() => {
        isPlayingSound.current = false;
      }, 200);
    }
  }, []);

  useEffect(() => {
    // Initial scene token
    document.documentElement.dataset.scene = SCENES[0].sceneToken;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollY = window.scrollY;
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / totalScrollable));
      const totalTransitions = SCENES.length - 1;
      const scaled = progress * totalTransitions;
      const baseIdx = Math.min(totalTransitions - 1, Math.floor(scaled));
      const fraction = scaled - baseIdx; // 0 to 1 between baseIdx and baseIdx + 1

      // Transition window: fraction between 0.20 and 0.80
      // 0.00 -> 0.20: Plateau on baseIdx (shutterProgress = 0)
      // 0.20 -> 0.45: Shutter closing over baseIdx (shutterProgress 0 -> 1)
      // 0.45 -> 0.55: Buffer 100% closed! Screen is totally black. Scene swaps at 0.50 in pitch darkness!
      // 0.55 -> 0.80: Shutter opening over baseIdx + 1 (shutterProgress 1 -> 0)
      // 0.80 -> 1.00: Plateau on baseIdx + 1 (shutterProgress = 0)

      const CLOSE_START = 0.20;
      const CLOSED_IN = 0.45;
      const SWAP_MID = 0.50;
      const CLOSED_OUT = 0.55;
      const OPEN_END = 0.80;

      if (fraction <= CLOSE_START) {
        // Firmly in baseIdx
        setShutterProgress(0);
        triggerSceneCut(baseIdx);
      } else if (fraction >= OPEN_END) {
        // Firmly in baseIdx + 1
        setShutterProgress(0);
        triggerSceneCut(baseIdx + 1);
      } else if (fraction >= CLOSED_IN && fraction <= CLOSED_OUT) {
        // 100% pitch-black shutter buffer! Neither scene is visible to the user!
        setShutterProgress(1);
        setTransitionMeta(SCENES[baseIdx + 1]);
        if (fraction >= SWAP_MID) {
          triggerSceneCut(baseIdx + 1);
        } else {
          triggerSceneCut(baseIdx);
        }
      } else if (fraction > CLOSE_START && fraction < CLOSED_IN) {
        // Closing phase
        const closeProg = (fraction - CLOSE_START) / (CLOSED_IN - CLOSE_START);
        setShutterProgress(closeProg);
        setTransitionMeta(SCENES[baseIdx + 1]);
        triggerSceneCut(baseIdx);
      } else {
        // Opening phase
        const openProg = (OPEN_END - fraction) / (OPEN_END - CLOSED_OUT);
        setShutterProgress(openProg);
        setTransitionMeta(SCENES[baseIdx + 1]);
        triggerSceneCut(baseIdx + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [triggerSceneCut]);

  return (
    <div
      ref={containerRef}
      style={{
        // 8 transitions * 100vh = 800vh of smooth scrub scroll distance
        height: `${SCENES.length * 100}vh`,
        position: "relative",
      }}
    >
      {/* Pinned Viewport Stage — 100vw x 100vh locked to screen */}
      <div
        className="fixed inset-0 w-full h-full overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {/* Render each scene as an isolated full-screen layer */}
        {SCENES.map((scene, idx) => {
          const isCurrent = activeIdx === idx;
          const Component = scene.Component;

          return (
            <div
              key={scene.id}
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{
                display: isCurrent ? "block" : "none",
                opacity: isCurrent ? 1 : 0,
                visibility: isCurrent ? "visible" : "hidden",
                pointerEvents: isCurrent ? "auto" : "none",
                zIndex: isCurrent ? 10 : 0,
              }}
              data-scene-id={scene.id}
            >
              <Component />
            </div>
          );
        })}

        {/* Scroll-Driven Film Shutter Curtain Wipe */}
        <div
          className="shutter-curtain"
          style={{
            display: shutterProgress > 0.005 ? "block" : "none",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          aria-hidden="true"
        >
          {/* Top Shutter Blade */}
          <div
            className="shutter-blade-top"
            style={{
              transform: `scaleY(${shutterProgress})`,
              transformOrigin: "top",
              height: "52%",
              transition: "none", // 100% driven by scroll
              background: "#08080A",
              borderBottom: "2px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.95)",
            }}
          />

          {/* Bottom Shutter Blade */}
          <div
            className="shutter-blade-bottom"
            style={{
              transform: `scaleY(${shutterProgress})`,
              transformOrigin: "bottom",
              height: "52%",
              transition: "none", // 100% driven by scroll
              background: "#08080A",
              borderTop: "2px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 -12px 36px rgba(0, 0, 0, 0.95)",
            }}
          />

          {/* 35mm Sprocket Tracks */}
          <div
            className="film-sprocket-track left-3 sm:left-6"
            style={{
              opacity: Math.min(1, shutterProgress * 1.5),
              zIndex: 10000,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="sprocket-hole" />
            ))}
          </div>

          <div
            className="film-sprocket-track right-3 sm:right-6"
            style={{
              opacity: Math.min(1, shutterProgress * 1.5),
              zIndex: 10000,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="sprocket-hole" />
            ))}
          </div>

          {/* Center Film Slate Display — Visible when shutter is nearly closed */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: shutterProgress > 0.5 ? Math.min(1, (shutterProgress - 0.5) / 0.35) : 0,
              transform: `scale(${0.92 + shutterProgress * 0.08})`,
              zIndex: 10001,
            }}
          >
            <div className="bg-[#0D0C0F] border border-white/25 px-5 sm:px-7 py-3 shadow-2xl flex items-center gap-3 sm:gap-5 text-[#F0EBF4] font-mono select-none">
              <span className="text-[#DE9F43] font-bold text-xs sm:text-sm tracking-widest">
                ESCENA {transitionMeta.num}
              </span>
              <span className="text-white/25 text-xs">/</span>
              <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold">
                {transitionMeta.title}
              </span>
              <span className="text-white/25 text-xs hidden sm:inline">|</span>
              <span className="text-[10px] sm:text-xs text-white/50 tracking-widest hidden sm:inline">
                {transitionMeta.reel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
