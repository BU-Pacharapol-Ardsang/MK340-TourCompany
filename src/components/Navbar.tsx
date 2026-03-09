"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#packages", label: "แพ็กเกจทัวร์" },
  { href: "#why-us", label: "ทำไมต้องเรา" },
  { href: "#contact", label: "ติดต่อ" },
];

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
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/25">
            TT
          </span>
          <span
            className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled ? "text-blue-700" : "text-white"
            }`}
          >
            Travie <span className="font-light">Tours</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
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
            className="rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-green-600"
          >
            แชตเลย
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-0.5 w-6 rounded transition-colors ${
                scrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t bg-white shadow-lg md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-gray-700"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-500 px-5 py-2.5 text-center font-semibold text-white"
            >
              แชตเลย
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
