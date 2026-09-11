"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { audioManager } from "./AudioManager";

interface FloatingStickerProps {
  src: string;
  alt: string;
  label?: string;
  initialRotate?: number;
  width?: number;
  height?: number;
  className?: string;
  sound?: "pop" | "stamp" | "static" | "keyclick";
  animVariant?: "default" | "slow" | "drift";
}

const ANIM_MAP = {
  default: "floatOrganic 6.8s ease-in-out infinite",
  slow:    "floatOrganicSlow 9.5s ease-in-out infinite",
  drift:   "floatOrganicDrift 8.1s ease-in-out infinite",
};

export default function FloatingSticker({
  src,
  alt,
  label,
  initialRotate = 0,
  width = 110,
  height = 110,
  className = "",
  sound = "pop",
  animVariant = "default",
}: FloatingStickerProps) {
  const [isPopped,  setIsPopped]  = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Parallax state for hover tilt
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.play(sound);
    setIsPopped(true);
    setTimeout(() => setIsPopped(false), 400);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / rect.height) * 12,
      y: ((e.clientX - cx) / rect.width)  * -12,
    });
  }, []);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={`select-none cursor-pointer z-20 ${className}`}
      style={{
        // Organic float + pop scale, no transition on animation-driven transform
        animation: ANIM_MAP[animVariant],
        transform: isPopped
          ? `rotate(${initialRotate}deg) scale(1.22)`
          : `rotate(${initialRotate + (isHovered ? 3 : 0)}deg) scale(${isHovered ? 1.07 : 1})`,
        transition: isPopped ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        willChange: "transform",
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={label || alt}
    >
      <div className="relative flex flex-col items-center">
        {/* Die-cut sticker with parallax tilt and dynamic shadow */}
        <div
          style={{
            filter: isHovered
              ? `drop-shadow(${tilt.y * 0.4}px ${12 + tilt.x * 0.3}px 28px rgba(0,0,0,0.55))`
              : "drop-shadow(0 10px 22px rgba(0,0,0,0.42)) drop-shadow(0 2px 5px rgba(0,0,0,0.22))",
            transform: isPopped
              ? "scale(1.15) rotate(-6deg)"
              : isHovered
              ? `perspective(400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.04)`
              : "none",
            transition: isPopped
              ? "none"
              : "transform 0.18s ease, filter 0.18s ease",
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="pointer-events-none object-contain"
            style={{ maxHeight: `${height}px`, width: "auto" }}
          />
        </div>

        {/* Vintage sticker label */}
        {label && (
          <div
            className="mt-1 px-2 py-0.5 bg-[#09090b]/90 border border-white/20 text-[#EDE6F2] font-mono text-[9px] tracking-widest uppercase shadow-md pointer-events-none"
            style={{
              whiteSpace: "nowrap",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
