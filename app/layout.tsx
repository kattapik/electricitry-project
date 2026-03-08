import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EnergySync - Smart Home Monitor",
  description: "Energy consumption dashboard for smart home monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <div className="flex h-[100dvh] w-full overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 bg-background overflow-hidden relative">
            <Topbar />
            <div className="flex-1 overflow-auto h-full w-full">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
