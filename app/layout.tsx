import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "CAIP — Climate Action Intelligence Platform",
  description:
    "AI-powered Climate-Smart Agriculture Decision Support System. From data to action.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
