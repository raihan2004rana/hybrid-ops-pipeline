import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HYBRID.OPS | High-Converting Agency & Automated Growth Infrastructure",
  description:
    "Turn your static website into a 24/7 client-acquisition machine. Bespoke Wix Studio engineering, Velo development, and automated B2B lead generation pipelines for real estate, creative agencies, and high-ticket brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#09090b] text-white antialiased selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
