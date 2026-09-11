"use client";

import { useState } from "react";
import Image from "next/image";

interface ReceiptPhotoProps {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
}

export default function ReceiptPhoto({
  src = "/juanfe.jpg",
  alt = "JuanFe (Juan Fernando Ospina Tigreros)",
  caption = "FIG. 01 — TITULAR: DE «FERNAN» A «JUANFE»",
  className = "",
}: ReceiptPhotoProps) {
  const [revealed, setRevealed] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`w-full my-6 flex flex-col items-center ${className}`}>
      {/* Outer photobooth container */}
      <div
        onClick={() => setRevealed((prev) => !prev)}
        role="button"
        tabIndex={0}
        aria-label="Tocar para revelar foto en color o filtro térmico"
        title="Toca para alternar entre impresión térmica y color real"
        className="cursor-pointer group relative border-2 border-dashed border-[#1A1916]/30 p-2 sm:p-2.5 bg-[#FAF7F0] max-w-[240px] sm:max-w-[260px] w-full transition-all hover:border-[#1A1916]/60 active:scale-[0.98]"
      >
        {/* Top photobooth stamp metadata */}
        <div className="flex items-center justify-between font-receipt text-[9px] text-[#6D6960] mb-1.5 px-0.5 uppercase tracking-wider">
          <span>DOC-ID: JF-090908</span>
          <span className="font-semibold text-[#1A1916]">
            {revealed ? "[ COLOR ]" : "[ TÉRMICO ]"}
          </span>
        </div>

        {/* Image viewport */}
        <div className="relative aspect-4/5 w-full overflow-hidden bg-[#E8E4D8] border border-[#1A1916]/20">
          {!imageError ? (
            <>
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 240px, 260px"
                className={`object-cover ${revealed ? "receipt-photo-filter revealed" : "receipt-photo-filter"}`}
                onError={() => setImageError(true)}
                priority
              />
              {/* Thermal dot overlay texture */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${revealed ? "opacity-0" : "opacity-30"
                  }`}
                style={{
                  backgroundImage:
                    "radial-gradient(#1A1916 0.75px, transparent 0.75px)",
                  backgroundSize: "4px 4px",
                }}
              />
            </>
          ) : (
            /* Elegant artistic fallback when juanfe.jpg is not yet placed in /public */
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-[#EAE6DB]">
              <div className="w-16 h-16 rounded-full border border-dashed border-[#1A1916]/40 flex items-center justify-center mb-3">
                <span className="font-receipt font-bold text-lg text-[#1A1916]">
                  JF
                </span>
              </div>
              <div className="font-receipt text-[11px] font-bold text-[#1A1916] uppercase tracking-wide mb-1">
                ESPACIO FOTOGRÁFICO
              </div>
              <p className="font-receipt text-[9px] text-[#6D6960] leading-tight max-w-[160px]">
                Coloca tu foto en <code className="text-[#1A1916]">/public/juanfe.jpg</code>
              </p>
              <div className="mt-2.5 font-receipt text-[8px] uppercase tracking-widest text-[#1A1916]/60 bg-[#DED9CC] px-2 py-0.5">
                JUANFE · RETRATO
              </div>
            </div>
          )}

          {/* Interactive tap hint badge */}
          <div className="absolute bottom-1.5 right-1.5 bg-[#1A1916]/80 text-[#FAF7F0] font-receipt text-[8px] px-1.5 py-0.5 uppercase tracking-wider backdrop-blur-xs">
            {revealed ? "Tap: Térmico" : "Tap: Color"}
          </div>
        </div>

        {/* Photobooth bottom label */}
        <div className="font-receipt text-[9px] text-center text-[#1A1916]/75 mt-2 uppercase tracking-wide">
          {caption}
        </div>
      </div>
    </div>
  );
}
