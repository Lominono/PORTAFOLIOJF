"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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

// Scroll distance the user covers during each shutter animation (in vh)
const ZONE_VH = 100;

// Thresholds within each transition zone (0..1 across the zone height)
const CLOSE_START = 0.05;  // shutter starts closing
const CLOSED_IN   = 0.42;  // shutter fully closed
const SWAP_MID    = 0.50;  // scene swap — pitch black
const CLOSED_OUT  = 0.58;  // shutter starts opening
const OPEN_END    = 0.95;  // shutter fully open

export default function CinematicDeck() {
  const [shutterProgress, setShutterProgress] = useState(0);
  const [transitionMeta, setTransitionMeta]   = useState(SCENES[0]);
  const zonesRef   = useRef<(HTMLDivElement | null)[]>([]);
  const lastActive = useRef(0);
  const soundLock  = useRef(false);

  const triggerSceneCut = useCallback((newIdx: number) => {
    if (newIdx === lastActive.current) return;
    lastActive.current = newIdx;
    const target = SCENES[newIdx];
    document.documentElement.dataset.scene = target.sceneToken;
    if (!soundLock.current) {
      soundLock.current = true;
      audioManager.play(target.sound);
      setTimeout(() => { soundLock.current = false; }, 200);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.scene = SCENES[0].sceneToken;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let shutter = 0;
      let meta    = SCENES[lastActive.current];
      let nextIdx = 0;

      for (let i = 0; i < zonesRef.current.length; i++) {
        const zone = zonesRef.current[i];
        if (!zone) continue;

        // Compute absolute document top each tick (handles dynamic layout shifts)
        const zoneAbsTop = scrollY + zone.getBoundingClientRect().top;
        const zoneHeight = zone.offsetHeight;
        // p: 0 when zone-top enters viewport-top, 1 when zone fully scrolled above
        const p = (scrollY - zoneAbsTop) / zoneHeight;

        if (p < 0) {
          // Haven't reached this zone yet — currently in scene i
          nextIdx = i;
          break;
        } else if (p < 1) {
          // Inside this transition zone
          meta = SCENES[i + 1];

          if (p <= CLOSE_START) {
            shutter = 0; nextIdx = i;
          } else if (p >= OPEN_END) {
            shutter = 0; nextIdx = i + 1;
          } else if (p >= CLOSED_IN && p <= CLOSED_OUT) {
            shutter = 1;
            nextIdx = p >= SWAP_MID ? i + 1 : i;
          } else if (p > CLOSE_START && p < CLOSED_IN) {
            shutter = (p - CLOSE_START) / (CLOSED_IN - CLOSE_START);
            nextIdx = i;
          } else {
            // CLOSED_OUT → OPEN_END
            shutter = (OPEN_END - p) / (OPEN_END - CLOSED_OUT);
            nextIdx = i + 1;
          }
          break;
        } else {
          // Fully past this zone — at least in scene i+1
          nextIdx = i + 1;
        }
      }

      setShutterProgress(shutter);
      setTransitionMeta(meta);
      triggerSceneCut(nextIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerSceneCut]);

  return (
    <>
      {/* Scenes in normal document flow — fully scrollable */}
      {SCENES.map((scene, idx) => {
        const Component = scene.Component;
        return (
          <React.Fragment key={scene.id}>
            <div data-scene-id={scene.id}>
              <Component />
            </div>

            {/* Responsive black gap: scroll distance for the shutter animation */}
            {idx < SCENES.length - 1 && (
              <div
                ref={el => { zonesRef.current[idx] = el; }}
                aria-hidden="true"
                style={{
                  height: "clamp(55vh, 75vh, 100vh)",
                  background: "#08080A",
                  position: "relative",
                  pointerEvents: "none",
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Fixed film shutter overlay — only mounted while animating */}
      {shutterProgress > 0.005 && (
        <div
          className="shutter-curtain"
          style={{ pointerEvents: "none", zIndex: 9999 }}
          aria-hidden="true"
        >
          <div
            className="shutter-blade-top"
            style={{
              transform: `scaleY(${shutterProgress})`,
              transformOrigin: "top",
              height: "52%",
              transition: "none",
              background: "#08080A",
              borderBottom: "2px solid rgba(255,255,255,0.25)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.95)",
            }}
          />
          <div
            className="shutter-blade-bottom"
            style={{
              transform: `scaleY(${shutterProgress})`,
              transformOrigin: "bottom",
              height: "52%",
              transition: "none",
              background: "#08080A",
              borderTop: "2px solid rgba(255,255,255,0.25)",
              boxShadow: "0 -12px 36px rgba(0,0,0,0.95)",
            }}
          />

          {/* 35mm sprocket tracks */}
          <div className="film-sprocket-track left-2 sm:left-6" style={{ opacity: Math.min(1, shutterProgress * 1.5) }}>
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="sprocket-hole" />)}
          </div>
          <div className="film-sprocket-track right-2 sm:right-6" style={{ opacity: Math.min(1, shutterProgress * 1.5) }}>
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="sprocket-hole" />)}
          </div>

          {/* Film slate — fades in near full closure */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none px-3"
            style={{
              opacity: shutterProgress > 0.5 ? Math.min(1, (shutterProgress - 0.5) / 0.35) : 0,
              transform: `scale(${0.92 + shutterProgress * 0.08})`,
            }}
          >
            <div className="bg-[#0D0C0F] border border-white/25 px-4 sm:px-7 py-2.5 sm:py-3 shadow-2xl flex items-center gap-2.5 sm:gap-5 text-[#F0EBF4] font-mono select-none max-w-[94vw]">
              <span className="text-[#DE9F43] font-bold text-[11px] sm:text-sm tracking-widest whitespace-nowrap">
                ESCENA {transitionMeta.num}
              </span>
              <span className="text-white/25 text-xs">/</span>
              <span className="text-[11px] sm:text-sm uppercase tracking-[0.14em] sm:tracking-[0.2em] font-semibold truncate">
                {transitionMeta.title}
              </span>
              <span className="text-white/25 text-xs hidden sm:inline">|</span>
              <span className="text-[10px] sm:text-xs text-white/50 tracking-widest hidden sm:inline whitespace-nowrap">
                {transitionMeta.reel}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
