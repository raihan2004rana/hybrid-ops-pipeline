import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hybrid-Ops | Strategic Technology & Development Partnerships",
  description:
    "Hybrid-Ops connects ambitious businesses and digital agencies with skilled development partners to build, scale, and maintain exceptional digital experiences.",
  icons: {
    icon: "/images/hybrid-ops-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#f8fafc] text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
