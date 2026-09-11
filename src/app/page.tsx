"use client";

import SmoothScroll from "@/components/SmoothScroll";
import GrainOverlay from "@/components/GrainOverlay";
import AudioManagerProvider from "@/components/AudioManager";
import SceneHUD from "@/components/SceneHUD";
import MuseumNav from "@/components/MuseumNav";
import CinematicDeck from "@/components/CinematicDeck";

export default function Home() {
  return (
    <SmoothScroll>
      {/* Capas fijas de infraestructura cinematográfica */}
      <GrainOverlay />
      <AudioManagerProvider />
      <SceneHUD />
      <MuseumNav />

      {/* Plataforma escénica: 9 escenas en corte cerrado guiado por scroll */}
      <main className="relative w-full overflow-x-hidden">
        <CinematicDeck />
      </main>
    </SmoothScroll>
  );
}
