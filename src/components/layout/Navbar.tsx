"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Gamepad2, Search, Bell, User, LogOut, List, BookOpen, ChevronDown, Menu, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-gradient">GameLog</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/games" className="btn-ghost">Games</Link>
            <Link href="/lists" className="btn-ghost">Lists</Link>
            {session && <Link href="/diary" className="btn-ghost">Diary</Link>}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/search"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-dark-hover border border-dark-border rounded-lg px-3 py-1.5 transition-colors w-48"
            >
              <Search className="w-4 h-4" />
              <span>Search games…</span>
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 btn-ghost rounded-full"
                >
                  <Avatar
                    src={user?.avatarUrl}
                    name={user?.name ?? user?.username ?? "U"}
                    size="sm"
                  />
                  <span className="text-sm text-gray-300">{user?.username}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-52 card shadow-xl shadow-black/40 py-1 z-50">
                    <Link
                      href={`/users/${user?.username}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-hover transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-hover transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" /> Settings
                    </Link>
                    <Link
                      href="/lists"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-hover transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <List className="w-4 h-4" /> My Lists
                    </Link>
                    <hr className="border-dark-border my-1" />
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-hover transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-ghost">Sign In</Link>
                <Link href="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn-ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark-card/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            <Link href="/search" className="flex items-center gap-2 input text-gray-400">
              <Search className="w-4 h-4" /> Search games…
            </Link>
            <Link href="/games" className="block btn-ghost w-full text-left" onClick={() => setMobileOpen(false)}>Games</Link>
            <Link href="/lists" className="block btn-ghost w-full text-left" onClick={() => setMobileOpen(false)}>Lists</Link>
            {session ? (
              <>
                <Link href="/diary" className="block btn-ghost w-full text-left" onClick={() => setMobileOpen(false)}>Diary</Link>
                <Link href={`/users/${user?.username}`} className="block btn-ghost w-full text-left" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block btn-danger w-full text-left mt-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="btn-secondary flex-1 justify-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/register" className="btn-primary flex-1 justify-center" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
