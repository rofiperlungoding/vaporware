import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Characterful editorial serif for display — the main personality driver, and a
// deliberate break from the Inter/Geist-everywhere "AI default" look.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // When you get your Novus snippet, drop its src/init here. The <Script> slot
  // below keeps it out of the React tree and loads it after the page is interactive.
  const novusSnippet = process.env.NEXT_PUBLIC_NOVUS_SNIPPET_URL;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {novusSnippet ? (
          <Script src={novusSnippet} strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  );
}
