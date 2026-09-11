"use client";

import { useEffect } from "react";

// Sounds synthesized via Web Audio API — no external audio files needed
// ponytail: Web Audio synthesis over Howler here; avoids network requests + asset management
//           ceiling: limited timbre variety. Upgrade path: swap playSound() per key with a Howl instance.

type SoundKey =
  | "shutter"      // scene-opening: camera click
  | "thermal"      // scene-ticket: thermal printer paper
  | "stamp"        // scene-brutalism: rubber stamp impact
  | "keyclick"     // scene-terminal: typewriter keypress
  | "static"       // scene-vhs: tape static burst
  | "paper-tear"   // scene-zine: paper rip
  | "jazz"         // scene-jazz: warm jazz chord
  | "polaroid"     // scene-obsessions: camera eject
  | "pop"          // stickers: tactile pop
  | "tape-rewind"  // vhs rewind
  | "crt";         // crt screen power on

let ctx: AudioContext | null = null;
let muted = false;
let isDucked = false;
let hasInteracted = false;

// Background ambient music configuration: Fly Me to the Moon (amari)
let bgAudio: HTMLAudioElement | null = null;
let currentBgVolume = 0;
const TARGET_VOLUME = 0.67; // 67% volume as requested
const FADE_DURATION_MS = 20000; // 20-second smooth entrance fade
let fadeStartTime: number | null = null;
let fadeAnimationId: number | null = null;
let bgMusicStarted = false;

function startBgFade() {
  if (fadeStartTime !== null) return;
  fadeStartTime = performance.now();

  const updateFade = (now: number) => {
    if (!fadeStartTime || !bgAudio) return;
    const elapsed = now - fadeStartTime;
    const progress = Math.min(1, elapsed / FADE_DURATION_MS);
    currentBgVolume = progress * TARGET_VOLUME;

    if (!muted && !isDucked) {
      bgAudio.volume = currentBgVolume;
    }

    if (progress < 1) {
      fadeAnimationId = requestAnimationFrame(updateFade);
    } else {
      currentBgVolume = TARGET_VOLUME;
      if (!muted && !isDucked) bgAudio.volume = TARGET_VOLUME;
    }
  };

  fadeAnimationId = requestAnimationFrame(updateFade);
}

function initBgAudio() {
  if (bgAudio || typeof window === "undefined") return bgAudio;
  const audio = new Audio();
  const canPlayMp3 = audio.canPlayType("audio/mpeg");
  const canPlayM4a = audio.canPlayType("audio/mp4; codecs=\"mp4a.40.2\"");
  
  if (canPlayM4a && !canPlayMp3) {
    audio.src = "/music/bg-music.m4a";
  } else {
    audio.src = "/music/bg-music.mp3";
  }

  audio.loop = true;
  audio.volume = 0;
  audio.preload = "auto";
  bgAudio = audio;
  return bgAudio;
}

export function startBgMusic() {
  if (typeof window === "undefined") return;
  const audio = initBgAudio();
  if (!audio) return;

  if (bgMusicStarted && !audio.paused) return;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        bgMusicStarted = true;
        startBgFade();
        removeInteractionListeners();
      })
      .catch(() => {
        // Autoplay policy prevented playback until explicit user interaction
      });
  }
}

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function resumeCtx() {
  const c = getCtx();
  if (c.state === "suspended") c.resume();
}

// Mark interaction on user gesture & start background music reliably
function handleUserGesture() {
  hasInteracted = true;
  resumeCtx();
  startBgMusic();
}

const GESTURE_EVENTS = ["pointerdown", "touchstart", "click", "keydown", "wheel", "scroll"];

function removeInteractionListeners() {
  if (typeof window === "undefined") return;
  GESTURE_EVENTS.forEach((evt) => {
    window.removeEventListener(evt, handleUserGesture);
  });
}

if (typeof window !== "undefined") {
  GESTURE_EVENTS.forEach((evt) => {
    window.addEventListener(evt, handleUserGesture, { passive: true });
  });
}

