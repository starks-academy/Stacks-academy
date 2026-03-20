"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShieldAlert } from "lucide-react";
import Image from "next/image";
import WalletConnectButton from "./WalletConnectButton";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const navLinks = [
    { name: "Learning Path", href: "/learning-path" },
    { name: "AI Tutor", href: "/ai-tutor" },
    { name: "Builders Connect", href: "/builders-connect" },
    { name: "Profile", href: "/dashboard" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A0B1A]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Stacks Academy"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Stacks Academy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors font-medium text-sm"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-brand-orange hover:text-orange-400 transition-colors font-medium text-sm"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
            <WalletConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#1A1A24] border-b border-gray-800">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-brand-orange hover:text-orange-400 hover:bg-white/5 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ShieldAlert className="w-4 h-4" />
                Admin
              </Link>
            )}
            <div className="pt-2 px-3">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
