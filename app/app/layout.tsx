import type { Metadata } from "next";
import { Inter, Space_Grotesk, Dancing_Script } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Mohit Kumar — Software Engineer",
  description:
    "Portfolio of Mohit Kumar, a Software Engineer who builds, explores, and creates. Let me show you my journey so far.",
  keywords: ["Mohit Kumar", "Software Engineer", "Portfolio", "Developer", "Tihmo"],
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${dancingScript.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
