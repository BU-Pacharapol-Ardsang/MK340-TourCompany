"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span
            className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled ? "text-blue-700" : "text-white"
            }`}
          >
            MK340 <span className="font-light">Tours</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "#packages", label: "แพ็กเกจทัวร์" },
            { href: "#why-us", label: "ทำไมต้องเรา" },
            { href: "#contact", label: "ติดต่อ" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                scrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105"
          >
            💬 แชทเลย
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-6 h-0.5 rounded transition-colors ${
                scrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="flex flex-col px-6 py-4 gap-4">
            {[
              { href: "#packages", label: "แพ็กเกจทัวร์" },
              { href: "#why-us", label: "ทำไมต้องเรา" },
              { href: "#contact", label: "ติดต่อ" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white text-center font-semibold px-5 py-2.5 rounded-full"
            >
              💬 แชทเลย
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
