"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import SawtoothEdge from "./SawtoothEdge";
import Barcode from "./Barcode";

export default function ReceiptTicket() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isPhotoDithered, setIsPhotoDithered] = useState(true);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("es-ES", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const ms = String(now.getMilliseconds()).padStart(3, "0");
      setCurrentTime(`${timeStr}.${ms}`);
      setCurrentDate(
        now.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 47);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="sala-ticket"
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-8 lg:px-16 pt-20 pb-12 transition-colors duration-700 select-none overflow-hidden"
    >
      {/* Cinematic Scene Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between font-receipt text-[10px] sm:text-xs text-[var(--scene-muted)] uppercase tracking-widest pb-4 border-b border-[var(--scene-border)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--scene-accent)] animate-pulse" />
          <span className="font-bold text-[var(--scene-fg)]">
            ESCENA 01 &bull; REGISTRO TÉRMICO SUIZO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">SDR // 43.4623° N</span>
          <span className="font-mono text-[var(--scene-accent)] font-semibold">
            {currentTime || "00:00:00.000"}
          </span>
        </div>
      </div>

      {/* Main Full-Bleed Content: Editorial 2-Column Reel */}
      <div className="w-full max-w-6xl my-auto py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Column: Typographic Monument */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 font-receipt text-xs text-[var(--scene-muted)] uppercase tracking-[0.25em] mb-3">
            <span>[ ARCHIVO CONTINUO 09.09.2008 ]</span>
            <span className="w-8 h-px bg-[var(--scene-border)]" />
            <span className="text-[var(--scene-accent)] font-bold">ACTIVO</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-[var(--scene-fg)] font-normal tracking-tighter leading-[0.95] uppercase">
            JUANFE
          </h1>

          <div className="font-receipt text-sm sm:text-base text-[var(--scene-fg)]/80 mt-3 tracking-wide uppercase font-semibold">
            Juan Fernando Ospina Tigreros &bull; 18 Años
          </div>

          <p className="font-sans text-base sm:text-lg text-[var(--scene-fg)]/75 mt-6 leading-relaxed max-w-xl font-light">
            De Palmira y Ginebra (Colombia) a Santander (España). Estudiante de{" "}
            <strong className="font-medium text-[var(--scene-fg)]">
              Sistemas Microinformáticos y Redes (SMR)
            </strong>
            . Este archivo registra cada paso, cada cable tendido y cada obsesión analógica con la
            precisión limpia de un ticket de máquina.
          </p>

          {/* Real-time Telemetry Grid */}
          <div className="mt-8 pt-6 border-t border-dashed border-[var(--scene-border)] grid grid-cols-2 sm:grid-cols-3 gap-4 font-receipt text-xs">
            <div>
              <span className="text-[10px] text-[var(--scene-muted)] block uppercase">FECHA EMISIÓN</span>
              <span className="font-bold text-[var(--scene-fg)]">{currentDate || "11/09/2026"}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--scene-muted)] block uppercase">ESTADO SISTEMA</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">100% OPERATIVO</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[var(--scene-muted)] block uppercase">UBICACIÓN</span>
              <span className="font-bold text-[var(--scene-fg)]">SANTANDER, ESPAÑA</span>
            </div>
          </div>

          {/* Interactive Barcode Laser Module */}
          <div className="mt-8 max-w-md">
            <Barcode />
          </div>
        </motion.div>

        {/* Right Column: High-Impact Thermal Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-5 flex flex-col items-center lg:items-end"
        >
          <div
            onClick={() => setIsPhotoDithered((prev) => !prev)}
            role="button"
            tabIndex={0}
            title="Toca para alternar entre impresión térmica o color natural"
            className="group relative cursor-pointer p-3.5 bg-[var(--scene-card-bg)] backdrop-blur-xs border border-[var(--scene-border)] shadow-[0_20px_50px_rgba(0,0,0,0.08)] max-w-[280px] sm:max-w-[320px] w-full transition-all duration-300 hover:border-[var(--scene-accent)]"
          >
            {/* Stamp Header */}
            <div className="flex items-center justify-between font-receipt text-[10px] text-[var(--scene-muted)] uppercase mb-2 tracking-wider">
              <span>DOC // RETRATO 01</span>
              <span className="font-bold text-[var(--scene-accent)]">
                {isPhotoDithered ? "[ MODO TÉRMICO ]" : "[ COLOR ORIGINAL ]"}
              </span>
            </div>

            {/* Photo Container */}
            <div className="relative aspect-3/4 w-full overflow-hidden bg-[#181715] border border-[var(--scene-border)]">
              <Image
                src="/juanfe-reciente-1.jpg"
                alt="JuanFe sonriendo - Juan Fernando Ospina Tigreros"
                fill
                sizes="(max-width: 640px) 280px, 320px"
                priority
                className={`object-cover transition-all duration-500 ${
                  isPhotoDithered ? "thermal-photo-dither" : "active-color scale-102"
                }`}
              />

              {/* Thermal Dot Overlay */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isPhotoDithered ? "opacity-35" : "opacity-0"
                }`}
                style={{
                  backgroundImage: "radial-gradient(#181715 0.75px, transparent 0.75px)",
                  backgroundSize: "3px 3px",
                }}
              />

              <div className="absolute bottom-2 right-2 bg-black/75 text-white font-receipt text-[9px] px-2 py-0.5 backdrop-blur-xs rounded-xs">
                {isPhotoDithered ? "Toca: Revelar Color" : "Toca: Filtro Térmico"}
              </div>
            </div>

            <div className="mt-3 text-center font-receipt text-[10px] text-[var(--scene-muted)] tracking-wider uppercase">
              JuanFe &bull; Santander &bull; Retrato Actual
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sawtooth Perforation Ribbon Bottom */}
      <div className="w-full max-w-6xl mt-6 pt-4 border-t border-[var(--scene-border)]">
        <SawtoothEdge position="bottom" paperColor="var(--scene-bg)" />
      </div>
    </section>
  );
}
