import type { Metadata } from "next";
import { Inter, Space_Grotesk, Dancing_Script, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohit Kumar — Software Engineer",
  icons: {
    icon: "./logo.svg"
  },
  description:
    "Portfolio of Mohit Kumar, a Software Engineer who builds, explores, and creates. Let me show you my journey so far.",
  keywords: ["Mohit Kumar", "Software Engineer", "Portfolio", "Developer", "Tihmo", "mohit"],
  authors: [{ name: "Mohit Kumar" }],
  openGraph: {
    title: "Mohit Kumar — Software Engineer",
    description: "Let me show you what I learn and how I learn it.",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${dancingScript.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
