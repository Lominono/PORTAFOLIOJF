"use client";

export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="grain-overlay select-none"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="analog-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#analog-grain)" />
      </svg>
    </div>
  );
}