function synth(fn: (ctx: AudioContext) => void) {
  if (muted || !hasInteracted) return;
  try { fn(getCtx()); } catch { /* autoplay policy — safe to ignore */ }
}

const sounds: Record<SoundKey, (ctx: AudioContext) => void> = {
  shutter(ctx) {
    // Short percussive click: noise burst + high-pass filter
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    src.connect(hp).connect(gain).connect(ctx.destination);
    src.start();
  },

  thermal(ctx) {
    // Warm low-frequency rattle (thermal head on paper)
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = 1 - i / data.length;
      data[i] = (Math.random() * 2 - 1) * env * 0.4;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    src.connect(lp).connect(gain).connect(ctx.destination);
    src.start();
  },

  stamp(ctx) {
    // Heavy thud: low-freq sine burst + noise
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  },

  keyclick(ctx) {
    // Typewriter key: short mid-freq click
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.3;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    bp.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    src.connect(bp).connect(gain).connect(ctx.destination);
    src.start();
  },

  static(ctx) {
    // VHS tape static: broadband noise, ~300ms
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = i < data.length * 0.1
        ? i / (data.length * 0.1)
        : 1 - (i - data.length * 0.1) / (data.length * 0.9);
      data[i] = (Math.random() * 2 - 1) * env * 0.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    src.connect(gain).connect(ctx.destination);
    src.start();
  },

  "paper-tear"(ctx) {
    // Descending noise burst simulating paper tear
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.pow(1 - i / data.length, 0.5);
      data[i] = (Math.random() * 2 - 1) * env * 0.35;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(4000, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);
    src.connect(lp).connect(ctx.destination);
    src.start();
  },

  jazz(ctx) {
    // Warm electric piano chord (A major 7th: A3, C#4, E4, G#4)
    const freqs = [220.0, 277.18, 329.63, 415.3];
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;

    masterGain.connect(filter).connect(ctx.destination);

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.25 - idx * 0.03, ctx.currentTime);
      osc.connect(oscGain).connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    });
  },

  polaroid(ctx) {
    // Mechanical camera gear whir + eject click
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.18);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);

    // Eject click at end
    setTimeout(() => {
      if (ctx.state === "running") {
        const snap = ctx.createOscillator();
        snap.frequency.setValueAtTime(380, ctx.currentTime);
        const snapGain = ctx.createGain();
        snapGain.gain.setValueAtTime(0.2, ctx.currentTime);
        snapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        snap.connect(snapGain).connect(ctx.destination);
        snap.start();
        snap.stop(ctx.currentTime + 0.05);
      }
    }, 180);
  },

  pop(ctx) {
    // Tactile bubble pop
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.07);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  },

  "tape-rewind"(ctx) {
    // VCR rewind whir
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 500;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  },

  crt(ctx) {
    // CRT screen degauss pulse
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.15);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },
};

export const audioManager = {
  play: (key: SoundKey) => synth(sounds[key]),
  mute: () => {
    muted = true;
    if (bgAudio) bgAudio.volume = 0;
  },
  unmute: () => {
    muted = false;
    if (bgAudio && !isDucked) bgAudio.volume = currentBgVolume || TARGET_VOLUME;
  },
  toggle: () => {
    muted = !muted;
    if (bgAudio) {
      bgAudio.volume = muted || isDucked ? 0 : (currentBgVolume || TARGET_VOLUME);
    }
    return muted;
  },
  duck: (duckActive: boolean) => {
    isDucked = duckActive;
    if (bgAudio) {
      bgAudio.volume = isDucked || muted ? 0 : (currentBgVolume || TARGET_VOLUME);
    }
  },
  isMuted: () => muted,
  startBgMusic: () => startBgMusic(),
};

// Expose globally for ScrollTrigger callbacks that can't import directly
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).audioManager = audioManager;
}

// Component: mounts the interaction listeners and manages background audio
export default function AudioManagerProvider() {
  useEffect(() => {
    startBgMusic();
    return () => {
      if (fadeAnimationId) cancelAnimationFrame(fadeAnimationId);
    };
  }, []);
  return null;
}
