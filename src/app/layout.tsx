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
  metadataBase: new URL("https://mohitkumar.qzz.io"),
  title: "Mohit Kumar — Software Engineer",
  description:
    "Portfolio of Mohit Kumar, a Software Engineer who builds, explores, and creates. Let me show you my journey so far.",
  keywords: ["Mohit Kumar", "Software Engineer", "Portfolio", "Developer", "Tihmo", "mohit"],
  authors: [{ name: "Mohit Kumar", url: "https://mohitkumar.qzz.io" }],
  creator: "Mohit Kumar",
  alternates: {
    canonical: "https://mohitkumar.qzz.io",
  },
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Mohit Kumar — Software Engineer",
    description:
      "Portfolio of Mohit Kumar, a Software Engineer who builds, explores, and creates. Let me show you my journey so far.",
    url: "https://mohitkumar.qzz.io",
    siteName: "Mohit Kumar Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohit Kumar — Software Engineer",
    description:
      "Portfolio of Mohit Kumar, a Software Engineer who builds, explores, and creates. Let me show you my journey so far.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohit Kumar",
  url: "https://mohitkumar.qzz.io",
  jobTitle: "Software Engineer",
  sameAs: [
    "https://github.com/mohitkumar64",
    "https://www.linkedin.com/in/mohit-kumar-339a84330",
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
