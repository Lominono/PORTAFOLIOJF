"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { audioManager } from "./AudioManager";

interface SceneInfo {
  id: string;
  num: string;
  title: string;
  reel: string;
  sound: "shutter" | "thermal" | "stamp" | "crt" | "static" | "paper-tear" | "jazz" | "polaroid";
}

const SCENE_METADATA: Record<string, SceneInfo> = {
  "scene-opening":    { id: "opening",    num: "00", title: "APERTURA",        reel: "35MM · RAW",       sound: "shutter" },
  "scene-ticket":     { id: "ticket",     num: "01", title: "AHORA · SANTANDER",reel: "BOBINA TÉRMICA",   sound: "thermal" },
  "scene-brutalism":  { id: "brutalism",  num: "02", title: "DECLARACIÓN",      reel: "TIPOGRAFÍA CRUDA", sound: "stamp" },
  "scene-terminal":   { id: "terminal",   num: "03", title: "TRABAJO & CÓDIGO", reel: "TTY · LINUX ARCH", sound: "crt" },
  "scene-vhs":        { id: "vhs",        num: "04", title: "EL SALTO",         reel: "CINTA MAGNÉTICA",  sound: "static" },
  "scene-zine":       { id: "zine",       num: "05", title: "ORIGEN · GINEBRA", reel: "FANZINE ANALÓGICO", sound: "paper-tear" },
  "scene-jazz":       { id: "jazz",       num: "06", title: "EL RITMO",         reel: "MODAL · NOCHES",   sound: "jazz" },
  "scene-obsessions": { id: "obsessions", num: "07", title: "FUERA DEL CÓDIGO", reel: "BITÁCORA PERSONAL",sound: "polaroid" },
  "scene-credits":    { id: "credits",    num: "08", title: "FIN DE RELATO",    reel: "CRÉDITOS FINALES", sound: "shutter" },
};

export default function ThemeTransitionWipe() {
  const [activeTransition, setActiveTransition] = useState<SceneInfo | null>(null);
  const currentSceneRef = useRef<string>("");
  const isInitialMount = useRef(true);
  const isAligningRef = useRef(false);

  useEffect(() => {
    // Record initial scene without transition
    const initial = document.documentElement.dataset.scene || "scene-opening";
    currentSceneRef.current = initial;

    const observer = new MutationObserver(() => {
      const nextScene = document.documentElement.dataset.scene || "scene-opening";
      if (nextScene === currentSceneRef.current) return;

      currentSceneRef.current = nextScene;

      // Skip on very first load before user scroll
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      // Check reduced motion preference
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const meta = SCENE_METADATA[nextScene] || {
        id: nextScene.replace("scene-", ""),
        num: "--",
        title: nextScene.replace("scene-", "").toUpperCase(),
        reel: "35MM",
        sound: "shutter",
      };

      setActiveTransition(meta);
      audioManager.play(meta.sound);

      // CUT/SNAP VIEWPORT AT APEX:
      // While the shutter blades are 100% closed (around 200ms),
      // align the viewport to the target scene so that when the shutter opens,
      // ONLY the new scene is visible, and the scene above is completely hidden!
      const alignTimer = setTimeout(() => {
        const targetEl = document.querySelector(`[data-scene-id="${meta.id}"]`);
        if (targetEl && !isAligningRef.current) {
          isAligningRef.current = true;
          const rect = targetEl.getBoundingClientRect();
          if (Math.abs(rect.top) > 5) {
            window.scrollTo({
              top: window.scrollY + rect.top,
              behavior: "instant",
            });
          }
          setTimeout(() => {
            isAligningRef.current = false;
          }, 350);
        }
      }, 200);

      const closeTimer = setTimeout(() => {
        setActiveTransition(null);
      }, 480);

      return () => {
        clearTimeout(alignTimer);
        clearTimeout(closeTimer);
      };
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-scene"],
    });

    return () => observer.disconnect();
  }, []);

  if (!activeTransition) return null;

  return (
    <AnimatePresence>
      <div
        className="shutter-curtain"
        aria-hidden="true"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      >
        {/* Top Shutter Blade — Fluid mechanical curtain */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 1, 0] }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.46,
            times: [0, 0.38, 0.62, 1],
            ease: [0.65, 0, 0.35, 1],
          }}
          className="shutter-blade-top"
          style={{
            background: "#08080A",
            borderBottom: "1.5px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.9)",
          }}
        />

        {/* Bottom Shutter Blade — Fluid mechanical curtain */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 1, 0] }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.46,
            times: [0, 0.38, 0.62, 1],
            ease: [0.65, 0, 0.35, 1],
          }}
          className="shutter-blade-bottom"
          style={{
            background: "#08080A",
            borderTop: "1.5px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.9)",
          }}
        />

        {/* 35mm Sprocket hole side tracks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: 0.46, times: [0, 0.3, 0.7, 1] }}
          className="film-sprocket-track left-3 sm:left-6"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="sprocket-hole" />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: 0.46, times: [0, 0.3, 0.7, 1] }}
          className="film-sprocket-track right-3 sm:right-6"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="sprocket-hole" />
          ))}
        </motion.div>

        {/* Center Film Slate Readout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1, 1, 1.02] }}
          transition={{
            duration: 0.46,
            times: [0, 0.35, 0.65, 1],
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-[#0D0C0F] border border-white/25 px-5 sm:px-7 py-3 shadow-2xl flex items-center gap-3 sm:gap-5 text-[#F0EBF4] font-mono select-none">
            <span className="text-[#DE9F43] font-bold text-xs sm:text-sm tracking-widest">
              ESCENA {activeTransition.num}
            </span>
            <span className="text-white/25 text-xs">/</span>
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold">
              {activeTransition.title}
            </span>
            <span className="text-white/25 text-xs hidden sm:inline">|</span>
            <span className="text-[10px] sm:text-xs text-white/50 tracking-widest hidden sm:inline">
              {activeTransition.reel}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
