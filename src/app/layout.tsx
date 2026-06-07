import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/config";
import PendoInit from "@/components/PendoInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  openGraph: {
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
  },
};

const NOVUS_PROJECT_ID = process.env.NEXT_PUBLIC_NOVUS_PROJECT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {NOVUS_PROJECT_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(apiKey){(function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');})('${NOVUS_PROJECT_ID}');`,
            }}
          />
        ) : null}
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        {NOVUS_PROJECT_ID ? <PendoInit /> : null}
      </body>
    </html>
  );
}
