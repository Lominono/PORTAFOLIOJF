"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Map each scene section's data-scene-id to the CSS scene token and the sound to play
const SCENE_MAP: Array<{ id: string; scene: string; sound?: string }> = [
  { id: "opening",    scene: "scene-opening",    sound: "shutter" },
  { id: "ticket",     scene: "scene-ticket",     sound: "thermal" },
  { id: "brutalism",  scene: "scene-brutalism",  sound: "stamp" },
  { id: "terminal",   scene: "scene-terminal",   sound: "crt" },
  { id: "vhs",        scene: "scene-vhs",        sound: "static" },
  { id: "zine",       scene: "scene-zine",       sound: "paper-tear" },
  { id: "jazz",       scene: "scene-jazz",       sound: "jazz" },
  { id: "obsessions", scene: "scene-obsessions", sound: "polaroid" },
  { id: "credits",    scene: "scene-credits",    sound: "shutter" },
];

function setScene(scene: string, sound?: string) {
  document.documentElement.dataset.scene = scene;
  if (sound) {
    const am = (window as unknown as Record<string, unknown>).audioManager as
      { play: (s: string) => void } | undefined;
    am?.play(sound);
  }
}

export default function ScrollOrchestrator() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial scene
    setScene("scene-opening");

    const triggers: ScrollTrigger[] = [];

    // Scene detection: fire when section crosses 40% from top
    SCENE_MAP.forEach(({ id, scene, sound }) => {
      const el = document.querySelector(`[data-scene-id="${id}"]`);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => setScene(scene, sound),
        onEnterBack: () => setScene(scene),
      });
      triggers.push(st);
    });

    // Scroll progress bar
    if (progressBarRef.current) {
      const st = ScrollTrigger.create({
        start: "top top",
        end: "bottom bottom",
        scrub: 0,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            progressBarRef.current.style.width = "100%";
          }
        },
      });
      triggers.push(st);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={progressBarRef}
      className="scroll-progress"
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ width: "100%", transform: "scaleX(0)" }}
    />
  );
}
