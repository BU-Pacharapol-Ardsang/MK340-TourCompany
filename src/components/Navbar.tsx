"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrandMark from "./BrandMark";

const navLinks = [
  { href: "#packages", label: "แพ็กเกจ" },
  { href: "#why-us", label: "เหตุผลที่เลือกเรา" },
  { href: "#contact", label: "ปรึกษาทริป" },
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
        scrolled ? "px-4 py-3" : "px-4 py-5"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "glass-panel border-[color:var(--line)] py-3"
            : "border-transparent bg-white/20 py-3 backdrop-blur-md"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <BrandMark size="sm" showWordmark />
          <span
            className={`hidden text-xs uppercase tracking-[0.32em] transition-colors sm:block ${
              scrolled ? "text-[color:var(--muted)]" : "text-[color:#5f514c]"
            }`}
          >
            Soft Journey Studio
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[color:var(--lavender-deep)] ${
                scrolled ? "text-[color:var(--foreground)]" : "text-[color:#4f423d]"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[color:var(--lavender-deep)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[color:var(--earth-deep)]"
          >
            คุยแผนทริป
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
                scrolled ? "bg-[color:var(--foreground)]" : "bg-[color:#5b4d48]"
              }`}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div className="mx-4 mt-3 rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[0_24px_64px_-42px_rgba(88,63,58,0.55)] md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-[color:var(--foreground)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[color:var(--lavender-deep)] px-5 py-2.5 text-center font-semibold text-white"
            >
              คุยแผนทริป
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
