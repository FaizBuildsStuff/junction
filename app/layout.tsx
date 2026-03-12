import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Junction | Track & Predict Your Dev Stack Costs",
  description: "The million-dollar cost intelligence platform for modern dev teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        {/* External Fontshare Link */}
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@401,500,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className="antialiased bg-[#F2F9F1] text-[#162C25]"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}