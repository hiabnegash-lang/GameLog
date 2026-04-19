import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SessionProvider } from "@/components/layout/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "GameLog", template: "%s | GameLog" },
  description: "Track, rate, and review your video game journey. Discover what your friends are playing.",
  keywords: ["video games", "game tracker", "game reviews", "gaming", "game ratings"],
  openGraph: {
    title: "GameLog",
    description: "Track, rate, and review your video game journey.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-dark-border py-8 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                <p>© 2024 GameLog. Built with Next.js, Prisma & love for games.</p>
                <div className="flex gap-6">
                  <a href="/games" className="hover:text-gray-300 transition-colors">Browse Games</a>
                  <a href="/lists" className="hover:text-gray-300 transition-colors">Lists</a>
                </div>
              </div>
            </footer>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1a1d27",
                color: "#f3f4f6",
                border: "1px solid #2a2d3a",
                borderRadius: "10px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#4caf50", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
