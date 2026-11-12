import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYBRID.OPS | Vibrant Aurora Glassmorphic Pipeline Command Center",
  description:
    "Ultra-luxurious, colorful, modern B2B Lead & Pipeline Command Center with real-time n8n webhook ingestion, hot lead radar, and AI outreach studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 antialiased selection:bg-violet-500/20 selection:text-violet-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
