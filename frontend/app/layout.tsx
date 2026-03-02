import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Pomodoro | Focus smarter, work better",
  description:
    "Track Pomodoro sessions, build focus habits, and achieve more with structured breaks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased bg-slate-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
