"use client";

import { useState } from "react";

interface BarcodeProps {
  value?: string;
  label?: string;
  className?: string;
}

export default function Barcode({
  value = "*09092008-JUANFE-2026*",
  label = "* 0 9 0 9 2 0 0 8 - J U A N F E *",
  className = "",
}: BarcodeProps) {
  const [copied, setCopied] = useState(false);

  // Deterministically generate authentic barcode bar patterns from the value string
  const generateBars = (str: string) => {
    const bars: { width: number; isSpace: boolean }[] = [];
    // Start guard pattern
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 1, isSpace: false });
    bars.push({ width: 2, isSpace: true });

    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      const w1 = (code % 3) + 1;
      const s1 = ((code >> 1) % 2) + 1;
      const w2 = ((code >> 2) % 3) + 1;
      const s2 = ((code >> 3) % 2) + 1;

      bars.push({ width: w1, isSpace: false });
      bars.push({ width: s1, isSpace: true });
      bars.push({ width: w2, isSpace: false });
      bars.push({ width: s2, isSpace: true });
    }

    // Stop guard pattern
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 2, isSpace: false });

    return bars;
  };

  const bars = generateBars(value);
  const totalUnits = bars.reduce((acc, b) => acc + b.width, 0);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let currentX = 0;

  return (
    <div
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      title="Tap para copiar ID de registro"
      aria-label={`Código de barras: ${value}`}
      className={`cursor-pointer group select-none flex flex-col items-center justify-center p-2 rounded-xs transition-opacity hover:opacity-90 active:scale-[0.99] ${className}`}
    >
      <div className="w-full max-w-[280px] sm:max-w-[340px] h-12 sm:h-14">
        <svg
          viewBox={`0 0 ${totalUnits} 48`}
          preserveAspectRatio="none"
          className="w-full h-full"
          shapeRendering="crispEdges"
        >
          {bars.map((bar, idx) => {
            const x = currentX;
            currentX += bar.width;
            if (bar.isSpace) return null;
            return (
              <rect
                key={idx}
                x={x}
                y="0"
                width={bar.width}
                height="48"
                fill="#1A1916"
              />
            );
          })}
        </svg>
      </div>

      <div className="font-receipt text-[10px] sm:text-[11px] tracking-[0.25em] text-[#1A1916] mt-1.5 uppercase font-medium">
        {copied ? "✓ ID COPIADO EN PORTAPAPELES" : label}
      </div>
    </div>
  );
}
