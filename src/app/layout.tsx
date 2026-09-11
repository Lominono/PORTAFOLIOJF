import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, Geist_Mono, Space_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JuanFe — Relato Cinematográfico & Portafolio",
  description:
    "Espacio interactivo de Juan Fernando Ospina (JuanFe). 18 años, de Ginebra (Colombia) a Santander (España). Desarrollo creativo, Linux y jazz.",
  authors: [
    { name: "JuanFe", url: "https://github.com/Lominono" },
    { name: "Juanfer_ost", url: "https://instagram.com/Juanfer_ost" },
  ],
  openGraph: {
    title: "JuanFe — Relato Cinematográfico",
    description: "18 años · Ginebra (Valle del Cauca) ➔ Santander (España). Experiencia interactiva conducida por scroll.",
    url: "https://github.com/Lominono",
    siteName: "JuanFe Portfolio",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  viewportFit: "cover",  // iOS safe-area-inset support
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${plusJakartaSans.variable} ${geistMono.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-[#1B1A17] font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
